import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import MeetingsDisplay from './MeetingsDisplay.vue';
import type { MeetingsByDay, MeetingSlot } from 'common-meeting-selector';

beforeAll(() => {
  process.env.TZ = 'UTC';
});

type Slot = MeetingSlot<'date'>;
type Day = MeetingsByDay<'date', 'slots', Slot>;
type AnyDay = MeetingsByDay<string, string, MeetingSlot<string>>;

const makeDay = (slots: string[]): Day => ({
  date: '2025-08-10',
  slots: slots.map((d) => ({ date: d })),
});

describe('MeetingDisplay', () => {
  it('renders one MeetingSlotDisplay per slot with HH:mm labels', () => {
    const day = makeDay(['2025-08-10T12:00:00Z', '2025-08-10T13:30:00Z']);

    render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: null,
      },
    });

    expect(screen.getByRole('button', { name: '12:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '13:30' })).toBeInTheDocument();
  });

  it('calls handleMeetingSlotClick with the clicked slot', async () => {
    const day = makeDay(['2025-08-10T08:05:00Z', '2025-08-10T09:00:00Z']);

    const { emitted } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: null,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: '08:05' }));

    const ev = emitted()['meeting-slot-click'];
    expect(ev).toBeTruthy();
    expect(ev!.length).toBe(1);
    expect(ev![0]).toEqual([{ date: '2025-08-10T08:05:00Z' }]);
  });

  it('passes loading to children (buttons disabled + loading class present)', () => {
    const day = makeDay(['2025-08-10T07:00:00Z']);

    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: true,
        meetingSlotSelected: null,
      },
    });

    const btn = screen.getByRole('button', { name: '07:00' });
    expect(btn).toBeDisabled();
    expect(container.querySelector('.meeting-selector__btn-loading')).toBeTruthy();
  });

  it('marks the matching slot as selected when meetingSlotSelected matches (single object)', () => {
    const day = makeDay(['2025-08-10T09:30:00Z', '2025-08-10T10:00:00Z']);

    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: { date: '2025-08-10T10:00:00Z' },
      },
    });

    expect(screen.getByRole('button', { name: '09:30' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument();
    const selected = container.querySelectorAll('.meeting-selector__btn--selected');
    expect(selected.length).toBe(1);
  });

  it('marks the matching slot as selected when meetingSlotSelected is an array', () => {
    const day = makeDay(['2025-08-10T09:00:00Z', '2025-08-10T10:00:00Z', '2025-08-10T11:00:00Z']);

    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: [
          { date: '2025-08-10T10:00:00Z' },
          { date: '2025-08-10T12:00:00Z' }, // not displayed
        ],
      },
    });

    const selected = container.querySelectorAll('.meeting-selector__btn--selected');
    expect(selected.length).toBe(1);
  });

  // NEW: selected meeting exists, but it's NOT in the rendered list -> no button should be selected
  it('does NOT select anything when meetingSlotSelected is not present in the rendered slots (single object)', () => {
    const day = makeDay(['2025-08-10T11:00:00Z', '2025-08-10T11:30:00Z']);

    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: { date: '2025-08-10T12:00:00Z' }, // not rendered
      },
    });

    expect(screen.getByRole('button', { name: '11:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '11:30' })).toBeInTheDocument();
    expect(container.querySelector('.meeting-selector__btn--selected')).toBeFalsy();
  });

  it('does NOT select anything when meetingSlotSelected array does not include any rendered slot', () => {
    const day = makeDay(['2025-08-10T13:00:00Z', '2025-08-10T14:00:00Z']);

    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: [{ date: '2025-08-10T12:00:00Z' }, { date: '2025-08-10T15:00:00Z' }],
      },
    });

    expect(container.querySelector('.meeting-selector__btn--selected')).toBeFalsy();
  });

  it('applies additional className on container', () => {
    const day = makeDay(['2025-08-10T12:00:00Z']);

    // Apply an extra class to the component root
    const { container } = render(MeetingsDisplay, {
      props: {
        meetingsByDay: day as unknown as AnyDay,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        loading: false,
        meetingSlotSelected: null,
      },
      attrs: {
        class: 'extra-class',
      },
    });

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('meeting-selector__meetings');
    expect(root.className).toContain('extra-class');
  });
});
