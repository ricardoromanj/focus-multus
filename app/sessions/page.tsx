'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/components/AppProvider';
import { Header } from '@/components/Header';
import { SessionsList } from '@/components/SessionsList';
import { SiteContainer } from '@/components/SiteContainer';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types';

export default function SessionsPage() {
  const { currentUser, users, setCurrentUserId, refreshUser } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?userId=${currentUser.id}&status=active`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('user-bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${currentUser.id}`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }

    await refreshUser();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-fm-aqua-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-fm-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-fm-bg)' }}>
      <Header
        currentUser={currentUser}
        users={users}
        onUserChange={setCurrentUserId}
      />
      
      <main className="py-10 sm:py-12">
        <SiteContainer>
        <div className="mb-8">
          <h1 className="text-display mb-2" style={{ color: 'var(--color-fm-text)' }}>
            My Sessions
          </h1>
          <p style={{ color: 'var(--color-fm-text-secondary)' }}>
            View and manage your upcoming room bookings
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-fm-aqua-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p style={{ color: 'var(--color-fm-text-secondary)' }}>Loading sessions...</p>
            </div>
          </div>
        ) : (
          <>
            <SessionsList
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onRefresh={fetchBookings}
            />

            {/* Credit Summary Card */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{ backgroundColor: 'var(--color-fm-surface)' }}
            >
              <h2 className="text-section-header mb-4" style={{ color: 'var(--color-fm-text)' }}>
                Credit Summary
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-micro uppercase tracking-wide mb-2" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    Weekly Budget
                  </div>
                  <div className="text-section-header font-bold" style={{ color: 'var(--color-fm-text)' }}>
                    10
                  </div>
                </div>
                <div>
                  <div className="text-micro uppercase tracking-wide mb-2" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    Used
                  </div>
                  <div className="text-section-header font-bold" style={{ color: 'var(--color-fm-warning)' }}>
                    {10 - currentUser.current_credits}
                  </div>
                </div>
                <div>
                  <div className="text-micro uppercase tracking-wide mb-2" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    Remaining
                  </div>
                  <div
                    className="text-section-header font-bold"
                    style={{
                      color: currentUser.current_credits >= 7
                        ? 'var(--color-fm-success)'
                        : currentUser.current_credits >= 4
                        ? 'var(--color-fm-warning)'
                        : 'var(--color-fm-critical)'
                    }}
                  >
                    {currentUser.current_credits}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </SiteContainer>
      </main>
    </div>
  );
}

