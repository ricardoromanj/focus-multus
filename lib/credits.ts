import type { RoomType } from '@/types';

/**
 * Calculate credit cost based on room type and duration
 * Focus rooms: 1 credit per 30 minutes
 * Conference rooms: 2 credits per 30 minutes
 */
export function calculateCreditCost(
  roomType: RoomType,
  durationMinutes: number
): number {
  const thirtyMinBlocks = Math.ceil(durationMinutes / 30);
  const costPer30Min = roomType === 'focus' ? 1 : 2;
  return thirtyMinBlocks * costPer30Min;
}

/**
 * Check if user has sufficient credits for a booking
 */
export function hasSufficientCredits(
  userCredits: number,
  requiredCredits: number
): boolean {
  return userCredits >= requiredCredits;
}

/**
 * Format credits for display (handles decimal values)
 */
export function formatCredits(credits: number): string {
  return credits % 1 === 0 ? credits.toString() : credits.toFixed(1);
}

