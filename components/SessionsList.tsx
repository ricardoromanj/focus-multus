'use client';

import { useState } from 'react';
import { formatDate, formatTime, getDurationInMinutes } from '@/lib/datetime';
import { formatCredits } from '@/lib/credits';
import { format, isPast, isSameDay } from 'date-fns';
import type { Booking } from '@/types';

interface SessionsListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onRefresh: () => void;
}

export function SessionsList({ bookings, onCancelBooking, onRefresh }: SessionsListProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await onCancelBooking(bookingId);
      setShowCancelConfirm(null);
      onRefresh();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(b => !isPast(new Date(b.end_time)));
  const sortedBookings = [...upcomingBookings].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  if (sortedBookings.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{ backgroundColor: 'var(--color-fm-surface)' }}
      >
        <svg
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: 'var(--color-fm-text-tertiary)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-section-header mb-2" style={{ color: 'var(--color-fm-text)' }}>
          No Upcoming Sessions
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-fm-text-secondary)' }}>
          You don't have any room bookings yet.
        </p>
        <a
          href="/book"
          className="inline-block px-6 py-3 rounded-xl font-semibold transition-smooth"
          style={{
            backgroundColor: 'var(--color-fm-aqua-500)',
            color: 'var(--color-fm-bg)'
          }}
        >
          Book a Room
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedBookings.map((booking) => {
        const startDate = new Date(booking.start_time);
        const endDate = new Date(booking.end_time);
        const isToday = isSameDay(startDate, now);
        const isActive = startDate <= now && endDate >= now;
        const duration = getDurationInMinutes(startDate, endDate);

        return (
          <div
            key={booking.id}
            className="rounded-2xl p-6 border-l-4 transition-smooth hover:shadow-lg"
            style={{
              backgroundColor: 'var(--color-fm-surface)',
              borderLeftColor: isActive
                ? 'var(--color-fm-aqua-500)'
                : isToday
                ? 'var(--color-fm-warning)'
                : 'var(--color-fm-border)'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Date Badge */}
                {isToday && (
                  <div className="inline-block mb-3">
                    <span
                      className="text-micro uppercase tracking-wide px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--color-fm-warning)',
                        color: 'var(--color-fm-bg)'
                      }}
                    >
                      Today
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="inline-block mb-3">
                    <span
                      className="text-micro uppercase tracking-wide px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--color-fm-aqua-500)',
                        color: 'var(--color-fm-bg)'
                      }}
                    >
                      Active Now
                    </span>
                  </div>
                )}

                {/* Room Name */}
                <h3 className="text-section-header mb-1" style={{ color: 'var(--color-fm-text)' }}>
                  {booking.room?.name || 'Room'}
                </h3>

                {/* Date and Time */}
                <p className="mb-1" style={{ color: 'var(--color-fm-text-secondary)' }}>
                  {formatDate(startDate)}
                </p>
                <p style={{ color: 'var(--color-fm-text-secondary)' }}>
                  {formatTime(startDate)} - {formatTime(endDate)} ({duration} min)
                </p>

                {/* Room Details */}
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className="text-sm px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--color-fm-surface-elevated)',
                      color: 'var(--color-fm-text-tertiary)'
                    }}
                  >
                    {booking.room?.room_type === 'focus' ? 'Focus Room' : 'Conference Room'}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-fm-text-tertiary)' }}
                  >
                    Capacity: {booking.room?.capacity}
                  </span>
                </div>
              </div>

              {/* Right side: Credits and Actions */}
              <div className="text-right ml-6">
                <div className="mb-4">
                  <div className="text-micro uppercase tracking-wide mb-1" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    Credits
                  </div>
                  <div className="text-section-header font-bold" style={{
                    color: booking.credits_spent >= 4
                      ? 'var(--color-fm-critical)'
                      : booking.credits_spent >= 2
                      ? 'var(--color-fm-warning)'
                      : 'var(--color-fm-success)'
                  }}>
                    {formatCredits(booking.credits_spent)}
                  </div>
                </div>

                {/* Cancel Button */}
                {!showCancelConfirm || showCancelConfirm !== booking.id ? (
                  <button
                    onClick={() => setShowCancelConfirm(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-smooth"
                    style={{
                      color: 'var(--color-fm-critical)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--color-fm-border)'
                    }}
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs mb-2" style={{ color: 'var(--color-fm-text-secondary)' }}>
                      Are you sure?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCancelConfirm(null)}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-smooth"
                        style={{
                          backgroundColor: 'var(--color-fm-surface-elevated)',
                          color: 'var(--color-fm-text-secondary)'
                        }}
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-smooth disabled:opacity-50"
                        style={{
                          backgroundColor: 'var(--color-fm-critical)',
                          color: 'white'
                        }}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Yes, Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

