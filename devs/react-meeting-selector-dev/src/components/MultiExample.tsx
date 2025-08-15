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

export const MultiExample = () => {
  const nbDaysToDisplay = 5;

  const [date, setDate] = React.useState(new Date());
  const initialDateRef = React.useRef(date);
  const [skip, setSkip] = React.useState(0);
  const [value, setValue] = React.useState<MeetingSlotGenerated[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [meetingsDays, setMeetingsDays] = React.useState<MeetingsByDayGenerated[]>(
    generatePlaceHolder(date, nbDaysToDisplay)
  );

  const handleChange = React.useCallback((val: MeetingSlotGenerated[]) => {
    setValue(val);
  }, []);

  const generateMeetingsByDaysAsync = React.useCallback(
    (
      d: Date,
      n: number,
      start: Time,
      end: Time,
      timesBetween: number
    ): Promise<ReturnType<typeof generateMeetingsByDays>> =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMeetingsByDays(d, n, start, end, timesBetween));
        }, 1000);
      }),
    []
  );

  const nextDate = React.useCallback(async () => {
    setLoading(true);
    const start: Time = {
      hours: 8,
      minutes: 0,
    };
    const end: Time = {
      hours: 16,
      minutes: 0,
    };
    const dateCopy = new Date(date);
    const newDate = new Date(dateCopy.setDate(dateCopy.getDate() + 7));
    setDate(newDate);
    setMeetingsDays(await generateMeetingsByDaysAsync(newDate, nbDaysToDisplay, start, end, 30));
    setLoading(false);
  }, [date, generateMeetingsByDaysAsync]);

  const previousDate = React.useCallback(async () => {
    setLoading(true);
    const start: Time = {
      hours: 8,
      minutes: 0,
    };
    const end: Time = {
      hours: 16,
      minutes: 0,
    };
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() - 7);
    const formattingDate = (dateToFormat: Date) => {
      const d = new Date(dateToFormat);
      const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };
    const newDate =
      formattingDate(new Date()) >= formattingDate(dateCopy) ? new Date() : new Date(dateCopy);
    setDate(newDate);
    setMeetingsDays(await generateMeetingsByDaysAsync(newDate, nbDaysToDisplay, start, end, 30));
    setLoading(false);
  }, [date, generateMeetingsByDaysAsync]);

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      const start: Time = {
        hours: 8,
        minutes: 0,
      };
      const end: Time = {
        hours: 16,
        minutes: 0,
      };
      setMeetingsDays(
        await generateMeetingsByDaysAsync(initialDateRef.current, nbDaysToDisplay, start, end, 30)
      );
      setLoading(false);
    })();
  }, [generateMeetingsByDaysAsync]);

  return (
    <>
      <MeetingSelector<'date', 'slots', MeetingSlotGenerated, MeetingsByDayGenerated>
        value={value}
        date={date}
        skip={skip}
        multi={true}
        loading={loading}
        handleValueChange={handleChange}
        meetingsByDays={meetingsDays}
        dateFieldKey="date"
        meetingSlotsKey="slots"
        handleNextDate={nextDate}
        handlePreviousDate={previousDate}
        handleSkipChange={setSkip}
      />
      meetingSlot: {JSON.stringify(value) ?? ''}
    </>
  );
};
