import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import DayDisplay from './DayDisplay.vue';
import { MeetingSlot, MeetingsByDay } from 'common-meeting-selector';

describe('DayDisplay', () => {
  it('renders the correct title and subtitle based on the meetingsByDay prop', () => {
    const slots: MeetingSlot<'date'>[] = [];
    const meetingsByDay: MeetingsByDay<'date', 'slots', MeetingSlot<'date'>> = {
      date: '2025-08-10T12:00:00Z',
      slots,
    };

    const daysLabel = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const monthsLabel = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Render the component
    render(DayDisplay, {
      props: {
        meetingsByDay: meetingsByDay as unknown as MeetingsByDay<
          string,
          string,
          MeetingSlot<string>
        >,
        dateFieldKey: 'date',
        meetingSlotsKey: 'slots',
        daysLabel,
        monthsLabel,
      },
    });

    const titleElement = screen.getByText('Sunday');
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText('10 August');
    expect(subtitleElement).toBeInTheDocument();
  });
});
