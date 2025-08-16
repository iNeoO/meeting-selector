<template>
  <div>
    <MeetingSelector
      ref="meetingSelector"
      v-model="meeting"
      v-model:skip="skip"
      :date="date"
      :loading="loading"
      :meetings-by-days="meetingsDays"
      date-field-key="date"
      meeting-slots-key="slots"
      @next-date="nextDate"
      @previous-date="previousDate"
    >
      <template #header="{ meetings }">
        <div class="title">{{ formattingDate(meetings.date) }}</div>
      </template>
      <template #meeting="{ meeting }">
        <div
          v-if="meeting.date"
          class="meeting"
          :class="meetingSelectedClass(meeting)"
          @click="selectMeeting(meeting)"
        >
          {{ formattingTime(meeting.date) }}
        </div>
        <div v-else class="meeting--empty">&mdash;</div>
      </template>
      <template #button-previous-date>
        <button
          type="button"
          class="button-pagination"
          :disabled="isPreviousDisabled || loading"
          @click="previousDate"
        >
          &lt;
        </button>
      </template>
      <template #button-next-date>
        <button type="button" @click="nextDate" :disabled="loading" class="button-pagination">
          >
        </button>
      </template>
      <template #button-up-meetings="{ isDisabled }">
        <button
          type="button"
          @click="previousMeetings"
          class="button-pagination"
          :disabled="isDisabled"
        >
          ^
        </button>
      </template>
      <template #button-down-meetings="{ isDisabled }">
        <button
          type="button"
          @click="nextMeetings"
          class="button-pagination"
          :disabled="isDisabled"
        >
          ⌄
        </button>
      </template>
    </MeetingSelector>
    Meeting selected: {{ meeting }}
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
import { ref, onMounted, useTemplateRef, computed } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

const nbDaysToDisplay = 5;
const date = ref(new Date());
const meetingsDays = ref<MeetingsByDayGenerated[]>(
  generatePlaceHolder(date.value, nbDaysToDisplay),
);
const skip = ref(0);

type MeetingSelectorType = ComponentExposed<typeof MeetingSelector>;
const meetingSelector = useTemplateRef<MeetingSelectorType>('meetingSelector');

const meeting = ref<MeetingSlotGenerated | null>(null);
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

const formattingDate = (dateToFormat: Date) => {
  const d = new Date(dateToFormat);
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  return `${month}-${day}`;
};

const formattingTime = (dateToFormat: Date | string) => {
  const d = new Date(dateToFormat);
  const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  return `${hours}:${minutes}`;
};

const selectMeeting = (m: MeetingSlotGenerated) => {
  if (meeting.value) {
    const selectedDate = new Date(m.date);
    const d = new Date(meeting.value.date);
    if (selectedDate.getTime() !== d.getTime()) {
      meeting.value = m;
    } else {
      meeting.value = null;
    }
  } else {
    meeting.value = m;
  }
};

const nextMeetings = () => {
  meetingSelector.value?.nextMeetings();
};

const previousMeetings = () => {
  meetingSelector.value?.previousMeetings();
};

const isPreviousDisabled = computed(() => {
  const d = new Date(date.value);
  d.setDate(d.getDate() - 1);
  return formattingDate(d) < formattingDate(new Date());
});

const meetingSelectedClass = (m: MeetingSlotGenerated) => {
  if (!meeting.value) {
    return '';
  }
  const selectedDate = new Date(m.date);
  const d = new Date(meeting.value.date);

  if (selectedDate.getTime() === d.getTime()) {
    return 'meeting--selected';
  }
  return '';
};
</script>

<style>
.button-pagination {
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.meeting {
  display: inline-block;
  padding: 5px;
  margin: 5px 0;
  background-color: #845ec2;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  .meeting--selected {
    background-color: #b39cd0;
  }
  .meeting--empty {
    display: inline-block;
    padding: 5px;
    margin: 5px 0;
    cursor: not-allowed;
  }
}
</style>
