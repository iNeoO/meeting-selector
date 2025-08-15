export type Time = {
  hours: number;
  minutes: number;
};

export type MeetingSlotGenerated = {
  date: Date;
};
export type MeetingsByDayGenerated = {
  date: Date;
  slots: MeetingSlotGenerated[];
};
