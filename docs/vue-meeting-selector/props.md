# Props

This component displays meeting slots grouped by day. It is fully typed and supports advanced customization through props

## Props Table

| Prop              | Type                                  | Default | Required | Description                                                |
| ----------------- | ------------------------------------- | ------- | -------- | ---------------------------------------------------------- |
| `meetingsByDays`  | `MDay[]`                              | —       | true     | List of grouped meeting slots by day.                      |
| `dateFieldKey`    | `DateFieldKey`                        | —       | true     | The key used to extract the slot date (e.g., `'startAt'`). |
| `meetingSlotsKey` | `MeetingSlotsKey`                     | —       | true     | The key used to extract the list of slots of the day.      |
| `date`            | `Date`                                | —       | true     | The currently selected or reference date.                  |
| `modelValue`      | `MSlot \| MSlot[] \| null`            | —       | true     | Selected slot(s), used with `v-model`.                     |
| `multi`           | `boolean`                             | `false` | false    | Enables multiple slot selection.                           |
| `calendarOptions` | [`CalendarOptions`](#calendaroptions) | `{}`    | false    | Configuration options for calendar display.                |
| `loading`         | `boolean`                             | `false` | false    | Whether the calendar is in a loading state.                |
| `skip`            | `number`                              | `-1`    | false    | Number of slot rows to skip. Useful for pagination.        |

## Types

### `MeetingSlot<MeetingDateKey>`

```typescript
export type MeetingSlot<MeetingDateKey extends string> = {
  [K in MeetingDateKey]: string | Date;
} & Record<string, unknown>;
```

Represents a single meeting slot. It includes a dynamic date key (MeetingDateKey, such as "startAt" or "date"), and any other custom data.

### `MeetingsByDay<MeetingDateKey, Slot>`

```typescript
export type MeetingsByDay<
  MeetingDateKey extends string,
  Slot extends MeetingSlot<MeetingDateKey>
> = {
  [K in MeetingDateKey]: string | Date;
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
