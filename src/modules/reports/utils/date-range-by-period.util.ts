import type { DateRange } from '../contracts/date-range.interface';
import type { ReportPeriod } from '../contracts/report-period.types';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  return startOfDay(d);
}

function endOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return endOfDay(d);
}

function startOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(0, 1);
  return startOfDay(d);
}

function endOfYear(date: Date): Date {
  const d = new Date(date);
  d.setMonth(11, 31);
  return endOfDay(d);
}

export function getDateRangeForPeriod(period: ReportPeriod, referenceDate: Date): DateRange {
  const ref = new Date(referenceDate);

  switch (period) {
    case 'WEEKLY': {
      const start = new Date(ref);
      start.setDate(start.getDate() - 6);
      return { start: startOfDay(start), end: endOfDay(ref) };
    }

    case 'BIWEEKLY': {
      const start = new Date(ref);
      start.setDate(start.getDate() - 13);
      return { start: startOfDay(start), end: endOfDay(ref) };
    }

    case 'MONTHLY':
      return {
        start: startOfMonth(ref),
        end: endOfMonth(ref),
      };
    case 'YEARLY':
      return {
        start: startOfYear(ref),
        end: endOfYear(ref),
      };

    default: {
      const start = new Date(ref);
      start.setDate(start.getDate() - 6);
      return { start: startOfDay(start), end: endOfDay(ref) };
    }
  }
}
