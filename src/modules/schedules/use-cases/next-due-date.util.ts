import type { RecurrenceUnit } from '../contracts/recurrence-unit.types';

export function addRecurrence(date: Date, interval: number, unit: RecurrenceUnit): Date {
  const next = new Date(date);

  switch (unit) {
    case 'DAY':
      next.setDate(next.getDate() + interval);
      return next;
    case 'WEEK':
      next.setDate(next.getDate() + interval * 7);
      return next;
    case 'MONTH':
      next.setMonth(next.getMonth() + interval);
      return next;
    case 'YEAR':
      next.setFullYear(next.getFullYear() + interval);
      return next;
    default:
      return next;
  }
}
