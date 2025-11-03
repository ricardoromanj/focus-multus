'use client';

import { formatWeekRange, getNextWeek, getPreviousWeek } from '@/lib/datetime';
import type { RoomType } from '@/types';

interface FilterBarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  roomTypeFilter: RoomType | 'all';
  onRoomTypeChange: (filter: RoomType | 'all') => void;
}

export function FilterBar({
  currentDate,
  onDateChange,
  roomTypeFilter,
  onRoomTypeChange
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 mb-8">
      {/* Week Navigation */}
      <div className="flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border" style={{
        backgroundColor: 'var(--color-fm-surface)',
        borderColor: 'var(--color-fm-border)'
      }}>
        <button
          onClick={() => onDateChange(getPreviousWeek(currentDate))}
          className="p-2 sm:p-3 rounded-lg transition-colors hover:bg-fm-surface-elevated flex-shrink-0"
          style={{ color: 'var(--color-fm-text)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-fm-aqua-400)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-fm-text)'}
          aria-label="Previous week"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <span className="text-base sm:text-xl font-semibold whitespace-nowrap" style={{ color: 'var(--color-fm-text)' }}>
            {formatWeekRange(currentDate)}
          </span>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap"
            style={{ color: 'var(--color-fm-aqua-500)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-fm-surface-elevated)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Today
          </button>
        </div>
        
        <button
          onClick={() => onDateChange(getNextWeek(currentDate))}
          className="p-2 sm:p-3 rounded-lg transition-colors hover:bg-fm-surface-elevated flex-shrink-0"
          style={{ color: 'var(--color-fm-text)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-fm-aqua-400)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-fm-text)'}
          aria-label="Next week"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Room Type Filter */}
      <div className="flex items-center gap-2 sm:gap-3 rounded-xl p-1.5 sm:p-2 border" style={{ 
        backgroundColor: 'var(--color-fm-surface)',
        borderColor: 'var(--color-fm-border)'
      }}>
        {(['all', 'focus', 'conference'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onRoomTypeChange(filter)}
            className="flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: roomTypeFilter === filter ? 'var(--color-fm-aqua-500)' : 'transparent',
              color: roomTypeFilter === filter ? 'white' : 'var(--color-fm-text-secondary)',
              boxShadow: roomTypeFilter === filter ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

