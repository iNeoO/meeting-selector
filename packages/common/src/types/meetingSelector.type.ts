export type MeetingSlot<DateFieldKey extends string> = {
  [K in DateFieldKey]: string | Date;
} & Record<string, unknown>;

export type MeetingsByDay<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>
> = {
  [K in DateFieldKey]: string | Date;
} & {
  [K in MeetingSlotsKey]: MSlot[];
} & Record<string, unknown>;

export type CalendarOptions = {
  daysLabel?: string[];
  monthsLabel?: string[];
  limit?: number;
  spacing?: number;
  disabledDate?: (date: string | Date) => boolean;
};
