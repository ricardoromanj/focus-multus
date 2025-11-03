'use client';

import { useState, useRef, useCallback } from 'react';
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
  
  // Calculate current time position for indicator
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = 8 * 60; // 8 AM
  const endMinutes = 20 * 60; // 8 PM
  const isCurrentTimeInRange = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  const currentTimePosition = ((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;

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

  // Check if a time slot is blocked (no available rooms) and get block info
  const getSlotBlockInfo = useCallback((day: Date, time: { hour: number; minute: number }) => {
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

    const isBlocked = availableRooms.length === 0 && relevantRooms.length > 0;
    let label = '';
    
    if (isBlocked) {
      if (roomTypeFilter === 'focus') {
        label = 'All Focus Rooms Reserved';
      } else if (roomTypeFilter === 'conference') {
        label = 'All Conference Rooms Reserved';
      } else {
        label = 'All Rooms Reserved';
      }
    }

    return { isBlocked, label };
  }, [bookings, allRooms, roomTypeFilter]);

  return (
    <div 
      ref={gridRef}
      className="rounded-2xl border shadow-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--color-fm-surface)',
        borderColor: 'var(--color-fm-border)'
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-20 px-4 sm:px-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-fm-aqua-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p style={{ color: 'var(--color-fm-text-secondary)' }}>Loading calendar...</p>
          </div>
        </div>
      ) : (
        <div 
          className="overflow-x-auto p-6 sm:p-8"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="min-w-[800px] sm:min-w-[1000px]">
            {/* Header with day names */}
            <div className="grid grid-cols-8 border-b" style={{ borderColor: 'var(--color-fm-border)' }}>
              <div className="py-3 sm:py-4 w-20 sm:w-28 sticky left-0 z-10" style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}>
                <span className="text-micro uppercase tracking-wide" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                  Time
                </span>
              </div>
              {weekDays.map((day) => {
                const isToday = isSameDay(day, now);
                return (
                  <div
                    key={day.toISOString()}
                    className="py-4 text-center border-l"
                    style={{ 
                      backgroundColor: isToday ? 'rgba(34, 181, 173, 0.1)' : 'var(--color-fm-surface-elevated)',
                      borderColor: 'var(--color-fm-border)'
                    }}
                  >
                    <div 
                      className="text-sm font-medium uppercase tracking-wide"
                      style={{ color: isToday ? 'var(--color-fm-aqua-400)' : 'var(--color-fm-text-secondary)' }}
                    >
                      {format(day, 'EEE')}
                    </div>
                    <div
                      className={`text-2xl font-bold mt-1`}
                      style={{ color: isToday ? 'var(--color-fm-aqua-400)' : 'var(--color-fm-text)' }}
                    >
                      {formatDateShort(day).split(' ')[1]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="relative">
              {timeSlots.map((slot, slotIdx) => {
                const isHourMark = slot.minute === 0;
                
                return (
                  <div
                    key={`${slot.hour}-${slot.minute}`}
                    className="grid grid-cols-8 border-b"
                    style={{ 
                      borderColor: isHourMark ? 'var(--color-fm-border)' : 'rgba(45, 55, 72, 0.3)',
                      borderBottomWidth: isHourMark ? '1.5px' : '0.5px',
                      minHeight: isHourMark ? '80px' : '20px'
                    }}
                  >
                    {/* Time label */}
                    <div
                      className="p-2 text-right pr-2 sm:pr-4 flex items-start justify-end w-20 sm:w-28 sticky left-0 z-10"
                      style={{ 
                        backgroundColor: 'var(--color-fm-surface-elevated)'
                      }}
                    >
                      {isHourMark && (
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--color-fm-text-secondary)' }}>
                          {formatTime(set(new Date(), { hours: slot.hour, minutes: 0 }))}
                        </span>
                      )}
                    </div>

                    {/* Day cells */}
                    {weekDays.map((day) => {
                      const isToday = isSameDay(day, now);
                      const slotDate = set(day, { hours: slot.hour, minutes: slot.minute });
                      const isPast = slotDate < now;
                      const isSelected = isSlotSelected(day, slot);
                      const blockInfo = getSlotBlockInfo(day, slot);

                      // Determine if this slot is the start of a contiguous blocked range
                      const isStartOfBlockedRange = blockInfo.isBlocked && (() => {
                        if (slotIdx === 0) return true;
                        const prevSlot = timeSlots[slotIdx - 1];
                        const prevInfo = getSlotBlockInfo(day, prevSlot);
                        return !prevInfo.isBlocked;
                      })();

                      // Compute height (in px) spanned by this blocked range starting at this slot
                      let blockedRangeHeightPx = 0;
                      if (isStartOfBlockedRange) {
                        let i = slotIdx;
                        while (i < timeSlots.length) {
                          const info = getSlotBlockInfo(day, timeSlots[i]);
                          if (!info.isBlocked) break;
                          const s = timeSlots[i];
                          const spanIsHourMark = s.minute === 0;
                          blockedRangeHeightPx += spanIsHourMark ? 80 : 20;
                          i++;
                        }
                      }
                      
                      return (
                        <div
                          key={`${day.toISOString()}-${slot.hour}-${slot.minute}`}
                          className={`relative border-l group transition-all duration-150 ${
                            isPast ? 'cursor-not-allowed' : blockInfo.isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          style={{
                            borderColor: 'var(--color-fm-border)',
                            backgroundColor: isSelected
                              ? 'var(--color-fm-aqua-500)'
                              : isToday && !isPast
                              ? 'rgba(34, 181, 173, 0.05)'
                              : isPast
                              ? 'var(--color-fm-bg)'
                              : 'transparent',
                            opacity: isPast ? 0.3 : 1
                          }}
                          onMouseDown={() => !isPast && !blockInfo.isBlocked && handleMouseDown(day, slot)}
                          onMouseEnter={() => handleMouseEnter(day, slot)}
                        >
                          {/* Hover effect for empty cells */}
                          {!isPast && !blockInfo.isBlocked && !isSelected && (
                            <div className="absolute inset-0 bg-fm-surface-elevated opacity-0 group-hover:opacity-50 transition-opacity duration-150 border border-transparent group-hover:border-fm-aqua-500/30" />
                          )}
                          
                          {/* Blocked interval indicator spanning duration */}
                          {isStartOfBlockedRange && !isPast && blockedRangeHeightPx > 0 && (
                            <div className="absolute left-0 right-0 z-10 flex items-start justify-center p-2" style={{ top: 0, height: `${blockedRangeHeightPx}px` }}>
                              <div className="border-l-4 rounded-lg px-4 py-3 shadow-lg" style={{
                                borderLeftColor: 'var(--color-fm-aqua-500)',
                                backgroundColor: 'var(--color-fm-surface-elevated)'
                              }}>
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-fm-text)' }}>
                                  {blockInfo.label.split(' Reserved')[0]}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-fm-text-secondary)' }}>
                                  Reserved
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              
              {/* Current time indicator */}
              {isCurrentTimeInRange && (
                <div 
                  className="absolute left-0 right-0 pointer-events-none z-10"
                  style={{
                    top: `${currentTimePosition}%`,
                    height: '2px',
                    backgroundColor: 'var(--color-fm-critical)',
                    boxShadow: '0 0 4px var(--color-fm-critical)'
                  }}
                >
                  <div 
                    className="absolute left-0 w-3 h-3 rounded-full -mt-1.5"
                    style={{ backgroundColor: 'var(--color-fm-critical)' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

