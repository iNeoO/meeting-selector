import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('./DayDisplay', () => ({
  DayDisplay: vi.fn(() => null),
}));

vi.mock('./ArrowIcon', () => ({
  ArrowIcon: vi.fn(() => null),
}));

import { MeetingSelector } from './MeetingSelector';

type Slot = { date: string };
type Day = { date: string; slots: Slot[] };

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
  it('paginates slots use down', () => {
    const handleMeetingSlotClick = vi.fn();
    const handleSkipChange = vi.fn();
    const handleDateChange = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        skip={0}
        handleSkipChange={handleSkipChange}
        handleNextDate={handleDateChange}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(handleSkipChange).toHaveBeenCalledWith(2);
  });

  it('paginates slots use up', () => {
    const handleMeetingSlotClick = vi.fn();
    const handleSkipChange = vi.fn();
    const handleDateChange = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        skip={2}
        handleSkipChange={handleSkipChange}
        handleNextDate={handleDateChange}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 2]);
    expect(handleSkipChange).toHaveBeenCalledWith(0);
  });

  it('display loading when loading', () => {
    const handleMeetingSlotClick = vi.fn();
    const handleSkipChange = vi.fn();
    const handleDateChange = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        loading={true}
        skip={0}
        handleSkipChange={handleSkipChange}
        handleNextDate={handleDateChange}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(buttons[3].classList).toContain('meeting-selector__btn-icon--loading');
  });

  it('calls handlePreviousDate/handleNextDate', () => {
    const handleMeetingSlotClick = vi.fn();
    const handleSkipChange = vi.fn();
    const handleDateChange = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        skip={0}
        handleSkipChange={handleSkipChange}
        handlePreviousDate={handleDateChange}
        handleNextDate={handleDateChange}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(handleDateChange).toBeCalled();
    fireEvent.click(buttons[buttons.length - 3]);
    expect(handleDateChange).toHaveBeenCalledTimes(2);
  });

  it('calls handleValueChange when a meeting slot is clicked', () => {
    const handleMeetingSlotClick = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        skip={0}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(handleMeetingSlotClick).toHaveBeenCalledWith({ date: '2025-08-10T09:00:00Z' });
  });

  it('calls handleValueChange when a meeting slot is clicked with slot already selected', () => {
    const handleMeetingSlotClick = vi.fn();

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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={{ date: '2025-08-10T09:00:00Z' }}
        skip={0}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(handleMeetingSlotClick).toHaveBeenCalledWith(null);
  });

  it('calls handleValueChange when a meeting slot is clicked in multi', () => {
    const handleMeetingSlotClick = vi.fn();

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

    render(
      <MeetingSelector<'date', 'slots', Slot, Day>
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        multi={true}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={[{ date: '2025-08-10T08:00:00Z' }]}
        skip={0}
        handleValueChange={handleMeetingSlotClick}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(handleMeetingSlotClick).toHaveBeenCalledWith([
      { date: '2025-08-10T08:00:00Z' },
      { date: '2025-08-10T09:00:00Z' },
    ]);
    fireEvent.click(buttons[1]);
    expect(handleMeetingSlotClick).toHaveBeenCalledWith([]);
  });

  it('changes internal skip', () => {
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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        handleValueChange={() => {}}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    const expected = hhmmLocal('2025-08-10T10:00:00Z');
    expect(screen.getByRole('button', { name: expected })).toBeInTheDocument();
  });

  it('handle empty meetingsByDays', () => {
    render(
      <MeetingSelector
        meetingsByDays={[]}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        handleValueChange={() => {}}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
  });

  it('renders component with renderFunctions', () => {
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

    render(
      <MeetingSelector
        meetingsByDays={days}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        date={new Date('2025-08-10')}
        calendarOptions={{
          limit: 2,
          spacing: 2,
          daysLabel: [],
          monthsLabel: [],
          disabledDate: () => false,
        }}
        value={null}
        handleValueChange={() => {}}
        renderButtonDownMeetings={() => <button type="button">Down</button>}
        renderButtonNextDate={() => <button type="button">Next</button>}
        renderButtonPreviousDate={() => <button type="button">Previous</button>}
        renderButtonUpMeetings={() => <button type="button">Up</button>}
        renderHeader={({ meetings }) => (
          <div>
            <h1>Meetings for {meetings.date}</h1>
          </div>
        )}
        renderMeeting={({ meeting }) => (
          <div key={String(meeting.date)}>{new Date(meeting.date).toLocaleTimeString()}</div>
        )}
      />,
    );

    expect(screen.getByText('Down')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
  });
});
