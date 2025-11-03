import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays,
  addWeeks,
  subWeeks,
  isAfter,
  isBefore,
  areIntervalsOverlapping
} from 'date-fns';
import type { TimeSlot } from '@/types';

export function getWeekDays(date: Date) {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 })
  });
}

export function generateTimeSlots(startHour = 8, endHour = 20): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      if (hour === endHour && minute > 0) continue;
      slots.push({ hour, minute });
    }
  }
  return slots;
}

export function snapToNearestQuarter(date: Date): Date {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / 15) * 15;
  const result = new Date(date);
  result.setMinutes(snappedMinutes, 0, 0);
  return result;
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatDateShort(date: Date): string {
  return format(date, 'MMM d');
}

export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1);
}

export function timesOverlap(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = typeof start1 === 'string' ? new Date(start1) : start1;
  const e1 = typeof end1 === 'string' ? new Date(end1) : end1;
  const s2 = typeof start2 === 'string' ? new Date(start2) : start2;
  const e2 = typeof end2 === 'string' ? new Date(end2) : end2;
  
  return areIntervalsOverlapping(
    { start: s1, end: e1 },
    { start: s2, end: e2 },
    { inclusive: false }
  );
}

export function addMinutesToDate(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function getDurationInMinutes(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return Math.round((e.getTime() - s.getTime()) / 60000);
}

