<template>
  <div class="meeting-selector">
    <div class="meeting-selector__tab">
      <div class="meeting-selector__pagination">
        <slot name="button-previous-date">
          <button
            type="button"
            :disabled="options.disabledDate(props.date) || props.loading"
            class="meeting-selector__btn-icon"
            :class="{ 'meeting-selector__btn-icon--loading': props.loading }"
            @click="previousDate"
          >
            <arrow-icon direction="left" />
          </button>
        </slot>
      </div>
      <div class="meeting-selector__days">
        <div
          class="meeting-selector__day"
          v-for="meetingsByDay in meetingsByDaysPaginated"
          :key="String(meetingsByDay[props.dateFieldKey])"
        >
          <slot name="header" :meetings="meetingsByDay">
            <MeetingsByDayDisplay
              class="meeting-selector__day-display"
              :meetings-by-day="meetingsByDay"
              :date-field-key="props.dateFieldKey"
              :meeting-slots-key="props.meetingSlotsKey"
              :months-label="options.monthsLabel"
              :days-label="options.daysLabel"
            />
          </slot>
          <MeetingsDisplay
            :meetings-by-day="meetingsByDay"
            :loading="props.loading"
            :date-field-key="props.dateFieldKey"
            :meeting-slots-key="props.meetingSlotsKey"
            :meeting-slot-selected="modelValue"
            @meeting-slot-click="meetingSlotClick"
          >
            <template #meeting="{ meeting }" v-if="$slots.meeting">
              <slot name="meeting" :meeting="meeting" />
            </template>
          </MeetingsDisplay>
        </div>
      </div>
      <div class="meeting-selector__pagination">
        <slot name="button-next-date">
          <button
            type="button"
            class="meeting-selector__btn-icon"
            :disabled="loading"
            :class="{ 'meeting-selector__btn-icon--loading': props.loading }"
            @click="nextDate"
          >
            <arrow-icon direction="right" />
          </button>
        </slot>
        <slot name="button-up-meetings" :is-disabled="currentSkip === 0 || loading">
          <button
            type="button"
            :disabled="currentSkip === 0 || loading"
            class="meeting-selector__btn-icon"
            :class="{ 'meeting-selector__btn-icon--loading': props.loading }"
            @click="previousMeetings"
          >
            <arrow-icon direction="up" />
          </button>
        </slot>
        <slot
          name="button-down-meetings"
          :is-disabled="currentSkip + options.spacing >= maxNbMeetings || loading"
        >
          <button
            type="button"
            :disabled="currentSkip + options.spacing >= maxNbMeetings || loading"
            class="meeting-selector__btn-icon"
            :class="{ 'meeting-selector__btn-icon--loading': props.loading }"
            @click="nextMeetings"
          >
            <arrow-icon direction="down" />
          </button>
        </slot>
      </div>
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
import 'common-meeting-selector/style';
import 'common-meeting-selector/icons';
import {
  defaultCalendarOptions,
  type CalendarOptions,
  type MeetingSlot,
  type MeetingsByDay,
} from 'common-meeting-selector';
import { computed, ref } from 'vue';
import ArrowIcon from './ArrowIcon.vue';
import MeetingsByDayDisplay from './DayDisplay.vue';
import MeetingsDisplay from './MeetingsDisplay.vue';

type BaseProps = {
  meetingsByDays: MDay[];
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  date: Date;
  calendarOptions?: CalendarOptions;
  loading?: boolean;
  skip?: number;
};

const props = withDefaults(
  defineProps<
    | (BaseProps & {
        multi?: false;
        modelValue: MSlot | null;
      })
    | (BaseProps & {
        multi: true;
        modelValue: MSlot[];
      })
  >(),
  {
    multi: false,
    loading: false,
    calendarOptions: () => ({}),
    skip: -1,
  },
);

const emit = defineEmits<{
  'next-date': [];
  'previous-date': [];
  'update:skip': [skip: number];
  'update:modelValue': [meetingSlot: MSlot[] | MSlot | null];
  change: [meetingSlot: MSlot[] | MSlot | null];
}>();

defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meeting?: (props: { meeting: MSlot }) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header?: (props: { meetings: MDay }) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'button-previous-date'?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'button-next-date'?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'button-up-meetings'?: (props: { isDisabled: boolean }) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'button-down-meetings'?: (props: { isDisabled: boolean }) => any;
}>();

const isControlled = computed(() => props.skip !== -1);
const internalSkip = ref(0);

const currentSkip = computed({
  get() {
    return isControlled.value ? props.skip : internalSkip.value;
  },
  set(value) {
    if (isControlled.value) {
      emit('update:skip', value);
    } else {
      internalSkip.value = value;
    }
  },
});

const options = computed(() => {
  return {
    ...defaultCalendarOptions,
    ...props.calendarOptions,
  };
});

const maxNbMeetings = computed(() => {
  if (!props.meetingsByDays.length) {
    return 0;
  }
  return Math.max(
    ...props.meetingsByDays.map((meetingsByDay) => meetingsByDay[props.meetingSlotsKey].length),
  );
});

const meetingsByDaysPaginated = computed(() => {
  const arrayIndex = Math.ceil(maxNbMeetings.value / options.value.limit) * options.value.limit;
  return props.meetingsByDays.map((meetingsByDay) => {
    const slots: MSlot[] = new Array(arrayIndex).fill({
      [props.dateFieldKey]: '',
    });
    slots.splice(
      0,
      meetingsByDay[props.meetingSlotsKey].length,
      ...(meetingsByDay[props.meetingSlotsKey] as MSlot[]),
    );
    const day = {
      ...meetingsByDay,
      [props.meetingSlotsKey]: slots.slice(
        currentSkip.value,
        currentSkip.value + options.value.limit,
      ),
    };
    return day;
  });
});

const nextMeetings = () => {
  currentSkip.value += options.value.spacing;
};

const previousMeetings = () => {
  currentSkip.value -= options.value.spacing;
};

const previousDate = () => {
  emit('previous-date');
};

const nextDate = () => {
  emit('next-date');
};

defineExpose({
  nextDate,
  previousDate,
  nextMeetings,
  previousMeetings,
});

const meetingSlotClick = (meeting: MSlot) => {
  if (props.multi && Array.isArray(props.modelValue)) {
    const selectedDate = new Date(meeting[props.dateFieldKey]).getTime();
    const existingIndex = props.modelValue.findIndex((s) => {
      const date = new Date(s[props.dateFieldKey]);
      return date.getTime() === selectedDate;
    });
    const next = [...props.modelValue];
    if (existingIndex !== -1) {
      next.splice(existingIndex, 1);
      emit('change', next);
      emit('update:modelValue', next);
    } else {
      next.push(meeting);
      emit('change', next);
      emit('update:modelValue', next);
    }
    return;
  }
  if (props.modelValue && !Array.isArray(props.modelValue)) {
    const selectedDate = new Date(meeting[props.dateFieldKey]).getTime();
    const current = new Date(props.modelValue[props.dateFieldKey]).getTime();
    if (current === selectedDate) {
      emit('change', null);
      emit('update:modelValue', null);
      return;
    }
  }
  emit('change', meeting);
  emit('update:modelValue', meeting);
};
</script>
