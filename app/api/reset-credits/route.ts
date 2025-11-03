import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Reset all users to 10 credits
    const { error } = await supabase
      .from('users')
      .update({ current_credits: 10 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all users

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Credits reset successfully for all users' 
    });
  } catch (error) {
    console.error('Error resetting credits:', error);
    return NextResponse.json(
      { error: 'Failed to reset credits' },
      { status: 500 }
    );
  }
}

