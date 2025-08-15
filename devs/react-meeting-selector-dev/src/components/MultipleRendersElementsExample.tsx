import React from 'react';
import {
  MeetingSelector,
  generateMeetingsByDays,
  generatePlaceHolder,
  type MeetingsByDayGenerated,
  type MeetingSlotGenerated,
  type Time,
} from 'react-meeting-selector';
import 'react-meeting-selector/style.css';

export const MultipleRendersElementsExample = () => {
  const nbDaysToDisplay = 5;

  const [date, setDate] = React.useState(new Date());
  const initialDateRef = React.useRef(date);
  const [skip, setSkip] = React.useState(0);
  const [value, setValue] = React.useState<MeetingSlotGenerated | null>(null);
  const [meetingsDays, setMeetingsDays] = React.useState<MeetingsByDayGenerated[]>(
    generatePlaceHolder(date, nbDaysToDisplay)
  );
  const [loading, setLoading] = React.useState(true);

  const generateMeetingsByDaysAsync = React.useCallback(
    (d: Date, n: number, start: Time, end: Time, timesBetween: number) =>
      new Promise<MeetingsByDayGenerated[]>((resolve) => {
        setTimeout(() => {
          resolve(generateMeetingsByDays(d, n, start, end, timesBetween));
        }, 1000);
      }),
    []
  );

  const updateDays = React.useCallback(
    async (base: Date) => {
      setLoading(true);
      const start = { hours: 8, minutes: 0 };
      const end = { hours: 16, minutes: 0 };
      const generated = await generateMeetingsByDaysAsync(base, nbDaysToDisplay, start, end, 30);
      setMeetingsDays(generated);
      setLoading(false);
    },
    [generateMeetingsByDaysAsync]
  );

  const nextDate = React.useCallback(() => {
    const next = new Date(date);
    next.setDate(next.getDate() + 7);
    setDate(next);
    updateDays(next);
  }, [date, updateDays]);

  const previousDate = React.useCallback(() => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 7);

    const now = new Date();
    const effective = prev < now ? now : prev;

    setDate(effective);
    updateDays(effective);
  }, [date, updateDays]);

  const handleChange = React.useCallback((val: MeetingSlotGenerated | null) => {
    setValue(val);
  }, []);

  React.useEffect(() => {
    updateDays(initialDateRef.current);
  }, [updateDays]);

  const formattingDate = (d: Date | string) => {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}-${day}`;
  };

  const formattingTime = (d: Date | string) => {
    const date = new Date(d);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isPreviousDisabled = (() => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    const now = new Date();
    return formattingDate(prev) < formattingDate(now);
  })();

  return (
    <>
      <style>
        {`
.button-pagination {
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.meeting {
  display: inline-block;
  padding: 5px;
  margin: 5px 0;
  background-color: #845ec2;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.meeting--selected {
  background-color: #b39cd0;
}

.meeting--empty {
  display: inline-block;
  padding: 5px;
  margin: 5px 0;
  cursor: not-allowed;
}
`}
      </style>
      <MeetingSelector<'date', 'slots', MeetingSlotGenerated, MeetingsByDayGenerated>
        value={value}
        date={date}
        skip={skip}
        loading={loading}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        handleValueChange={handleChange}
        meetingsByDays={meetingsDays}
        handleNextDate={nextDate}
        handlePreviousDate={previousDate}
        handleSkipChange={setSkip}
        renderButtonPreviousDate={({ loading }) => (
          <button
            type="button"
            disabled={loading || isPreviousDisabled}
            onClick={previousDate}
            className="button-pagination"
          >
            {'<'}
          </button>
        )}
        renderButtonNextDate={({ loading }) => (
          <button type="button" disabled={loading} onClick={nextDate} className="button-pagination">
            {'>'}
          </button>
        )}
        renderButtonUpMeetings={({ loading, disabled }) => (
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              setSkip((s) => Math.max(0, s - 3));
            }}
            className="button-pagination"
          >
            {'^'}
          </button>
        )}
        renderButtonDownMeetings={({ loading, disabled }) => (
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              setSkip((s) => s + 3);
            }}
            className="button-pagination"
          >
            {'⌄'}
          </button>
        )}
        renderHeader={({ meetings }) => (
          <div className="title">{formattingDate(meetings.date)}</div>
        )}
        renderMeeting={({ meeting, index }) =>
          meeting.date ? (
            <button
              key={index}
              type="button"
              className={`meeting ${
                value?.date && new Date(meeting.date).getTime() === new Date(value.date).getTime()
                  ? 'meeting--selected'
                  : ''
              }`}
              onClick={() => handleChange(meeting)}
            >
              {formattingTime(meeting.date)}
            </button>
          ) : (
            <div key={index} className="meeting--empty">
              &mdash;
            </div>
          )
        }
      />
      <div>Meeting selected: {JSON.stringify(value)}</div>
    </>
  );
};
