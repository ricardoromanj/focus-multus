export type RoomType = 'focus' | 'conference';
export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  current_credits: number;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  room_type: RoomType;
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  credits_spent: number;
  status: BookingStatus;
  created_at: string;
  room?: Room;
  user?: User;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  booking_id?: string;
  created_at: string;
}

export interface TimeSlot {
  hour: number;
  minute: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

