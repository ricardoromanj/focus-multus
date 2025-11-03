'use client';

import { useApp } from '@/components/AppProvider';
import { Header } from '@/components/Header';
import { BookingCalendar } from '@/components/BookingCalendar';
import { SiteContainer } from '@/components/SiteContainer';

export default function BookPage() {
  const { currentUser, users, setCurrentUserId, refreshUser } = useApp();

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
              Book a Room
            </h1>
            <p style={{ color: 'var(--color-fm-text-secondary)' }}>
              Select a time slot on the calendar to book a focus or conference room
            </p>
          </div>

          <BookingCalendar
            userId={currentUser.id}
            onBookingComplete={refreshUser}
          />
        </SiteContainer>
      </main>
    </div>
  );
}

