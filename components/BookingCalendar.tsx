'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterBar } from './FilterBar';
import { TimeGrid } from './TimeGrid';
import { BookingDialog } from './BookingDialog';
import { supabase } from '@/lib/supabase';
import type { Booking, Room, RoomType } from '@/types';

interface BookingCalendarProps {
  userId: string;
  onBookingComplete?: () => void;
}

export function BookingCalendar({ userId, onBookingComplete }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [roomTypeFilter, setRoomTypeFilter] = useState<RoomType | 'all'>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  // Fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    }
    fetchRooms();
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings?status=active');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const handleTimeSlotSelect = (start: Date, end: Date) => {
    setSelectedTimeRange({ start, end });
    setDialogOpen(true);
  };

  const handleBookingComplete = () => {
    setDialogOpen(false);
    setSelectedTimeRange(null);
    fetchBookings();
    onBookingComplete?.();
  };

  const filteredRooms = roomTypeFilter === 'all' 
    ? rooms 
    : rooms.filter(r => r.room_type === roomTypeFilter);

  return (
    <div className="space-y-6">
      <FilterBar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        roomTypeFilter={roomTypeFilter}
        onRoomTypeChange={setRoomTypeFilter}
      />
      
      <TimeGrid
        currentDate={currentDate}
        bookings={bookings}
        rooms={filteredRooms}
        allRooms={rooms}
        roomTypeFilter={roomTypeFilter}
        onTimeSlotSelect={handleTimeSlotSelect}
        loading={loading}
      />

      {dialogOpen && selectedTimeRange && (
        <BookingDialog
          userId={userId}
          startTime={selectedTimeRange.start}
          endTime={selectedTimeRange.end}
          rooms={rooms}
          existingBookings={bookings}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTimeRange(null);
          }}
          onComplete={handleBookingComplete}
        />
      )}
    </div>
  );
}

