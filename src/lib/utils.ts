
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | undefined): string {
  if (typeof value === 'undefined') return '$0';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '$0';
  
  return numericValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

// Add formatDate function to fix the import error in RewardProgress.tsx
export function formatDate(date: string | Date | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
