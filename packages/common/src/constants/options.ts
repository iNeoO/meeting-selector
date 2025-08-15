import type { CalendarOptions } from '../types/meetingSelector.type';

const days: string[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const months: string[] = [
  'jan.',
  'feb.',
  'mar.',
  'apr.',
  'may.',
  'jun.',
  'jul.',
  'aug.',
  'sep.',
  'oct.',
  'nov.',
  'dec.',
];

const decomposeDate = (date: Date): number => {
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return parseInt(`${date.getFullYear()}${month}${day}`, 10);
};

const disabledDate = (date: Date | string): boolean => {
  const actualDate = new Date(date);
  const today = new Date();
  return decomposeDate(actualDate) <= decomposeDate(today);
};

export const defaultCalendarOptions: Required<CalendarOptions> = {
  daysLabel: days,
  monthsLabel: months,
  limit: 4,
  spacing: 4,
  disabledDate,
};
