# react-meeting-selector

A fully-typed, accessible and customizable React component for displaying and selecting meeting slots grouped by day. Includes pagination, multi-selection, and render customization support.

- [github](https://github.com/IneoO/meeting-selector)
- [doc](https://meeting-selector.tuturu.io)

## Dependencies

- React: 19.x

## Installation

```bash
# npm
npm install react-meeting-selector
# pnpm
pnpm add react-meeting-selector
# yarn
yarn add react-meeting-selector
```

## Exemple

```typescript
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  MeetingSelector,
  generateMeetingsByDays,
  type MeetingsByDayGenerated,
  type MeetingSlotGenerated,
  type Time,
} from 'react-meeting-selector';
import 'react-meeting-selector/style.css';

export const SimpleExample = () => {
  const [date, setDate] = useState(new Date());
  const initialDateRef = useRef(date);
  const [skip, setSkip] = useState(0);
  const [value, setValue] = useState<MeetingSlotGenerated | null>(null);
  const [meetingsDays, setMeetingsDays] = useState<MeetingsByDayGenerated[]>([]);
  const nbDaysToDisplay = 5;

  const handleChange = useCallback((val: MeetingSlotGenerated | null) => {
    setValue(val);
  }, []);

  const nextDate = useCallback(() => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    setDate(newDate);
    setMeetingsDays(generateMeetingsByDays(newDate, nbDaysToDisplay, { hours: 8, minutes: 0 }, { hours: 16, minutes: 0 }, 30));
  }, [date]);

  const previousDate = useCallback(() => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    setDate(newDate);
    setMeetingsDays(generateMeetingsByDays(newDate, nbDaysToDisplay, { hours: 8, minutes: 0 }, { hours: 16, minutes: 0 }, 30));
  }, [date]);

  useEffect(() => {
    setMeetingsDays(generateMeetingsByDays(initialDateRef.current, nbDaysToDisplay, { hours: 8, minutes: 0 }, { hours: 16, minutes: 0 }, 30));
  }, []);

  return (
    <>
      <MeetingSelector
        value={value}
        date={date}
        skip={skip}
        handleValueChange={handleChange}
        meetingsByDays={meetingsDays}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        handleNextDate={nextDate}
        handlePreviousDate={previousDate}
        handleSkipChange={setSkip}
      />
      meetingSlot: {JSON.stringify(value) ?? ''}
    </>
  );
};
```

## Props

| Prop                       | Type                                                                             | Default | Required | Description                                                         |
| -------------------------- | -------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `meetingsByDays`           | `MDay[]`                                                                         | —       | true     | List of grouped meeting slots by day.                               |
| `dateFieldKey`             | `DateFieldKey`                                                                   | —       | true     | The key used to extract the slot date (e.g., `'date'`).             |
| `meetingSlotsKey`          | `MeetingSlotsKey`                                                                | —       | true     | The key used to extract the list of slots of the day.               |
| `date`                     | `Date`                                                                           | —       | true     | The currently selected or reference date.                           |
| `value`                    | `MSlot \| MSlot[] \| null`                                                       | —       | true     | The currently selected slot(s). Controlled via `handleValueChange`. |
| `handleValueChange`        | `(val: MSlot \| null) => void` or `(val: MSlot[]) => void`                       | —       | true     | Callback invoked when the selection changes. Matches `value` type.  |
| `multi`                    | `boolean`                                                                        | `false` | false    | Enables multiple slot selection.                                    |
| `calendarOptions`          | `CalendarOptions`                                                                | `{}`    | false    | Configuration options for calendar display.                         |
| `loading`                  | `boolean`                                                                        | `false` | false    | Whether the calendar is in a loading state.                         |
| `skip`                     | `number`                                                                         | —       | false    | Number of slot rows to skip. Useful for pagination.                 |
| `handleSkipChange`         | `(skip: number) => void`                                                         | —       | false    | Callback to update skip manually (controlled pagination).           |
| `handlePreviousDate`       | `() => void`                                                                     | —       | false    | Callback triggered when going to the previous date range.           |
| `handleNextDate`           | `() => void`                                                                     | —       | false    | Callback triggered when going to the next date range.               |
| `renderButtonPreviousDate` | `(props: { loading: boolean; disabled: boolean }) => React.ReactNode`            | —       | false    | Custom rendering for the "previous date" button.                    |
| `renderButtonNextDate`     | `(props: { loading: boolean; disabled: boolean }) => React.ReactNode`            | —       | false    | Custom rendering for the "next date" button.                        |
| `renderButtonUpMeetings`   | `(props: { loading: boolean; disabled: boolean }) => React.ReactNode`            | —       | false    | Custom rendering for the "previous page" (up) button.               |
| `renderButtonDownMeetings` | `(props: { loading: boolean; disabled: boolean }) => React.ReactNode`            | —       | false    | Custom rendering for the "next page" (down) button.                 |
| `renderHeader`             | `(props: { meetings: MDay }) => React.ReactNode`                                 | —       | false    | Custom rendering for each day's header.                             |
| `renderMeeting`            | `(props: { meeting: MSlot; index: number }) => React.ReactNode`                  | —       | false    | Custom rendering for individual meeting slots.                      |
| `[...HTMLProps]`           | All standard `HTMLDivElement` props (e.g. `id`, `className`, `data-*`, `aria-*`) | —       | false    | Additional DOM attributes for the wrapper element.                  |

## Utility Functions

`generateMeetingsByDays(date, nbDays, startTime, endTime, interval)`
Creates mock or real meeting slots grouped by day, spaced at regular intervals.

```typescript
import { generateMeetingsByDays } from 'react-meeting-selector';
```

[Full API Reference](https://meeting-selector.tuturu.io/common-meeting-selector/generate-meetings-by-days.html)

`generatePlaceHolder(date, nbDays)`
Generates an array of empty days with no slots — useful for loading states.

```typescript
import { generatePlaceHolder } from 'react-meeting-selector';
```

[Full API Reference](https://meeting-selector.tuturu.io/common-meeting-selector/generate-placeholder.html)
