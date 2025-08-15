import React from 'react';
import {
  MeetingSelector,
  generateMeetingsByDays,
  type MeetingsByDayGenerated,
  type MeetingSlotGenerated,
  type Time,
} from 'react-meeting-selector';
import 'react-meeting-selector/style.css';

export const SimpleExample = () => {
  const [date, setDate] = React.useState(new Date());
  const initialDateRef = React.useRef(date);
  const [skip, setSkip] = React.useState(0);
  const [value, setValue] = React.useState<MeetingSlotGenerated | null>(null);

  const [meetingsDays, setMeetingsDays] = React.useState<MeetingsByDayGenerated[]>([]);

  const nbDaysToDisplay = 5;

  const handleChange = React.useCallback((val: MeetingSlotGenerated | null) => {
    setValue(val);
  }, []);

  const nextDate = React.useCallback(async () => {
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
    setMeetingsDays(generateMeetingsByDays(newDate, nbDaysToDisplay, start, end, 30));
  }, [date]);

  const previousDate = React.useCallback(async () => {
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
    setMeetingsDays(generateMeetingsByDays(newDate, nbDaysToDisplay, start, end, 30));
  }, [date]);

  React.useEffect(() => {
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
        generateMeetingsByDays(initialDateRef.current, nbDaysToDisplay, start, end, 30)
      );
    })();
  }, []);

  return (
    <>
      <MeetingSelector
        value={value}
        date={date}
        skip={skip}
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
