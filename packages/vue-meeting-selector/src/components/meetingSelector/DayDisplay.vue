<template>
  <div class="day">
    <div class="day__title">
      {{ title }}
    </div>
    <div class="day__subtitle">
      {{ subtitle }}
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    DateFieldKey extends string,
    MeetingSlotsKey extends string,
    MSlot extends MeetingSlot<DateFieldKey>,
    MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>
  "
>
import { computed } from 'vue';
import type { MeetingSlot, MeetingsByDay } from 'common-meeting-selector';

const props = defineProps<{
  meetingsByDay: MDay;
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  daysLabel: string[];
  monthsLabel: string[];
}>();

const title = computed(() => {
  const date = new Date(props.meetingsByDay[props.dateFieldKey]);
  return props.daysLabel[date.getDay()];
});

const subtitle = computed(() => {
  const date = new Date(props.meetingsByDay[props.dateFieldKey]);
  return `${date.getDate()} ${props.monthsLabel[date.getMonth()]}`;
});
</script>
