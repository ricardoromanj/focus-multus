import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateCreditCost } from '@/lib/credits';
import { getDurationInMinutes } from '@/lib/datetime';
import type { RoomType } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') || 'active';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('bookings')
      .select('*, room:rooms(*), user:users(*)')
      .eq('status', status)
      .order('start_time', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (startDate && endDate) {
      query = query
        .gte('start_time', startDate)
        .lte('end_time', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room_id, user_id, start_time, end_time } = body;

    // Validate required fields
    if (!room_id || !user_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate credit cost
    const duration = getDurationInMinutes(start_time, end_time);
    const creditCost = calculateCreditCost(room.room_type as RoomType, duration);

    // Check if user has sufficient credits
    if (user.current_credits < creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const { data: overlappingBookings, error: overlapError } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', room_id)
      .eq('status', 'active')
      .or(`and(start_time.lt.${end_time},end_time.gt.${start_time})`);

    if (overlapError) throw overlapError;

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Room is already booked for this time slot' },
        { status: 409 }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        room_id,
        user_id,
        start_time,
        end_time,
        credits_spent: creditCost,
        status: 'active'
      })
      .select('*, room:rooms(*), user:users(*)')
      .single();

    if (bookingError) throw bookingError;

    // Deduct credits from user
    const { error: creditError } = await supabase
      .from('users')
      .update({ current_credits: user.current_credits - creditCost })
      .eq('id', user_id);

    if (creditError) throw creditError;

    // Log credit transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id,
        amount: -creditCost,
        reason: `Booking ${room.name} from ${start_time} to ${end_time}`,
        booking_id: booking.id
      });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

