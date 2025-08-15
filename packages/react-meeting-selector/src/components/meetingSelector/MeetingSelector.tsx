import { type HTMLAttributes, useEffect, useMemo, useState, useCallback } from 'react';
import 'common-meeting-selector/style';
import 'common-meeting-selector/icons';
import {
  defaultCalendarOptions,
  type CalendarOptions,
  type MeetingSlot,
  type MeetingsByDay,
} from 'common-meeting-selector';
import { ArrowIcon } from './ArrowIcon';
import { MeetingDisplay } from './MeetingDisplay';
import { DayDisplay } from './DayDisplay';
import { memo } from 'react';

type renderButtonProps = {
  loading: boolean;
  disabled: boolean;
};

type BaseProps<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
> = {
  meetingsByDays: MDay[];
  dateFieldKey: DateFieldKey;
  meetingSlotsKey: MeetingSlotsKey;
  date: Date;
  calendarOptions?: CalendarOptions;
  loading?: boolean;
  skip?: number;
  renderButtonPreviousDate?: (props: renderButtonProps) => React.ReactNode;
  renderButtonNextDate?: (props: renderButtonProps) => React.ReactNode;
  renderButtonUpMeetings?: (props: renderButtonProps) => React.ReactNode;
  renderButtonDownMeetings?: (props: renderButtonProps) => React.ReactNode;
  renderHeader?: (props: { meetings: MDay }) => React.ReactNode;
  renderMeeting?: (props: { meeting: MSlot; index: number }) => React.ReactNode;
  handlePreviousDate?: () => void;
  handleNextDate?: () => void;
  handleSkipChange?: (skip: number) => void;
} & HTMLAttributes<HTMLDivElement>;

export type MeetingSelectorProps<
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
> =
  | (BaseProps<DateFieldKey, MeetingSlotsKey, MSlot, MDay> & {
      multi?: false;
      value: MSlot | null;
      handleValueChange: (val: MSlot | null) => void;
    })
  | (BaseProps<DateFieldKey, MeetingSlotsKey, MSlot, MDay> & {
      multi: true;
      value: MSlot[];
      handleValueChange: (val: MSlot[]) => void;
    });

export const MeetingSelectorComponent = <
  DateFieldKey extends string,
  MeetingSlotsKey extends string,
  MSlot extends MeetingSlot<DateFieldKey>,
  MDay extends MeetingsByDay<DateFieldKey, MeetingSlotsKey, MSlot>,
>({
  meetingsByDays,
  dateFieldKey,
  meetingSlotsKey,
  date,
  calendarOptions = {},
  loading = false,
  skip,
  renderButtonPreviousDate,
  renderButtonNextDate,
  renderButtonUpMeetings,
  renderButtonDownMeetings,
  renderHeader,
  renderMeeting,
  handlePreviousDate,
  handleNextDate,
  handleSkipChange,
  className,
  ...props
}: MeetingSelectorProps<DateFieldKey, MeetingSlotsKey, MSlot, MDay>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleValueChange: _h, value: _v, multi: _m, ...htmlProps } = props;

  const options = useMemo(
    () => ({ ...defaultCalendarOptions, ...calendarOptions }),
    [calendarOptions],
  );

  const isControlled = typeof skip === 'number';
  const [internalSkip, setInternalSkip] = useState(isControlled ? skip : 0);

  const setSkip = (newSkip: number) => {
    if (isControlled) {
      handleSkipChange?.(newSkip);
    } else {
      setInternalSkip(newSkip);
    }
  };

  useEffect(() => {
    if (isControlled) {
      setInternalSkip(skip);
    }
  }, [skip, isControlled]);

  const maxNbMeetings = useMemo(() => {
    if (!meetingsByDays.length) {
      return 0;
    }
    return Math.max(
      ...meetingsByDays.map((meetingsByDay) => meetingsByDay[meetingSlotsKey].length),
    );
  }, [meetingsByDays, meetingSlotsKey]);

  const meetingsByDaysPaginated = useMemo(() => {
    const arrayIndex = Math.ceil(maxNbMeetings / options.limit) * options.limit;
    return meetingsByDays.map((meetingsByDay) => {
      const slots: MSlot[] = Array.from(
        { length: arrayIndex },
        () => ({ [dateFieldKey]: '' }) as MSlot,
      );
      slots.splice(
        0,
        meetingsByDay[meetingSlotsKey].length,
        ...(meetingsByDay[meetingSlotsKey] as MSlot[]),
      );
      const day = {
        ...meetingsByDay,
        slots: slots.slice(internalSkip, internalSkip + options.limit),
      };
      return day;
    });
  }, [maxNbMeetings, internalSkip, options.limit, dateFieldKey, meetingsByDays, meetingSlotsKey]);

  const handlePreviousMeetingsClick = () => {
    setSkip(internalSkip - options.spacing);
  };
  const handleNextMeetingsClick = () => {
    setSkip(internalSkip + options.spacing);
  };

  const handleMeetingClick = useCallback(
    (meeting: MSlot) => {
      const multi = props.multi === true;
      const value = props.value;
      const handle = props.handleValueChange;

      if (multi) {
        const v = value as MSlot[];
        const h = handle as (val: MSlot[]) => void;

        const timestamp = new Date(meeting[dateFieldKey]).getTime();
        const existingIndex = v.findIndex((s) => new Date(s[dateFieldKey]).getTime() === timestamp);
        const next = [...v];
        if (existingIndex !== -1) {
          next.splice(existingIndex, 1);
          h(next);
        } else {
          next.push(meeting);
          h(next);
        }
      } else {
        const v = value as MSlot | null;
        const h = handle as (val: MSlot | null) => void;

        if (v) {
          const selected = new Date(meeting[dateFieldKey]).getTime();
          const current = new Date(v[dateFieldKey]).getTime();
          if (selected === current) {
            h(null);
            return;
          }
        }
        h(meeting);
      }
    },
    [props.multi, props.value, props.handleValueChange, dateFieldKey],
  );

  return (
    <div className={`meeting-selector ${className ?? ''}`} {...htmlProps}>
      <div className="meeting-selector__tab">
        <div className="meeting-selector__pagination">
          {renderButtonPreviousDate?.({ loading, disabled: options.disabledDate(date) }) ?? (
            <button
              type="button"
              disabled={options.disabledDate(date) || loading}
              className={`meeting-selector__btn-icon ${loading ? 'meeting-selector__btn-icon--loading' : ''}`}
              onClick={handlePreviousDate}
            >
              <ArrowIcon direction="left" />
            </button>
          )}
        </div>
        <div className="meeting-selector__days">
          {meetingsByDaysPaginated.map((meetingsByDay) => (
            <div key={String(meetingsByDay[dateFieldKey])} className="meeting-selector__day">
              {renderHeader?.({ meetings: meetingsByDay }) ?? (
                <DayDisplay
                  className="meeting-selector__day-display"
                  meetingsByDay={meetingsByDay}
                  dateFieldKey={dateFieldKey}
                  meetingSlotsKey={meetingSlotsKey}
                  monthsLabel={options.monthsLabel}
                  daysLabel={options.daysLabel}
                />
              )}
              <MeetingDisplay
                meetingsByDay={meetingsByDay}
                dateFieldKey={dateFieldKey}
                meetingSlotsKey={meetingSlotsKey}
                loading={loading}
                handleMeetingSlotClick={handleMeetingClick}
                meetingSlotSelected={props.value}
                renderMeeting={
                  renderMeeting
                    ? ({ meeting, index }) => renderMeeting({ meeting, index })
                    : undefined
                }
              />
            </div>
          ))}
        </div>
        <div className="meeting-selector__pagination">
          {renderButtonNextDate?.({ loading, disabled: false }) ?? (
            <button
              type="button"
              disabled={loading}
              className={`meeting-selector__btn-icon ${loading ? 'meeting-selector__btn-icon--loading' : ''}`}
              onClick={handleNextDate}
            >
              <ArrowIcon direction="right" />
            </button>
          )}
          {renderButtonUpMeetings?.({ disabled: internalSkip === 0, loading }) ?? (
            <button
              type="button"
              disabled={internalSkip === 0 || loading}
              datatype="up"
              className={`meeting-selector__btn-icon ${loading ? 'meeting-selector__btn-icon--loading' : ''}`}
              onClick={handlePreviousMeetingsClick}
            >
              <ArrowIcon direction="up" />
            </button>
          )}
          {renderButtonDownMeetings?.({
            disabled: internalSkip + options.limit >= maxNbMeetings,
            loading,
          }) ?? (
            <button
              type="button"
              disabled={internalSkip + options.limit >= maxNbMeetings || loading}
              datatype="down"
              className={`meeting-selector__btn-icon ${loading ? 'meeting-selector__btn-icon--loading' : ''}`}
              onClick={handleNextMeetingsClick}
            >
              <ArrowIcon direction="down" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const MeetingSelector = memo(MeetingSelectorComponent) as typeof MeetingSelectorComponent;
