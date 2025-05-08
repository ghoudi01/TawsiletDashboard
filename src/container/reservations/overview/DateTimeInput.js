import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  /* background-color: red; */
  align-items: center;
  gap: 15px;
  border-radius: 16px;
  font-size: 16px;
  flex-wrap: wrap;

  .react-datepicker-wrapper {
    flex: 1;
    border-radius: 16px;
    @media (max-width: 1050px) {
      min-width: 100%;
      flex: 1;
      border-radius: 8px;
    }
  }
  .DateInput {
    border-radius: 10px !important;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    background-color: rgba(245, 245, 245, 1);
    height: 46px;
    width: 100%;
    font-size: 16px;
    @media (max-width: 1050px) {
      width: 100%;
      flex: 1;
      border-radius: 8px !important;
    }
  }
  .react-datepicker__input-container {
    border-radius: 16px;
    font-size: 16px;
    @media (max-width: 1050px) {
      width: 100%;
      flex: 1;
      border-radius: 8px;
    }
  }
`;

const TimeSelect = styled.select`
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 10px;
  height: 46px;
  width: 100px;
  @media (max-width: 1050px) {
    flex: 1;
    border-radius: 8px;
  }
`;

const DateTimeInput = ({
  setCommand,
  command,

  checkedHour,
  defaultDate,
  defaultTime,
}) => {
  const initialSelectedDate = new Date();
  const [hhh, mmm] = defaultTime?.split(":") || [null, null];

  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  const savedCommand = localStorage.getItem("command");
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  // savedCommand?.data?.departDate || null
  const [selectedHour, setSelectedHour] = useState(hhh || null);
  const [selectedMinute, setSelectedMinute] = useState(mmm || null);

  //   useEffect(() => {
  //     checkedHour
  //       ? (setSelectedHour(oneHourFromNow.getHours().toString().padStart(2, "0")),
  //         setSelectedMinute(
  //           oneHourFromNow.getMinutes().toString().padStart(2, "0")
  //         ),
  //         setSelectedDate(oneHourFromNow))
  //       : null;
  //   }, [checkedHour]);

  // useEffect(() => {
  //   setSelectedHour(oneHourFromNow.getHours().toString().padStart(2, "0"));
  //   setSelectedMinute(oneHourFromNow.getMinutes().toString().padStart(2, "0"));
  // }, []);

  useEffect(() => {
    setSelectedDate((prevDate) => {
      if (isToday(prevDate)) {
        const newDate = new Date(prevDate);
        newDate.setHours(selectedHour);
        newDate.setMinutes(selectedMinute);
        return newDate;
      }
      return prevDate;
    });
  }, [selectedHour, selectedMinute]);

  useEffect(() => {
    if (selectedDate && selectedHour && selectedMinute)
      setCommand({
        ...command,
        data: {
          ...command.data,
          departDate: selectedDate.toISOString().split("T")[0],
          deparTime: `${selectedHour}:${selectedMinute}:00.000`,
        },
      });
  }, [selectedDate, selectedHour, selectedMinute]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    setCommand({ ...command, data: { ...command.data, departDate: date } });
  };

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setSelectedMinute(e.target.value);
  };

  const isToday = (date) => {
    const today = new Date();
    return date
      ? date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      : false;
  };

  // Disable options that are less than one hour from now
  const disableOptions = (
    hour = oneHourFromNow.getHours().toString().padStart(2, "0"),
    minute = oneHourFromNow.getMinutes().toString().padStart(2, "0")
  ) => {
    if (!isToday(selectedDate)) return false;
    const selectedTime = new Date(selectedDate);
    selectedTime.setHours(parseInt(hour, 10));
    selectedTime.setMinutes(parseInt(minute, 10));
    // console.log(selectedTime);
    return selectedTime < oneHourFromNow;
  };

  return (
    <InputWrapper dir="auto">
      {}
      <DatePicker
        className="DateInput"
        value={selectedDate}
        // locale="fr"
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
      <TimeSelect
        value={selectedHour}
        onChange={handleHourChange}
        disabled={!selectedDate}
      >
        <option value="">Heure</option>
        {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
          return !disableOptions(
            (parseInt(hour) + 1).toString().padStart(2, "0"),
            selectedMinute || "59"
          ) ? (
            <option
              key={hour}
              value={hour.toString().padStart(2, "0")}
              disabled={disableOptions(
                (parseInt(hour) + 1).toString().padStart(2, "0"),
                selectedMinute || "59"
              )}
            >
              {hour.toString().padStart(2, "0")}
            </option>
          ) : null;
        })}
      </TimeSelect>

      <TimeSelect
        value={selectedMinute}
        onChange={handleMinuteChange}
        disabled={!selectedHour}
      >
        <option value="">minutes</option>
        {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
          return !disableOptions(
            selectedHour ||
              oneHourFromNow.getHours().toString().padStart(2, "0"),
            (parseInt(minute) + 1).toString().padStart(2, "0")
          ) ? (
            <option
              key={minute}
              value={minute.toString().padStart(2, "0")}
              disabled={disableOptions(
                selectedHour ||
                  oneHourFromNow.getHours().toString().padStart(2, "0"),
                (parseInt(minute) + 1).toString().padStart(2, "0")
              )}
            >
              {minute.toString().padStart(2, "0")}
            </option>
          ) : null;
        })}
      </TimeSelect>
    </InputWrapper>
  );
};

export default DateTimeInput;
