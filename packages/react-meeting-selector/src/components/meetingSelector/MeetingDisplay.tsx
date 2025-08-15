import { type HTMLAttributes, memo } from 'react';
import type { MeetingSlot, MeetingsByDay } from 'common-meeting-selector';
import { MeetingSlotDisplay } from './MeetingSlotDisplay';

type MeetingDisplayProps<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
> = {
  meetingsByDay: MDay;
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  loading?: boolean;
  handleMeetingSlotClick: (meetingSlot: MSlot) => void;
  meetingSlotSelected: MSlot | MSlot[] | null;
  renderMeeting?: (props: { meeting: MSlot; index: number }) => React.ReactNode;
} & HTMLAttributes<HTMLElement>;

const MeetingDisplayComponent = <
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
>({
  meetingsByDay,
  dateFieldKey,
  meetingSlotsKey,
  loading = false,
  handleMeetingSlotClick,
  meetingSlotSelected,
  renderMeeting,
  className,
  ...props
}: MeetingDisplayProps<DateFieldKey, MeetingSlotsKey, MSlot, MDay>) => {
  return (
    <div className={`meeting-selector__meetings ${className ?? ''}`} {...props}>
      {meetingsByDay[meetingSlotsKey].map((slot, index) =>
        renderMeeting ? (
          renderMeeting({ meeting: slot, index })
        ) : (
          <MeetingSlotDisplay
            key={index}
            meetingSlot={slot}
            loading={loading}
            meetingSlotSelected={meetingSlotSelected}
            dateFieldKey={dateFieldKey}
            handleMeetingSlotClick={() => handleMeetingSlotClick(slot)}
          />
        ),
      )}
    </div>
  );
};

export const MeetingDisplay = memo(MeetingDisplayComponent) as typeof MeetingDisplayComponent;
