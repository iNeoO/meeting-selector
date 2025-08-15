import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingDisplay } from './MeetingDisplay';

// Keep time formatting stable (component tree renders HH:mm via MeetingSlotDisplay)
beforeAll(() => {
  process.env.TZ = 'UTC';
});

type Slot = { date: string };
type Day = { date: string; slots: Slot[] };

const makeDay = (slots: string[]): Day => ({
  date: '2025-08-10',
  slots: slots.map((d) => ({ date: d })),
});

describe('MeetingDisplay', () => {
  it('renders one MeetingSlotDisplay per slot with HH:mm labels', () => {
    const day = makeDay(['2025-08-10T12:00:00Z', '2025-08-10T13:30:00Z']);

    render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={null}
        handleMeetingSlotClick={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: '12:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '13:30' })).toBeInTheDocument();
  });

  it('calls handleMeetingSlotClick with the clicked slot', () => {
    const day = makeDay(['2025-08-10T08:05:00Z', '2025-08-10T09:00:00Z']);
    const onClick = vi.fn();

    render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={null}
        handleMeetingSlotClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '08:05' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toEqual({ date: '2025-08-10T08:05:00Z' });
  });

  it('passes loading to children (buttons disabled + loading class present)', () => {
    const day = makeDay(['2025-08-10T07:00:00Z']);

    const { container } = render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={true}
        meetingSlotSelected={null}
        handleMeetingSlotClick={() => {}}
      />,
    );

    const btn = screen.getByRole('button', { name: '07:00' });
    expect(btn).toBeDisabled();
    expect(container.querySelector('.meeting-selector__btn-loading')).toBeTruthy();
  });

  it('marks the matching slot as selected when meetingSlotSelected matches (single object)', () => {
    const day = makeDay(['2025-08-10T09:30:00Z', '2025-08-10T10:00:00Z']);

    const { container } = render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={{ date: '2025-08-10T10:00:00Z' }}
        handleMeetingSlotClick={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: '09:30' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument();
    const selected = container.querySelectorAll('.meeting-selector__btn--selected');
    expect(selected.length).toBe(1);
  });

  it('marks the matching slot as selected when meetingSlotSelected is an array', () => {
    const day = makeDay(['2025-08-10T09:00:00Z', '2025-08-10T10:00:00Z', '2025-08-10T11:00:00Z']);

    const { container } = render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={[
          { date: '2025-08-10T10:00:00Z' },
          { date: '2025-08-10T12:00:00Z' }, // not displayed
        ]}
        handleMeetingSlotClick={() => {}}
      />,
    );

    const selected = container.querySelectorAll('.meeting-selector__btn--selected');
    expect(selected.length).toBe(1);
  });

  // NEW: selected meeting exists, but it's NOT in the rendered list -> no button should be selected
  it('does NOT select anything when meetingSlotSelected is not present in the rendered slots (single object)', () => {
    const day = makeDay(['2025-08-10T11:00:00Z', '2025-08-10T11:30:00Z']);

    const { container } = render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={{ date: '2025-08-10T12:00:00Z' }} // not rendered
        handleMeetingSlotClick={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: '11:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '11:30' })).toBeInTheDocument();
    expect(container.querySelector('.meeting-selector__btn--selected')).toBeFalsy();
  });

  it('does NOT select anything when meetingSlotSelected array does not include any rendered slot', () => {
    const day = makeDay(['2025-08-10T13:00:00Z', '2025-08-10T14:00:00Z']);

    const { container } = render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={[{ date: '2025-08-10T12:00:00Z' }, { date: '2025-08-10T15:00:00Z' }]}
        handleMeetingSlotClick={() => {}}
      />,
    );

    expect(container.querySelector('.meeting-selector__btn--selected')).toBeFalsy();
  });

  it('uses renderMeeting when provided (and does not render default buttons)', () => {
    const day = makeDay(['2025-08-10T12:00:00Z', '2025-08-10T13:30:00Z']);
    const renderMeeting = vi.fn(({ meeting, index }: { meeting: Slot; index: number }) => (
      <div data-testid={`custom-${index}`}>{meeting.date}</div>
    ));

    render(
      <MeetingDisplay
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={null}
        handleMeetingSlotClick={() => {}}
        renderMeeting={renderMeeting}
      />,
    );

    expect(renderMeeting).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('custom-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    // Default buttons should not be there if custom rendering is used
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('applies additional className on container', () => {
    const day = makeDay(['2025-08-10T12:00:00Z']);

    const { container } = render(
      <MeetingDisplay
        className="extra-class"
        meetingsByDay={day}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        loading={false}
        meetingSlotSelected={null}
        handleMeetingSlotClick={() => {}}
      />,
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('meeting-selector__meetings');
    expect(root.className).toContain('extra-class');
  });
});
