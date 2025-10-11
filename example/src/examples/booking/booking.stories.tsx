import React, { useCallback } from "react";
import { CalendarList, StateInputParams } from "@fowusu/calendar-kit";

import { dateRangeStart, todayDateString } from "../../constants";
import { useMultiSelectCalendar } from "../../hooks/useMultiSelectCalendar";

import { Day } from "./Day";
import { MonthName } from "./MonthName";
import { WeekDayName } from "./WeekDayName";

const weekStartsOn = 1;

const BookingCalendarListComponent = ({ locale }) => {
  const { markedDates, onDayPress } = useMultiSelectCalendar();

  /** extending day state with custom props
   * useful when you need to render additional
   *  state on day component
   */
  const createDayState = useCallback(
    ({ markedDates, dateString }: StateInputParams) => {
      if (markedDates.length === 0) {
        return {};
      }
      const indexOfDay = markedDates.indexOf(dateString);
      return {
        isStartDay: indexOfDay === 0,
        isEndDay: markedDates.length - 1 === indexOfDay && indexOfDay !== 0,
        isMultiSelect: markedDates.length > 1,
      };
    },
    [],
  );

  const renderDayComponent = useCallback((props) => <Day {...props} />, []);

  return (
    <CalendarList
      MonthNameComponent={MonthName}
      WeekDayNameComponent={WeekDayName}
      DayComponent={renderDayComponent}
      minDate={todayDateString}
      currentDate={dateRangeStart}
      showExtraDays={false}
      markedDates={markedDates}
      futureMonthsCount={15}
      showDayNamesOnTop
      onDayPress={onDayPress}
      firstDayOfWeek={weekStartsOn}
      locale={locale}
      weeksContainerStyle={{
        gap: 8,
      }}
      calendarVerticalGap={16}
      customStateCreator={createDayState}
      calendarContentContainerStyle={{
        paddingHorizontal: 32,
      }}
      calendarListContentContainerStyle={{
        paddingVertical: 12,
      }}
      showScrollIndicator={false}
    />
  );
};

const meta = {
  title: "Examples/Booking.com",
  component: BookingCalendarListComponent,
};

export default meta;

export const Mobile = {};
