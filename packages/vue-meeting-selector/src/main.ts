export {
  // meetingSelector.type.ts
  type MeetingSlot,
  type MeetingsByDay,
  type CalendarOptions,
  // slotsGenerator.type.ts
  type Time,
  type MeetingSlotGenerated,
  type MeetingsByDayGenerated,
  // slotsGenerator.ts
  generatePlaceHolder,
  generateMeetingsByDays,
} from 'common-meeting-selector';

export { default as MeetingSelector } from './components/meetingSelector/MeetingSelector.vue';
