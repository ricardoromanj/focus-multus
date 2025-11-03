'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppProvider';
import { Header } from '@/components/Header';
import { SiteContainer } from '@/components/SiteContainer';

export default function AdminPage() {
  const { currentUser, users, setCurrentUserId, refreshUser } = useApp();
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetCredits = async () => {
    if (!confirm('Are you sure you want to reset credits for all users to 10?')) {
      return;
    }

    setIsResetting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/reset-credits', {
        method: 'POST'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Credits reset successfully for all users!' });
        await refreshUser();
        // Refresh all users
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
          const updatedUsers = await usersResponse.json();
          console.log('Updated users:', updatedUsers);
        }
      } else {
        throw new Error('Failed to reset credits');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset credits. Please try again.' });
      console.error('Error resetting credits:', error);
    } finally {
      setIsResetting(false);
    }
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
            Admin Utilities
          </h1>
          <p style={{ color: 'var(--color-fm-text-secondary)' }}>
            Manage system-wide settings and perform maintenance tasks
          </p>
        </div>

        {/* Reset Credits Card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: 'var(--color-fm-surface)' }}
        >
          <h2 className="text-section-header mb-2" style={{ color: 'var(--color-fm-text)' }}>
            Reset Weekly Credits
          </h2>
          <p className="mb-4" style={{ color: 'var(--color-fm-text-secondary)' }}>
            Reset all users to 10 credits. This simulates the weekly Monday reset at 12:00 AM MT.
          </p>
          
          <button
            onClick={handleResetCredits}
            disabled={isResetting}
            className="px-6 py-3 rounded-xl font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-fm-warning)',
              color: 'var(--color-fm-bg)'
            }}
          >
            {isResetting ? 'Resetting...' : 'Reset All Credits'}
          </button>

          {message && (
            <div
              className="mt-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: message.type === 'success' 
                  ? 'rgba(52, 211, 153, 0.1)' 
                  : 'rgba(248, 113, 113, 0.1)',
                color: message.type === 'success'
                  ? 'var(--color-fm-success)'
                  : 'var(--color-fm-critical)'
              }}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* User Overview Card */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--color-fm-surface)' }}
        >
          <h2 className="text-section-header mb-4" style={{ color: 'var(--color-fm-text)' }}>
            User Overview
          </h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}
              >
                <div>
                  <div className="font-semibold" style={{ color: 'var(--color-fm-text)' }}>
                    {user.name}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    {user.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-micro uppercase tracking-wide" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                    Credits
                  </div>
                  <div
                    className="text-section-header font-bold"
                    style={{
                      color: user.current_credits >= 7
                        ? 'var(--color-fm-success)'
                        : user.current_credits >= 4
                        ? 'var(--color-fm-warning)'
                        : 'var(--color-fm-critical)'
                    }}
                  >
                    {user.current_credits}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4">
          <a
            href="/book"
            className="flex-1 px-4 py-3 rounded-xl font-medium text-center transition-smooth"
            style={{
              backgroundColor: 'var(--color-fm-surface)',
              color: 'var(--color-fm-text-secondary)'
            }}
          >
            Book a Room
          </a>
          <a
            href="/sessions"
            className="flex-1 px-4 py-3 rounded-xl font-medium text-center transition-smooth"
            style={{
              backgroundColor: 'var(--color-fm-surface)',
              color: 'var(--color-fm-text-secondary)'
            }}
          >
            My Sessions
          </a>
        </div>
        </SiteContainer>
      </main>
    </div>
  );
}

