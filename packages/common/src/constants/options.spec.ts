import { describe, it, expect } from 'vitest';
import { defaultCalendarOptions } from './options';

describe('options', () => {
  describe('defaultCalendarOptions', () => {
    it('should have correct daysLabel', () => {
      expect(defaultCalendarOptions.daysLabel).toEqual([
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ]);
    });

    it('should have correct monthsLabel', () => {
      expect(defaultCalendarOptions.monthsLabel).toEqual([
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
      ]);
    });

    it('should have correct limit', () => {
      expect(defaultCalendarOptions.limit).toBe(4);
    });

    it('should have correct spacing', () => {
      expect(defaultCalendarOptions.spacing).toBe(4);
    });

    it('should disable past dates', () => {
      const pastDate = new Date('2023-01-01');
      expect(defaultCalendarOptions.disabledDate(pastDate)).toBe(true);
    });

    it('should not disable future dates', () => {
      const futureDate = new Date('2030-10-10');
      expect(defaultCalendarOptions.disabledDate(futureDate)).toBe(false);
    });
  });
});
