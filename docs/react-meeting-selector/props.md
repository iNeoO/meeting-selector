# Props

This component displays meeting slots grouped by day. It is fully typed and supports advanced customization through props

## Props table

| Prop                       | Type                                                                             | Default | Required | Description                                                         |
| -------------------------- | -------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `meetingsByDays`           | `MDay[]`                                                                         | —       | true     | List of grouped meeting slots by day.                               |
| `dateFieldKey`             | `DateFieldKey`                                                                   | —       | true     | The key used to extract the slot date (e.g., `'date'`).             |
| `meetingSlotsKey`          | `MeetingSlotsKey`                                                                | —       | true     | The key used to extract the list of slots of the day.               |
| `date`                     | `Date`                                                                           | —       | true     | The currently selected or reference date.                           |
| `value`                    | `MSlot \| MSlot[] \| null`                                                       | —       | true     | The currently selected slot(s). Controlled via `handleValueChange`. |
| `handleValueChange`        | `(val: MSlot \| null) => void` or `(val: MSlot[]) => void`                       | —       | true     | Callback invoked when the selection changes. Matches `value` type.  |
| `multi`                    | `boolean`                                                                        | `false` | false    | Whether multiple selections are allowed.                            |
| `calendarOptions`          | [`CalendarOptions`](#calendaroptions)                                            | `{}`    | false    | Configuration options for calendar display.                         |
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
| `[...HTMLProps]`           | All standard `HTMLDivElement` props (e.g. `id`, `className`, `data-*`, `aria-*`) | —       | false    | You can pass additional DOM attributes.                             |

## Types

### `MeetingSlot<DateFieldKey>`

```typescript
export type MeetingSlot<DateFieldKey extends string> = {
  [K in DateFieldKey]: string | Date;
} & Record<string, unknown>;
```

Represents a single meeting slot. It includes a dynamic date key (DateFieldKey, such as "startAt" or "date"), and any other custom data.

### `MeetingsByDay<DateFieldKey, MeetingSlotsKey, Slot>`

```typescript
export type MeetingsByDay<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>
> = {
  [K in DateFieldKey]: string | Date;
} & {
  [K in MeetingSlotsKey]: MSlot[];
} & Record<string, unknown>;
```

Represents a day grouping multiple slots, each of which follows the MeetingSlot shape.

### `CalendarOptions`

```typescript
export type CalendarOptions = {
  daysLabel?: string[]; // Labels for days of the week
  monthsLabel?: string[]; // Labels for months
  limit?: number; // Max number of days to display
  spacing?: number; // Gap between days
  disabledDate?: (date: string | Date) => boolean; // Disable specific dates
};
```

Use this to control calendar appearance, layout, and behavior.
