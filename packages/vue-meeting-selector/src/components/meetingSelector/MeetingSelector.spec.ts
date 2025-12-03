// MeetingSelector.spec.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { h } from 'vue';
import MeetingSelector from './MeetingSelector.vue';
import type { MeetingsByDay, MeetingSlot } from 'common-meeting-selector';

beforeAll(() => {
  process.env.TZ = 'UTC';
});

type Slot = MeetingSlot<'date'>;
type Day = MeetingsByDay<'date', 'slots', Slot>;
type AnyDay = MeetingsByDay<string, string, MeetingSlot<string>>;

const makeDay = (date: string, slots: string[]): Day => ({
  date,
  slots: slots.map((d) => ({ date: d })),
});
const makeDays = (days: Array<{ date: string; slots: string[] }>) =>
  days.map((d) => makeDay(d.date, d.slots));

const hhmmLocal = (iso: string) => {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

describe('MeetingSelector', () => {
  it('paginates slots use down', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
        skip: 0,
        loading: false,
      },
    });

    const buttons = screen.getAllByRole('button');
    await fireEvent.click(buttons[buttons.length - 1]); // last button = "down"
    expect(emitted()['update:skip']?.[0]).toEqual([2]);
  });

  it('paginates slots use up', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
        skip: 2,
        loading: false,
      },
    });

    const buttons = screen.getAllByRole('button');
    await fireEvent.click(buttons[buttons.length - 2]); // second last = "up"
    expect(emitted()['update:skip']?.[0]).toEqual([0]);
  });

  it('display loading when loading', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { container } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
        loading: true,
        skip: 0,
      },
    });

    const buttons = screen.getAllByRole('button');
    await fireEvent.click(buttons[buttons.length - 1]); // "down"
    // any of the icon buttons should have the loading class
    const hasLoading = Array.from(container.querySelectorAll('button')).some((b) =>
      b.classList.contains('meeting-selector__btn-icon--loading'),
    );
    expect(hasLoading).toBe(true);
  });

  it('calls handlePreviousDate/handleNextDate', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
        skip: 0,
      },
    });

    const buttons = screen.getAllByRole('button');
    await fireEvent.click(buttons[0]); // previous-date
    expect(emitted()['previous-date']).toBeTruthy();

    // next-date lives in the last pagination block as the first icon button there.
    // Depending on DOM order, you might need a more specific query.
    await fireEvent.click(buttons[buttons.length - 3]);
    expect(emitted()['next-date']).toBeTruthy();
  });

  it('calls handleValueChange when a meeting slot is clicked', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
        skip: 0,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: '09:00' }));
    // Vue component emits update:modelValue with the selected meeting
    expect(emitted()['update:modelValue']?.[0]).toEqual([{ date: '2025-08-10T09:00:00Z' }]);
  });

  it('calls handleValueChange when a meeting slot is clicked with slot already selected', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: { date: '2025-08-10T09:00:00Z' },
        skip: 0,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: '09:00' }));
    expect(emitted()['update:modelValue']?.[0]).toEqual([null]);
  });

  it('calls handleValueChange when a meeting slot is clicked in multi', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    const { emitted } = render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        multi: true,
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: [{ date: '2025-08-10T08:00:00Z' }],
        skip: 0,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: '09:00' }));
    expect(emitted()['update:modelValue']?.[0]).toEqual([
      [{ date: '2025-08-10T08:00:00Z' }, { date: '2025-08-10T09:00:00Z' }],
    ]);

    await fireEvent.click(screen.getByRole('button', { name: '08:00' }));
    expect(emitted()['update:modelValue']?.[1]).toEqual([[]]);
  });

  it('changes internal skip', async () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          disabledDate: () => false,
        },
        modelValue: null,
      },
    });

    const buttons = screen.getAllByRole('button');
    await fireEvent.click(buttons[buttons.length - 1]);
    const expected = hhmmLocal('2025-08-10T10:00:00Z');
    expect(screen.getByRole('button', { name: expected })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '08:00' })).toBeNull();
  });

  it('handle empty meetingsByDays', () => {
    render(MeetingSelector, {
      props: {
        meetingsByDays: [],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
      },
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4); // prev + next + up + down
  });

  it('renders component with renderFunctions (via named slots in Vue)', () => {
    const days = makeDays([
      {
        date: '2025-08-10',
        slots: [
          '2025-08-10T08:00:00Z',
          '2025-08-10T09:00:00Z',
          '2025-08-10T10:00:00Z',
          '2025-08-10T11:00:00Z',
        ],
      },
    ]);

    render(MeetingSelector, {
      props: {
        meetingsByDays: days as unknown as AnyDay[],
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        date: new Date('2025-08-10'),
        calendarOptions: {
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        },
        modelValue: null,
      },
      slots: {
        'button-down-meetings': () => h('button', { type: 'button' }, 'Down'),
        'button-next-date': () => h('button', { type: 'button' }, 'Next'),
        'button-previous-date': () => h('button', { type: 'button' }, 'Previous'),
        'button-up-meetings': () => h('button', { type: 'button' }, 'Up'),
        header: ({ meetings }: { meetings: Day }) =>
          h('div', null, `Meetings for ${meetings.date}`),
        meeting: ({ meeting }: { meeting: Slot }) =>
          h('div', { key: String(meeting.date) }, new Date(meeting.date).toLocaleTimeString()),
      },
    });

    expect(screen.getByText('Down')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
  });

  it('single select: clicking a different slot replaces the current value', async () => {
  const days = makeDays([
    {
      date: '2025-08-10',
      slots: [
        '2025-08-10T08:00:00Z', // current selection
        '2025-08-10T09:00:00Z', // click this
        '2025-08-10T10:00:00Z',
      ],
    },
  ]);

  const { emitted } = render(MeetingSelector, {
    props: {
      meetingsByDays: days as unknown as AnyDay[],
      dateFieldKey: 'date',
      meetingSlotsKey: 'slots',
      date: new Date('2025-08-10'),
      calendarOptions: {
        limit: 3,
        spacing: 3,
        daysLabel: [],
        monthsLabel: [],
        disabledDate: () => false,
      },
      modelValue: { date: '2025-08-10T08:00:00Z' },
      skip: 0,
    },
  });

  await fireEvent.click(screen.getByRole('button', { name: '09:00' }));

  expect(emitted()['update:modelValue']?.[0]).toEqual([{ date: '2025-08-10T09:00:00Z' }]);
  expect(emitted().change?.[0]).toEqual([{ date: '2025-08-10T09:00:00Z' }]);
});

});
