import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomType = searchParams.get('type');

    let query = supabase
      .from('rooms')
      .select('*')
      .order('name');

    if (roomType && (roomType === 'focus' || roomType === 'conference')) {
      query = query.eq('room_type', roomType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

