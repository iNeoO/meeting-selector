<template>
  <div>
    <MeetingSelector
      v-model="meetings"
      v-model:skip="skip"
      :date="date"
      :loading="loading"
      :meetings-by-days="meetingsDays"
      date-field-key="date"
      meeting-slots-key="slots"
      multi
      @next-date="nextDate"
      @previous-date="previousDate"
    />
    Meeting selected: {{ meetings }}
  </div>
</template>

<script setup lang="ts">
import {
  MeetingSelector,
  generateMeetingsByDays,
  generatePlaceHolder,
  type MeetingsByDayGenerated,
  type MeetingSlotGenerated,
  type Time,
} from 'vue-meeting-selector';
import 'vue-meeting-selector/style.css';
import { ref, onMounted } from 'vue';

const nbDaysToDisplay = 5;

const date = ref(new Date());
const meetingsDays = ref<MeetingsByDayGenerated[]>(
  generatePlaceHolder(date.value, nbDaysToDisplay),
);
const skip = ref(0);

const meetings = ref<MeetingSlotGenerated[]>([]);
const loading = ref(true);

const generateMeetingsByDaysAsync = (
  d: Date,
  n: number,
  start: Time,
  end: Time,
  timesBetween: number,
): Promise<ReturnType<typeof generateMeetingsByDays>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMeetingsByDays(d, n, start, end, timesBetween));
    }, 1000);
  });

const nextDate = async () => {
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
  meetingsDays.value = await generateMeetingsByDaysAsync(newDate, nbDaysToDisplay, start, end, 30);
  loading.value = false;
};

const previousDate = async () => {
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
  meetingsDays.value = await generateMeetingsByDaysAsync(newDate, nbDaysToDisplay, start, end, 30);
  loading.value = false;
};

onMounted(async () => {
  const start: Time = {
    hours: 8,
    minutes: 0,
  };
  const end: Time = {
    hours: 16,
    minutes: 0,
  };
  meetingsDays.value = await generateMeetingsByDaysAsync(
    date.value,
    nbDaysToDisplay,
    start,
    end,
    30,
  );
  loading.value = false;
});
</script>

<style>
/* for support vitepress dark mode */
.dark .meeting-selector {
  --btn-bg: #2c3e50;
  --btn-bg-hover: #3b4f63;
  --btn-bg-disabled: #4a4a4a;
  --btn-text: #ffffff;
  --btn-text-disabled: #aaaaaa;
  --btn-border: transparent;
  --btn-border-focus: #4e7caa;
  --btn-focus-ring: 0 0 0 2px #4e7caa;
  --grid-border-color: #444;
  --btn-icon-disabled: #777;
  --btn-color-empty: #666;
  --loading-color-light: #4b5563;
  --loading-color-dark: #1f2937;
}
</style>
