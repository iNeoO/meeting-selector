<template>
  <div>
    <button
      type="button"
      v-if="meetingSlot.date"
      class="meeting-selector__btn"
      :class="meetingClass"
      :disabled="loading"
      @click="meetingSlotClick"
    >
      {{ time }}
    </button>
    <div v-else class="meeting-selector__btn-empty">&mdash;</div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="DateFieldKey extends string, MSlot extends MeetingSlot<DateFieldKey>"
>
import type { MeetingSlot } from 'common-meeting-selector';
import { computed } from 'vue';

const props = defineProps<{
  meetingSlot: MSlot;
  dateFieldKey: DateFieldKey;
  loading?: boolean;
  meetingSlotSelected: MSlot[] | MSlot | null;
}>();

const emit = defineEmits<{
  'meeting-slot-click': [meetingSlot: MSlot];
}>();

const time = computed(() => {
  const date = new Date(props.meetingSlot[props.dateFieldKey]);
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${minutes}`;
});

const isMeetingSelected = computed(() => {
  if (Array.isArray(props.meetingSlotSelected)) {
    const date: number = new Date(props.meetingSlot[props.dateFieldKey]).getTime();
    for (const slot of props.meetingSlotSelected) {
      const d = new Date(slot[props.dateFieldKey]);
      if (d.getTime() === date) {
        return true;
      }
    }
    return false;
  }
  if (props.meetingSlotSelected?.[props.dateFieldKey]) {
    const meetingSelectedDate = new Date(props.meetingSlotSelected[props.dateFieldKey]);
    const meetingDate = new Date(props.meetingSlot[props.dateFieldKey]);
    return meetingSelectedDate.getTime() === meetingDate.getTime();
  }
  return false;
});

const meetingClass = computed(() => ({
  'meeting-selector__btn--selected': isMeetingSelected.value,
  'meeting-selector__btn-loading': props.loading,
}));

const meetingSlotClick = () => {
  emit('meeting-slot-click', props.meetingSlot);
};
</script>
