# generateDays

Generates a list of days, each with time slots between a given start and end time, skipping weekends.

## Use Case

This utility is designed to help create mock or real meetingsByDay data compatible with your MeetingSelector component — especially useful in development, testing, or preview environments.

## Function Signature

```typescript
generateDays(
  date: Date,
  nbDays: number,
  startTime: Time,
  endTime: Time,
  interval: number
): MeetingsByDayGenerated[]
```

## Parameters

| Name        | Type     | Description                                                                |
| ----------- | -------- | -------------------------------------------------------------------------- |
| `date`      | `Date`   | The starting date for slot generation.                                     |
| `nbDays`    | `number` | Number of **weekdays** to generate (weekends are skipped).                 |
| `startTime` | `Time`   | Time of day when the slots should start (e.g. `{ hours: 9, minutes: 0 }`). |
| `endTime`   | `Time`   | Time of day when the slots should end.                                     |
| `interval`  | `number` | Length of each slot in **minutes**.                                        |

## Returns

```typescript
type MeetingsByDayGenerated = {
  date: Date;
  slots: {
    date: Date;
  }[];
};
```

An array of objects, each containing:

- A date
- An array of slot objects ({ date: Date }) between startTime and endTime spaced by interval

## Behavior

- The first day starts immediately or from startTime, depending on the current time.
- All time slots are rounded to the next closest interval.
- Times are set with zero seconds and milliseconds for consistency.

## Example

```typescript
import { generateDays } from '<framework>-meeting-selector';

const days = generateDays(
  new Date(), // today
  5, // generate 5 weekdays
  { hours: 9, minutes: 0 }, // start at 09:00
  { hours: 17, minutes: 0 }, // end at 17:00
  30 // 30-minute slots
);

console.log(days);
/*
[
  {
    date: 2025-07-16T00:00:00.000Z,
    slots: [
      { date: 2025-07-16T09:00:00.000Z },
      { date: 2025-07-16T09:30:00.000Z },
      ...
    ]
  },
  ...
]
*/
```

## Types

```typescript
export type Time = {
  hours: number;
  minutes: number;
};

export type MeetingSlotGenerated = {
  date: Date;
};

export type MeetingsByDayGenerated = {
  date: Date;
  slots: MeetingSlotGenerated[];
};
```
