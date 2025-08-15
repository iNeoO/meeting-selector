import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayDisplay } from './DayDisplay';

describe('DayDisplay', () => {
  it('renders the correct title and subtitle based on the meetingsByDay prop', () => {
    const meetingsByDay = {
      date: '2025-08-10T12:00:00Z',
      slots: [],
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

    render(
      <DayDisplay
        meetingsByDay={meetingsByDay}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        daysLabel={daysLabel}
        monthsLabel={monthsLabel}
      />,
    );

    const titleElement = screen.getByText('Sunday');
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText('10 August');
    expect(subtitleElement).toBeInTheDocument();
  });
});
