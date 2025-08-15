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

export { MeetingSelector } from './components/meetingSelector/MeetingSelector';
