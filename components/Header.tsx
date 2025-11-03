'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSelector } from './UserSelector';
import { CreditBalance } from './CreditBalance';
import type { User } from '@/types';

interface HeaderProps {
  currentUser: User | null;
  users: User[];
  onUserChange: (userId: string) => void;
}

export function Header({ currentUser, users, onUserChange }: HeaderProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="sticky top-0 z-50 border-b" style={{ 
      backgroundColor: 'var(--color-fm-surface)',
      borderColor: 'var(--color-fm-border)'
    }}>
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/book" className="flex items-center hover:opacity-80 transition-smooth">
              <svg 
                width="160" 
                height="45" 
                viewBox="0 0 640 180" 
                xmlns="http://www.w3.org/2000/svg" 
                role="img" 
                aria-label="Focus Multus logo"
              >
                <g transform="translate(0,0) scale(0.6)">
                  <rect x="28" y="36" width="200" height="192" rx="24" fill="none" stroke="#2EE6D6" strokeWidth="10"/>
                  <rect x="28" y="36" width="200" height="40" rx="20" fill="#2EE6D6"/>
                  <circle cx="202" cy="60" r="10" fill="#0B0F14"/>
                  <path d="M64 108h120a16 16 0 0 1 16 16v64a16 16 0 0 1-16 16H120c-6 0-11 5-11 11v7H64a16 16 0 0 1-16-16v-86a16 16 0 0 1 16-16z" fill="#2EE6D6" opacity="0.9"/>
                  <path d="M90 166l20 20 44-46" fill="none" stroke="#0B0F14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"/>
                </g>
                <g transform="translate(150,120)">
                  <text x="0" y="0" fontFamily="Inter" fontSize="56" fontWeight="700" fill="#E5E7EB" letterSpacing="0.5">Focus</text>
                  <text x="225" y="0" fontFamily="Inter" fontSize="56" fontWeight="600" fill="#9CA3AF">Multus</text>
                </g>
              </svg>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 md:gap-8">
            <Link
              href="/book"
              className={`text-sm md:text-body font-medium transition-smooth ${
                isActive('/book')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              Book
            </Link>
            <Link
              href="/sessions"
              className={`text-sm md:text-body font-medium transition-smooth ${
                isActive('/sessions')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              Sessions
            </Link>
            <Link
              href="/admin"
              className={`text-sm md:text-body font-medium transition-smooth ${
                isActive('/admin')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* User selector and credits */}
          <div className="flex items-center gap-3 md:gap-6">
            {currentUser && <CreditBalance credits={currentUser.current_credits} />}
            <UserSelector 
              users={users}
              currentUserId={currentUser?.id || ''}
              onUserChange={onUserChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

