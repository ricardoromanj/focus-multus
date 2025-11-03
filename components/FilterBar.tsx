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
    <div className="flex items-center justify-between">
      {/* Week Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onDateChange(getPreviousWeek(currentDate))}
          className="p-2 rounded-lg transition-smooth hover:bg-fm-surface-elevated"
          style={{ color: 'var(--color-fm-text)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-section-header font-semibold" style={{ color: 'var(--color-fm-text)' }}>
          {formatWeekRange(currentDate)}
        </div>
        
        <button
          onClick={() => onDateChange(getNextWeek(currentDate))}
          className="p-2 rounded-lg transition-smooth hover:bg-fm-surface-elevated"
          style={{ color: 'var(--color-fm-text)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => onDateChange(new Date())}
          className="ml-2 px-3 py-1.5 text-sm rounded-lg transition-smooth"
          style={{
            backgroundColor: 'var(--color-fm-surface-elevated)',
            color: 'var(--color-fm-text-secondary)'
          }}
        >
          Today
        </button>
      </div>

      {/* Room Type Filter */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--color-fm-surface-elevated)' }}>
        {(['all', 'focus', 'conference'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onRoomTypeChange(filter)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-smooth"
            style={{
              backgroundColor: roomTypeFilter === filter ? 'var(--color-fm-aqua-500)' : 'transparent',
              color: roomTypeFilter === filter ? 'var(--color-fm-bg)' : 'var(--color-fm-text-secondary)'
            }}
          >
            {filter === 'all' ? 'All Rooms' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Rooms`}
          </button>
        ))}
      </div>
    </div>
  );
}

