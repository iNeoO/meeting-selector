# vue-meeting-selector

A fully-typed, accessible and customizable Vue component for displaying and selecting meeting slots grouped by day. Includes pagination, multi-selection, and render customization support.

- [github](https://github.com/IneoO/meeting-selector)
- [doc](https://meeting-selector.tuturu.io)

## Dependencies

- vue: 3.x

## Installation

```bash
# npm
npm install vue-meeting-selector
# pnpm
pnpm add vue-meeting-selector
# yarn
yarn add vue-meeting-selector
```

## Exemple

```html
<template>
  <div>
    <MeetingSelector
      v-model="meeting"
      v-model:skip="skip"
      :date="date"
      :meetings-by-days="meetingsDays"
      date-field-key="date"
      meeting-slots-key="slots"
      @next-date="nextDate"
      @previous-date="previousDate"
    />
    Meeting selected: {{ meeting }}
  </div>
</template>

<script setup lang="ts">
  import {
    MeetingSelector,
    generateMeetingsByDays,
    type MeetingsByDayGenerated,
    type MeetingSlotGenerated,
    type Time,
  } from 'vue-meeting-selector';
  import 'vue-meeting-selector/style.css';
  import { ref } from 'vue';

  const nbDaysToDisplay = 5;
  const date = ref(new Date());
  const meetingsDays = ref<MeetingsByDayGenerated[]>([]);
  const skip = ref(0);

  const meeting = ref<MeetingSlotGenerated | null>(null);
  const loading = ref(true);

  const nextDate = () => {
    loading.value = true;
    const start: Time = {
      hours: 8,
      minutes: 0,
    };
    const end: Time = {
      hours: 16,
      minutes: 0,
    };
    const dateCopy = new Date(date.value);
    const newDate = new Date(dateCopy.setDate(dateCopy.getDate() + 7));
    date.value = newDate;
    meetingsDays.value = generateMeetingsByDays(newDate, nbDaysToDisplay, start, end, 30);
    loading.value = false;
  };

  const previousDate = () => {
    loading.value = true;
    const start: Time = {
      hours: 8,
      minutes: 0,
    };
    const end: Time = {
      hours: 16,
      minutes: 0,
    };
    const dateCopy = new Date(date.value);
    dateCopy.setDate(dateCopy.getDate() - 7);
    const formattingDate = (dateToFormat: Date) => {
      const d = new Date(dateToFormat);
      const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };
    const newDate =
      formattingDate(new Date()) >= formattingDate(dateCopy) ? new Date() : new Date(dateCopy);
    date.value = newDate;
    meetingsDays.value = generateMeetingsByDays(newDate, nbDaysToDisplay, start, end, 30);
    loading.value = false;
  };

  const start: Time = {
    hours: 8,
    minutes: 0,
  };
  const end: Time = {
    hours: 16,
    minutes: 0,
  };
  meetingsDays.value = generateMeetingsByDays(date.value, nbDaysToDisplay, start, end, 30);
  loading.value = false;
</script>
```

## Props

| Prop              | Type                       | Default | Required | Description                                                |
| ----------------- | -------------------------- | ------- | -------- | ---------------------------------------------------------- |
| `meetingsByDays`  | `MDay[]`                   | —       | true     | List of grouped meeting slots by day.                      |
| `dateFieldKey`    | `DateFieldKey`             | —       | true     | The key used to extract the slot date (e.g., `'startAt'`). |
| `meetingSlotsKey` | `MeetingSlotsKey`          | —       | true     | The key used to extract the list of slots of the day.      |
| `date`            | `Date`                     | —       | true     | The currently selected or reference date.                  |
| `modelValue`      | `MSlot \| MSlot[] \| null` | —       | true     | Selected slot(s), used with `v-model`.                     |
| `multi`           | `boolean`                  | `false` | false    | Enables multiple slot selection.                           |
| `calendarOptions` | `CalendarOptions`          | `{}`    | false    | Configuration options for calendar display.                |
| `loading`         | `boolean`                  | `false` | false    | Whether the calendar is in a loading state.                |
| `skip`            | `number`                   | `-1`    | false    | Number of slot rows to skip. Useful for pagination.        |

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
