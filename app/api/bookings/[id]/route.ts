import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (updateError) throw updateError;

    // Refund credits to user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('current_credits')
      .eq('id', booking.user_id)
      .single();

    if (userError || !user) throw userError;

    const { error: creditError } = await supabase
      .from('users')
      .update({ current_credits: user.current_credits + booking.credits_spent })
      .eq('id', booking.user_id);

    if (creditError) throw creditError;

    // Log credit transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: booking.user_id,
        amount: booking.credits_spent,
        reason: `Refund for cancelled booking`,
        booking_id: booking.id
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

