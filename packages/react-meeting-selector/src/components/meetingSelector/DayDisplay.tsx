import { type HTMLAttributes, memo, useMemo } from 'react';
import type { MeetingSlot, MeetingsByDay } from 'common-meeting-selector';

type DayDisplayProps<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
> = {
  meetingsByDay: MDay;
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  daysLabel: string[];
  monthsLabel: string[];
} & HTMLAttributes<HTMLElement>;

const DayDisplayComponent = <
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
>({
  meetingsByDay,
  dateFieldKey,
  daysLabel,
  monthsLabel,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  meetingSlotsKey,
  ...props
}: DayDisplayProps<DateFieldKey, MeetingSlotsKey, MSlot, MDay>) => {
  const date = useMemo(() => new Date(meetingsByDay[dateFieldKey]), [meetingsByDay, dateFieldKey]);

  const title = useMemo(() => {
    return daysLabel[date.getDay()];
  }, [date, daysLabel]);

  const subtitle = useMemo(() => {
    return `${date.getDate()} ${monthsLabel[date.getMonth()]}`;
  }, [date, monthsLabel]);

  return (
    <div className={`day ${className ?? ''}`} {...props}>
      <div className="day__title">{title}</div>
      <div className="day__subtitle">{subtitle}</div>
    </div>
  );
};

export const DayDisplay = memo(DayDisplayComponent) as typeof DayDisplayComponent;
