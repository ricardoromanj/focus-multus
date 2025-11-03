'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { getWeekDays, generateTimeSlots, formatDateShort, formatTime, timesOverlap } from '@/lib/datetime';
import { format, isSameDay, set } from 'date-fns';
import type { Booking, Room, RoomType } from '@/types';

interface TimeGridProps {
  currentDate: Date;
  bookings: Booking[];
  rooms: Room[];
  allRooms: Room[];
  roomTypeFilter: RoomType | 'all';
  onTimeSlotSelect: (start: Date, end: Date) => void;
  loading: boolean;
}

export function TimeGrid({
  currentDate,
  bookings,
  rooms,
  allRooms,
  roomTypeFilter,
  onTimeSlotSelect,
  loading
}: TimeGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: Date; time: { hour: number; minute: number } } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ day: Date; time: { hour: number; minute: number } } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weekDays = getWeekDays(currentDate);
  const timeSlots = generateTimeSlots(8, 20);

  const handleMouseDown = (day: Date, time: { hour: number; minute: number }) => {
    const now = new Date();
    const slotDate = set(day, { hours: time.hour, minutes: time.minute, seconds: 0, milliseconds: 0 });
    
    // Don't allow selecting past times
    if (slotDate < now) return;
    
    setIsDragging(true);
    setDragStart({ day, time });
    setDragEnd({ day, time });
  };

  const handleMouseEnter = (day: Date, time: { hour: number; minute: number }) => {
    if (isDragging && dragStart) {
      // Only allow dragging within the same day
      if (isSameDay(day, dragStart.day)) {
        setDragEnd({ day, time });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      const startTime = set(dragStart.day, {
        hours: dragStart.time.hour,
        minutes: dragStart.time.minute,
        seconds: 0,
        milliseconds: 0
      });
      
      const endTime = set(dragEnd.day, {
        hours: dragEnd.time.hour,
        minutes: dragEnd.time.minute + 15, // Add 15 minutes to include the end slot
        seconds: 0,
        milliseconds: 0
      });

      // Ensure start is before end
      const finalStart = startTime < endTime ? startTime : endTime;
      const finalEnd = startTime < endTime ? endTime : startTime;

      onTimeSlotSelect(finalStart, finalEnd);
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const isSlotSelected = useCallback((day: Date, time: { hour: number; minute: number }) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    if (!isSameDay(day, dragStart.day)) return false;

    const slotMinutes = time.hour * 60 + time.minute;
    const startMinutes = dragStart.time.hour * 60 + dragStart.time.minute;
    const endMinutes = dragEnd.time.hour * 60 + dragEnd.time.minute;

    const minMinutes = Math.min(startMinutes, endMinutes);
    const maxMinutes = Math.max(startMinutes, endMinutes);

    return slotMinutes >= minMinutes && slotMinutes <= maxMinutes;
  }, [isDragging, dragStart, dragEnd]);

  // Get bookings for a specific day and calculate blocked slots
  const getBookingsForDay = useCallback((day: Date) => {
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.start_time);
      return isSameDay(bookingStart, day);
    });
  }, [bookings]);

  // Check if a time slot is blocked (no available rooms)
  const isSlotBlocked = useCallback((day: Date, time: { hour: number; minute: number }) => {
    const slotStart = set(day, {
      hours: time.hour,
      minutes: time.minute,
      seconds: 0,
      milliseconds: 0
    });
    const slotEnd = set(day, {
      hours: time.hour,
      minutes: time.minute + 15,
      seconds: 0,
      milliseconds: 0
    });

    const relevantRooms = roomTypeFilter === 'all' ? allRooms : 
      allRooms.filter(r => r.room_type === roomTypeFilter);

    // Check if all rooms are booked
    const availableRooms = relevantRooms.filter(room => {
      const roomBookings = bookings.filter(b => 
        b.room_id === room.id && 
        b.status === 'active' &&
        timesOverlap(b.start_time, b.end_time, slotStart, slotEnd)
      );
      return roomBookings.length === 0;
    });

    return availableRooms.length === 0;
  }, [bookings, allRooms, roomTypeFilter]);

  const now = new Date();

  return (
    <div 
      ref={gridRef}
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--color-fm-surface)',
        borderColor: 'var(--color-fm-border)'
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-fm-aqua-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p style={{ color: 'var(--color-fm-text-secondary)' }}>Loading calendar...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header with day names */}
            <div className="grid grid-cols-8 border-b" style={{ borderColor: 'var(--color-fm-border)' }}>
              <div className="p-4" style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}>
                <span className="text-micro uppercase tracking-wide" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                  Time
                </span>
              </div>
              {weekDays.map((day) => {
                const isToday = isSameDay(day, now);
                return (
                  <div
                    key={day.toISOString()}
                    className="p-4 text-center"
                    style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}
                  >
                    <div className="text-micro uppercase tracking-wide" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                      {format(day, 'EEE')}
                    </div>
                    <div
                      className={`text-body font-semibold mt-1 ${isToday ? 'text-fm-aqua-500' : ''}`}
                      style={{ color: isToday ? 'var(--color-fm-aqua-500)' : 'var(--color-fm-text)' }}
                    >
                      {formatDateShort(day).split(' ')[1]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="relative">
              {timeSlots.map((slot, index) => {
                const isHourMark = slot.minute === 0;
                
                return (
                  <div
                    key={`${slot.hour}-${slot.minute}`}
                    className="grid grid-cols-8 border-b"
                    style={{ 
                      borderColor: 'var(--color-fm-border)',
                      borderBottomWidth: isHourMark ? '1px' : '0.5px',
                      opacity: isHourMark ? 1 : 0.5
                    }}
                  >
                    {/* Time label */}
                    <div
                      className="p-2 text-right pr-4"
                      style={{ 
                        backgroundColor: 'var(--color-fm-bg)',
                        minHeight: '40px'
                      }}
                    >
                      {isHourMark && (
                        <span className="text-sm font-medium" style={{ color: 'var(--color-fm-text-secondary)' }}>
                          {formatTime(set(new Date(), { hours: slot.hour, minutes: 0 }))}
                        </span>
                      )}
                    </div>

                    {/* Day cells */}
                    {weekDays.map((day) => {
                      const slotDate = set(day, { hours: slot.hour, minutes: slot.minute });
                      const isPast = slotDate < now;
                      const isSelected = isSlotSelected(day, slot);
                      const isBlocked = isSlotBlocked(day, slot);
                      const dayBookings = getBookingsForDay(day);
                      
                      return (
                        <div
                          key={`${day.toISOString()}-${slot.hour}-${slot.minute}`}
                          className={`relative border-l cursor-pointer transition-smooth ${
                            isPast ? 'cursor-not-allowed' : ''
                          }`}
                          style={{
                            borderColor: 'var(--color-fm-border)',
                            backgroundColor: isSelected
                              ? 'var(--color-fm-aqua-500)'
                              : isBlocked && !isPast
                              ? 'var(--color-fm-surface-elevated)'
                              : isPast
                              ? 'var(--color-fm-bg)'
                              : 'transparent',
                            opacity: isPast ? 0.3 : 1,
                            minHeight: '40px'
                          }}
                          onMouseDown={() => !isPast && handleMouseDown(day, slot)}
                          onMouseEnter={() => handleMouseEnter(day, slot)}
                        >
                          {isBlocked && !isPast && slot.minute === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium px-2 py-1 rounded" style={{
                                color: 'var(--color-fm-text-tertiary)',
                                backgroundColor: 'var(--color-fm-surface)'
                              }}>
                                Full
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

