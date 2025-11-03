import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SiteContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * SiteContainer - A reusable container component that centers content
 * with responsive gutters and max-width constraints.
 * 
 * Provides consistent spacing across all breakpoints:
 * - Mobile: 1.5rem (24px) padding
 * - Tablet (sm): 2rem (32px) padding  
 * - Desktop (md+): 2.5rem (40px) padding
 * - Max width: 1440px
 */
export function SiteContainer({ children, className }: SiteContainerProps) {
  return (
    <div className={cn('container mx-auto max-w-7xl', className)}>
      {children}
    </div>
  );
}

