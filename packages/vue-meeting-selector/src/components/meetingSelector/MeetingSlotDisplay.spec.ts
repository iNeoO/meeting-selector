import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import MeetingSlotDisplay from './MeetingSlotDisplay.vue';

beforeAll(() => {
  process.env.TZ = 'UTC';
});

describe('MeetingSlotDisplay', () => {
  it('renders HH:mm based on meetingSlot[dateFieldKey]', () => {
    const meeting = { date: '2025-08-10T12:00:00Z' };
    render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: null,
      },
    });
    expect(screen.getByRole('button', { name: '12:00' })).toBeInTheDocument();
  });

  it('calls handleMeetingSlotClick when clicked', async () => {
    const meeting = { date: '2025-08-10T08:05:00Z' };

    const { emitted } = render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: null,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: '08:05' }));

    const ev = emitted()['meeting-slot-click'];
    expect(ev).toBeTruthy();
    expect(ev!.length).toBe(1);
    expect(ev![0]).toEqual([meeting]);
  });

  it('adds selected class when meetingSlotSelected matches (single object)', () => {
    const meeting = { date: '2025-08-10T09:30:00Z' };

    const { container } = render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: { date: '2025-08-10T09:30:00Z' },
      },
    });

    const btn = screen.getByRole('button', { name: '09:30' });
    expect(btn).toBeInTheDocument();
    expect(container.querySelector('.meeting-selector__btn--selected')).toBeTruthy();
  });

  it('adds selected class when meetingSlotSelected array contains the slot', () => {
    const meeting = { date: '2025-08-10T10:00:00Z' };

    const { container } = render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: [{ date: '2025-08-10T09:00:00Z' }, { date: '2025-08-10T10:00:00Z' }],
      },
    });

    expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument();
    expect(container.querySelector('.meeting-selector__btn--selected')).toBeTruthy();
  });

  it('adds loading class and disables the button when loading=true', () => {
    const meeting = { date: '2025-08-10T07:00:00Z' };

    const { container } = render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: true,
        meetingSlotSelected: null,
      },
    });

    const btn = screen.getByRole('button', { name: '07:00' });
    expect(btn).toBeDisabled();
    expect(container.querySelector('.meeting-selector__btn-loading')).toBeTruthy();
  });

  it('renders the empty state when meetingSlot.date is falsy', () => {
    const meeting = { date: '' };

    render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meeting,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: null,
      },
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('does NOT add selected class when a different meeting is selected (single object)', () => {
    const meetingRendered = { date: '2025-08-10T11:00:00Z' };
    const selectedDifferent = [{ date: '2025-08-10T11:30:00Z' }];

    const { container } = render(MeetingSlotDisplay, {
      props: {
        meetingSlot: meetingRendered,
        dateFieldKey: 'date',
        loading: false,
        meetingSlotSelected: selectedDifferent,
      },
    });

    const btn = screen.getByRole('button', { name: '11:00' });
    expect(btn).toBeInTheDocument();
    expect(container.querySelector('.meeting-selector__btn--selected')).toBeFalsy();
  });
});
