# generatePlaceHolder

Generates a simplified list of days (excluding weekends), with **empty slot arrays** — useful for quickly mocking or displaying placeholder data in development or loading states.

## Use Case

This utility is intended to create quick scaffolding for the `MeetingSelector` component, particularly when you don’t need actual time slots yet. It helps simulate availability structures without specifying real hours.

## Function Signature

```ts
generatePlaceHolder(date: Date, nbDays: number): MeetingsByDayGenerated[]
```

## Parameters

| Name     | Type     | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `date`   | `Date`   | The start date for generating placeholder days.            |
| `nbDays` | `number` | Number of **weekdays** to generate (weekends are skipped). |

## Returns

```ts
type MeetingsByDayGenerated = {
  date: Date;
  slots: [];
};
```

An array of objects, each containing:

- A `date` (skipping weekends)
- An empty `slots array` — ready to be filled later or used as placeholder

## Behavior

- Slot arrays are always empty ([]).
- Dates are cloned to avoid mutation side-effects.

## Exemple

```ts
import { generatePlaceHolder } from '<framework>-meeting-selector';

const placeholders = generatePlaceHolder(new Date(), 3);

console.log(placeholders);
/*
[
  { date: 2025-07-21T00:00:00.000Z, slots: [] },
  { date: 2025-07-22T00:00:00.000Z, slots: [] },
  { date: 2025-07-23T00:00:00.000Z, slots: [] },
]
*/
```
