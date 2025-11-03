'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSelector } from './UserSelector';
import { CreditBalance } from './CreditBalance';
import { ThemeToggle } from './ThemeToggle';
import { SiteContainer } from './SiteContainer';
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
      <SiteContainer className="py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/book" className="flex items-center hover:opacity-80 transition-smooth">
              <svg
                width="40"
                height="45"
                viewBox="0 0 312 351"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path 
                  d="M140.885 4.01924C150.167 -1.33975 161.603 -1.33975 170.885 4.01924L296.77 76.6989C306.051 82.058 311.77 91.9616 311.77 102.679V248.038C311.77 258.756 306.052 268.66 296.77 274.019L170.885 346.699C161.603 352.058 150.167 352.058 140.885 346.699L15 274.019C5.718 268.66 0 258.756 0 248.038V102.679C0 91.9616 5.71816 82.058 15 76.6989L140.885 4.01924ZM78.8848 86.3591C66.1822 86.3591 55.8848 96.6565 55.8848 109.359V241.359C55.8849 254.061 66.1823 264.359 78.8848 264.359H232.885L233.479 264.351C245.709 264.041 255.567 254.184 255.877 241.953L255.885 241.359V109.359C255.885 96.8551 245.907 86.6818 233.479 86.3669L232.885 86.3591H78.8848ZM244.885 145.359V241.359C244.885 247.986 239.512 253.359 232.885 253.359H78.8848C72.2575 253.359 66.8849 247.986 66.8848 241.359V145.359H244.885ZM100.885 203.359C96.4665 203.359 92.8848 206.941 92.8848 211.359V228.359C92.8849 232.777 96.4666 236.359 100.885 236.359H118.885C123.303 236.359 126.885 232.777 126.885 228.359V211.359C126.885 206.941 123.303 203.359 118.885 203.359H100.885ZM146.885 203.359C142.466 203.359 138.885 206.941 138.885 211.359V228.359C138.885 232.777 142.467 236.359 146.885 236.359H163.885C168.303 236.359 171.885 232.777 171.885 228.359V211.359C171.885 206.941 168.303 203.359 163.885 203.359H146.885ZM100.885 158.359C96.4665 158.359 92.8848 161.941 92.8848 166.359V183.359C92.8849 187.777 96.4666 191.359 100.885 191.359H118.885C123.303 191.359 126.885 187.777 126.885 183.359V166.359C126.885 161.941 123.303 158.359 118.885 158.359H100.885ZM146.885 158.359C142.466 158.359 138.885 161.941 138.885 166.359V183.359C138.885 187.777 142.467 191.359 146.885 191.359H163.885C168.303 191.359 171.885 187.777 171.885 183.359V166.359C171.885 161.941 168.303 158.359 163.885 158.359H146.885ZM190.885 158.359C186.466 158.359 182.885 161.941 182.885 166.359V183.359C182.885 187.777 186.467 191.359 190.885 191.359H208.885C213.303 191.359 216.885 187.777 216.885 183.359V166.359C216.885 161.941 213.303 158.359 208.885 158.359H190.885ZM232.885 97.3591C239.512 97.3591 244.885 102.732 244.885 109.359V133.359H66.8848V109.359C66.8848 102.732 72.2574 97.3591 78.8848 97.3591H232.885Z" 
                  fill="#2EE6D6"
                />
              </svg>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/book"
              className={`px-6 py-3 text-base font-medium rounded-lg transition-smooth ${
                isActive('/book')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              Book a Room
            </Link>
            <Link
              href="/sessions"
              className={`px-6 py-3 text-base font-medium rounded-lg transition-smooth ${
                isActive('/sessions')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              My Sessions
            </Link>
            <Link
              href="/admin"
              className={`px-6 py-3 text-base font-medium rounded-lg transition-smooth ${
                isActive('/admin')
                  ? 'text-fm-aqua-500'
                  : 'text-fm-text-secondary hover:text-fm-text'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Right: Credits + Theme + User */}
          <div className="flex items-center gap-6">
            {currentUser && <CreditBalance credits={currentUser.current_credits} />}
            <ThemeToggle />
            <UserSelector 
              users={users}
              currentUserId={currentUser?.id || ''}
              onUserChange={onUserChange}
            />
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}

