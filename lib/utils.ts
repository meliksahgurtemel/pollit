import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateRemainingTime = (endsAt: any) => {
  try {
    const endDate = new Date(endsAt._seconds * 1000);
    const now = new Date();
    const distance = endDate.getTime() - now.getTime();

    if (distance < 0) return '0h 0m';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return days > 0
      ? `${days}d ${hours}h`
      : `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    return '0h 0m';
  }
};
