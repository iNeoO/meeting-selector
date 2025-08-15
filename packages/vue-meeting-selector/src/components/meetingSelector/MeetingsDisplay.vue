<template>
  <div class="meeting-selector__meetings">
    <slot v-for="(slot, index) in meetingSlots" :key="index" name="meeting" :meeting="slot">
      <meeting-slot-display
        :meeting-slot="slot"
        :loading="props.loading"
        :meeting-slot-selected="props.meetingSlotSelected"
        :date-field-key="props.dateFieldKey"
        @meeting-slot-click="meetingSlotClick as MeetingSlotClick"
      />
    </slot>
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
import MeetingSlotDisplay from './MeetingSlotDisplay.vue';

type MeetingSlotClick = (meetingSlot: MSlot) => void;

const props = defineProps<{
  meetingsByDay: MDay;
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  loading?: boolean;
  meetingSlotSelected: MSlot | MSlot[] | null;
}>();

const emit = defineEmits<{
  'meeting-slot-click': [meetingSlot: MSlot];
}>();

const meetingSlots = computed(() => props.meetingsByDay[props.meetingSlotsKey] as MSlot[]);

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meeting?: (props: { meeting: MSlot; key: number }) => any;
}>();

const meetingSlotClick = (meetingSlot: MSlot) => {
  emit('meeting-slot-click', meetingSlot);
};
</script>
