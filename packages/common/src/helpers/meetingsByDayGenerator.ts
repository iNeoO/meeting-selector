import type { Time } from '../types/meetingsByDayGenerator.type';
import type {
  MeetingSlotGenerated,
  MeetingsByDayGenerated,
} from '../types/meetingsByDayGenerator.type';

const setTimeUTC = (date: Date, time: Time) => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      time.hours,
      time.minutes,
      0,
      0
    )
  );
};

const isSameUTCDate = (a: Date, b: Date) =>
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate();

const roundUpToInterval = (dt: Date, intervalMinutes: number) => {
  const ms = dt.getTime();
  const step = intervalMinutes * 60_000;
  const rounded = ms % step === 0 ? ms : Math.ceil(ms / step) * step;
  return new Date(rounded);
};

const generateMeetingSlots = (start: Date, end: Date, interval: number) => {
  let startStamp: number = start.getTime();
  const endStamp: number = end.getTime();
  const slots: MeetingSlotGenerated[] = [];
  for (; startStamp <= endStamp; startStamp += interval * 60000) {
    const slot: MeetingSlotGenerated = {
      date: new Date(startStamp),
    };
    slots.push(slot);
  }
  return slots;
};

const generateFirstDate = (date: Date, interval: number, startTime: Time, endTime: Time) => {
  const now = new Date();
  const dayStart = setTimeUTC(date, startTime);
  const dayEnd = setTimeUTC(date, endTime);

  let start = dayStart;
  if (isSameUTCDate(date, now) && dayStart.getTime() < now.getTime()) {
    start = roundUpToInterval(now, interval);
  }

  const slots =
    start.getTime() > dayEnd.getTime() ? [] : generateMeetingSlots(start, dayEnd, interval);

  return { date, slots };
};

export const generateMeetingsByDays = (
  date: Date,
  nbDays: number,
  startTime: Time,
  endTime: Time,
  interval: number
): MeetingsByDayGenerated[] => {
  const days: MeetingsByDayGenerated[] = [];
  days.push(generateFirstDate(date, interval, startTime, endTime));

  let cursor = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  for (let i = 1; i < nbDays; i++) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    const start = setTimeUTC(cursor, startTime);
    const end = setTimeUTC(cursor, endTime);
    const slots = start.getTime() > end.getTime() ? [] : generateMeetingSlots(start, end, interval);

    days.push({ date: new Date(cursor), slots });
  }

  return days;
};

export const generatePlaceHolder = (date: Date, nbDays: number): MeetingsByDayGenerated[] => {
  const out: MeetingsByDayGenerated[] = [];
  let cursor = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
  for (let i = 0; i < nbDays; i++) {
    out.push({ date: new Date(cursor), slots: [] });
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return out;
};
