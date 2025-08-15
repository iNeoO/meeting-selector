import { describe, it, expect, vi } from 'vitest';
import { generateMeetingsByDays, generatePlaceHolder } from './meetingsByDayGenerator';

describe('meetingsByDayGenerator', () => {
  describe('generateMeetingsByDays', () => {
    it('should generate meetings by days correctly', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-05-01T07:00:00.000Z'));
      const startDate = new Date('2023-05-01T09:00:00.000Z');
      const nbDays = 3;
      const interval = 30;
      const startTime = { hours: 9, minutes: 0 };
      const endTime = { hours: 17, minutes: 0 };

      const result = generateMeetingsByDays(startDate, nbDays, startTime, endTime, interval);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].date.toISOString()).toBe('2023-05-01T09:00:00.000Z');
      expect(result[0].slots.length).toBe(17);
      vi.useRealTimers();
    });

    it('should generate meetings by days correctly with day started', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-10-10T11:30:00.000Z'));
      const startDate = new Date('2023-10-10T09:00:00.000Z');
      const nbDays = 3;
      const interval = 30;
      const startTime = { hours: 11, minutes: 0 };
      const endTime = { hours: 17, minutes: 0 };

      const result = generateMeetingsByDays(startDate, nbDays, startTime, endTime, interval);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].date.toISOString()).toBe('2023-10-10T09:00:00.000Z');
      expect(result[0].slots.length).toBe(12);
      vi.useRealTimers();
    });
  });

  describe('generatePlaceHolder', () => {
    it('should generate a placeholder for meetings', () => {
      vi.useFakeTimers();
      const date = new Date('2023-10-01T10:00:00.000Z');
      vi.setSystemTime(date);
      const placeholder = generatePlaceHolder(date, 1);
      expect(placeholder).toEqual([
        {
          date: new Date('2023-10-01T10:00:00.000Z'),
          slots: [],
        },
      ]);
      vi.useRealTimers();
    });
  });

  it('roundUpToInterval: keeps aligned times, rounds up when off-grid', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2023-10-10T11:30:00.000Z'));
    {
      const date = new Date('2023-10-10T00:00:00.000Z');
      const startTime = { hours: 11, minutes: 0 };
      const endTime = { hours: 12, minutes: 0 };
      const interval = 30;

      const result = generateMeetingsByDays(date, 1, startTime, endTime, interval);
      expect(result[0].slots.length).toBe(2);
      expect(result[0].slots[0].date.toISOString()).toBe('2023-10-10T11:30:00.000Z');
    }

    vi.setSystemTime(new Date('2023-10-10T11:31:00.000Z'));
    {
      const date = new Date('2023-10-10T00:00:00.000Z');
      const startTime = { hours: 11, minutes: 0 };
      const endTime = { hours: 12, minutes: 0 };
      const interval = 30;

      const result = generateMeetingsByDays(date, 1, startTime, endTime, interval);
      expect(result[0].slots.length).toBe(1);
      expect(result[0].slots[0].date.toISOString()).toBe('2023-10-10T12:00:00.000Z');
    }

    vi.useRealTimers();
  });

  it('first day: returns [] when start > dayEnd (now past end of day)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-10-10T18:00:00.000Z'));

    const date = new Date('2023-10-10T00:00:00.000Z');
    const startTime = { hours: 9, minutes: 0 };
    const endTime = { hours: 17, minutes: 0 };
    const interval = 30;

    const result = generateMeetingsByDays(date, 1, startTime, endTime, interval);
    expect(result[0].slots.length).toBe(0);

    vi.useRealTimers();
  });

  it('subsequent day: returns [] when start > end (inverted time window)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-10-10T10:00:00.000Z'));

    const date = new Date('2023-10-10T00:00:00.000Z');
    const nbDays = 2;
    const interval = 30;

    const startTime = { hours: 18, minutes: 0 };
    const endTime = { hours: 17, minutes: 0 };

    const result = generateMeetingsByDays(date, nbDays, startTime, endTime, interval);

    expect(result.length).toBe(2);
    expect(result[1].slots.length).toBe(0); // loop branch: start > end → []
    vi.useRealTimers();
  });
});
