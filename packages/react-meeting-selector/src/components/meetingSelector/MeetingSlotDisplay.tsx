import type { MeetingSlot } from 'common-meeting-selector';
import { type HTMLAttributes, memo, useMemo } from 'react';

type MeetingSlotDisplayProps<
  DateFieldKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
> = {
  meetingSlot: MSlot;
  dateFieldKey: DateFieldKey;
  loading?: boolean;
  meetingSlotSelected: MSlot | MSlot[] | null;
  handleMeetingSlotClick: (meetingSlot: MSlot) => void;
} & HTMLAttributes<HTMLElement>;

const MeetingSlotDisplayComponent = <
  DateFieldKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
>({
  meetingSlot,
  dateFieldKey,
  loading = false,
  meetingSlotSelected,
  handleMeetingSlotClick,
  className,
  ...props
}: MeetingSlotDisplayProps<DateFieldKey, MSlot>) => {
  const time = useMemo(() => {
    const date = new Date(meetingSlot[dateFieldKey]);
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}`;
  }, [meetingSlot, dateFieldKey]);

  const isMeetingSelected = useMemo(() => {
    if (Array.isArray(meetingSlotSelected)) {
      const date: number = new Date(meetingSlot[dateFieldKey]).getTime();
      for (const slot of meetingSlotSelected) {
        const d = new Date(slot[dateFieldKey]);
        if (d.getTime() === date) {
          return true;
        }
      }
      return false;
    }
    if (meetingSlotSelected?.[dateFieldKey]) {
      const meetingSelectedDate = new Date(meetingSlotSelected[dateFieldKey]);
      const meetingDate = new Date(meetingSlot[dateFieldKey]);
      return meetingSelectedDate.getTime() === meetingDate.getTime();
    }
    return false;
  }, [meetingSlot, dateFieldKey, meetingSlotSelected]);

  const meetingClass = useMemo(() => {
    const css: string[] = [];
    if (isMeetingSelected) {
      css.push('meeting-selector__btn--selected');
    }
    if (loading) {
      css.push('meeting-selector__btn-loading');
    }
    return css.join(' ');
  }, [isMeetingSelected, loading]);

  return (
    <div className={`${className ?? ''}`} {...props}>
      {meetingSlot.date ? (
        <button
          type="button"
          className={`meeting-selector__btn ${meetingClass}`}
          disabled={!meetingSlot.date || loading}
          onClick={() => handleMeetingSlotClick(meetingSlot)}
        >
          {time}
        </button>
      ) : (
        <div className="meeting-selector__btn-empty">&mdash;</div>
      )}
    </div>
  );
};

export const MeetingSlotDisplay = memo(
  MeetingSlotDisplayComponent,
) as typeof MeetingSlotDisplayComponent;
