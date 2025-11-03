'use client';

import { useState, useEffect, useMemo } from 'react';
import { formatTime, formatDate, getDurationInMinutes, timesOverlap } from '@/lib/datetime';
import { calculateCreditCost, hasSufficientCredits } from '@/lib/credits';
import type { Room, Booking, RoomType } from '@/types';

interface BookingDialogProps {
  userId: string;
  startTime: Date;
  endTime: Date;
  rooms: Room[];
  existingBookings: Booking[];
  onClose: () => void;
  onComplete: () => void;
}

export function BookingDialog({
  userId,
  startTime,
  endTime,
  rooms,
  existingBookings,
  onClose,
  onComplete
}: BookingDialogProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('focus');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const durationMinutes = getDurationInMinutes(startTime, endTime);
  const creditCost = calculateCreditCost(selectedRoomType, durationMinutes);

  // Fetch user credits
  useEffect(() => {
    async function fetchUserCredits() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUserCredits(user.current_credits);
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      }
    }
    fetchUserCredits();
  }, [userId]);

  // Get available rooms
  const availableRooms = useMemo(() => {
    const filteredByType = rooms.filter(r => r.room_type === selectedRoomType);
    
    return filteredByType.filter(room => {
      const hasOverlap = existingBookings.some(booking => 
        booking.room_id === room.id &&
        booking.status === 'active' &&
        timesOverlap(booking.start_time, booking.end_time, startTime, endTime)
      );
      return !hasOverlap;
    });
  }, [rooms, selectedRoomType, existingBookings, startTime, endTime]);

  // Auto-select first available room when room type changes
  useEffect(() => {
    if (availableRooms.length > 0) {
      setSelectedRoomId(availableRooms[0].id);
    } else {
      setSelectedRoomId('');
    }
  }, [availableRooms]);

  const handleSubmit = async () => {
    setError('');

    if (!selectedRoomId) {
      setError('Please select a room');
      return;
    }

    if (!hasSufficientCredits(userCredits, creditCost)) {
      setError('Insufficient credits for this booking');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: selectedRoomId,
          user_id: userId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingCredits = userCredits - creditCost;
  const canAfford = hasSufficientCredits(userCredits, creditCost);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div
          className="w-full max-w-lg rounded-2xl p-6 sm:p-7 md:p-8 shadow-xl"
          style={{ backgroundColor: 'var(--color-fm-surface)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-display mb-2" style={{ color: 'var(--color-fm-text)' }}>
              Book a Room
            </h2>
            <p style={{ color: 'var(--color-fm-text-secondary)' }}>
              {formatDate(startTime)} • {formatTime(startTime)} - {formatTime(endTime)}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-fm-text-tertiary)' }}>
              Duration: {durationMinutes} minutes
            </p>
          </div>

          {/* Room Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-fm-text)' }}>
              Room Type
            </label>
            <div className="flex gap-3">
              {(['focus', 'conference'] as RoomType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedRoomType(type)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-smooth"
                  style={{
                    backgroundColor: selectedRoomType === type 
                      ? 'var(--color-fm-aqua-500)' 
                      : 'var(--color-fm-surface-elevated)',
                    color: selectedRoomType === type 
                      ? 'var(--color-fm-bg)' 
                      : 'var(--color-fm-text-secondary)',
                    border: `2px solid ${selectedRoomType === type 
                      ? 'var(--color-fm-aqua-500)' 
                      : 'var(--color-fm-border)'}`
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <div className="text-xs mt-1 opacity-80">
                    {type === 'focus' ? '1-2 people' : '3+ people'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-fm-text)' }}>
              Select Room
            </label>
            {availableRooms.length === 0 ? (
              <div
                className="p-4 rounded-xl text-center"
                style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}
              >
                <p style={{ color: 'var(--color-fm-text-secondary)' }}>
                  No {selectedRoomType} rooms available for this time slot
                </p>
              </div>
            ) : (
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl transition-smooth"
                style={{
                  backgroundColor: 'var(--color-fm-surface-elevated)',
                  border: '2px solid var(--color-fm-border)',
                  color: 'var(--color-fm-text)'
                }}
              >
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacity: {room.capacity})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Credit Summary */}
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}
          >
            <div className="flex justify-between mb-2">
              <span style={{ color: 'var(--color-fm-text-secondary)' }}>Credit Cost</span>
              <span className="font-semibold" style={{ color: 'var(--color-fm-text)' }}>
                {creditCost} {creditCost === 1 ? 'credit' : 'credits'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ color: 'var(--color-fm-text-secondary)' }}>Your Balance</span>
              <span className="font-semibold" style={{ color: 'var(--color-fm-text)' }}>
                {userCredits} {userCredits === 1 ? 'credit' : 'credits'}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t flex justify-between" style={{ borderColor: 'var(--color-fm-border)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-fm-text)' }}>Remaining</span>
              <span
                className="font-bold"
                style={{
                  color: canAfford 
                    ? (remainingCredits >= 4 ? 'var(--color-fm-success)' : 'var(--color-fm-warning)')
                    : 'var(--color-fm-critical)'
                }}
              >
                {remainingCredits} {Math.abs(remainingCredits) === 1 ? 'credit' : 'credits'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: 'rgba(248, 113, 113, 0.1)',
                color: 'var(--color-fm-critical)'
              }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl font-semibold transition-smooth"
              style={{
                backgroundColor: 'var(--color-fm-surface-elevated)',
                color: 'var(--color-fm-text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedRoomId || !canAfford}
              className="flex-1 px-4 py-3 rounded-xl font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-fm-aqua-500)',
                color: 'var(--color-fm-bg)'
              }}
            >
              {isSubmitting ? 'Booking...' : 'Complete Booking!'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

