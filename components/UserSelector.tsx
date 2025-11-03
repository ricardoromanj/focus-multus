'use client';

import { useState, useRef, useEffect } from 'react';
import type { User } from '@/types';

interface UserSelectorProps {
  users: User[];
  currentUserId: string;
  onUserChange: (userId: string) => void;
}

export function UserSelector({ users, currentUserId, onUserChange }: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentUser = users.find(u => u.id === currentUserId);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-smooth text-body"
        style={{
          backgroundColor: 'var(--color-fm-surface-elevated)',
          border: '1px solid var(--color-fm-border)',
          color: 'var(--color-fm-text)'
        }}
      >
        <span className="font-medium">{currentUser?.name || 'Select User'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--color-fm-surface-elevated)',
            border: '1px solid var(--color-fm-border)'
          }}
        >
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => {
                onUserChange(user.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left transition-smooth hover:bg-fm-surface"
              style={{
                backgroundColor: user.id === currentUserId ? 'var(--color-fm-surface)' : 'transparent'
              }}
            >
              <div className="font-medium" style={{ color: 'var(--color-fm-text)' }}>
                {user.name}
              </div>
              <div className="text-sm" style={{ color: 'var(--color-fm-text-tertiary)' }}>
                {user.email}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

