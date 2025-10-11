import React, { useCallback } from "react";
import { CalendarList, StateInputParams } from "@fowusu/calendar-kit";

import { dateRangeStart, todayDateString } from "../../constants";
import { useMultiSelectCalendar } from "../../hooks/useMultiSelectCalendar";
import { isWeekend } from "../../utils";

import { Day } from "./Day";

const weekStartsOn = 1;
const VioCalendarListComponent = ({ locale }) => {
  const { markedDates, onDayPress, maxDate } = useMultiSelectCalendar(30);

  /** extending day state with custom props
   * useful when you need to render additional
   *  state on day component
   */
  const createDayState = useCallback(
    ({ markedDates, dateString }: StateInputParams) => {
      const markedDatesCount = markedDates.length;
      if (markedDatesCount === 0) {
        return {};
      }
      const dayIsWeekend = isWeekend(dateString);

      return {
        isStartDay: markedDates[0] === dateString,
        isEndDay:
          markedDatesCount > 1 &&
          markedDates[markedDatesCount - 1] === dateString,
        isWeekEnd: dayIsWeekend,
        isMultiSelect: markedDates.length > 1,
      };
    },
    [],
  );

  const renderDayComponent = useCallback((props) => <Day {...props} />, []);

  return (
    <CalendarList
      DayComponent={renderDayComponent}
      minDate={todayDateString}
      maxDate={maxDate}
      currentDate={dateRangeStart}
      showExtraDays={false}
      markedDates={markedDates}
      futureMonthsCount={13}
      showDayNamesOnTop
      onDayPress={onDayPress}
      firstDayOfWeek={weekStartsOn}
      locale={locale}
      weeksContainerStyle={{
        gap: 8,
      }}
      customStateCreator={createDayState}
      calendarListContentContainerStyle={{
        paddingVertical: 16,
      }}
      showScrollIndicator={false}
    />
  );
};

const meta = {
  title: "Examples/Vio.com",
  component: VioCalendarListComponent,
};

export default meta;

export const Mobile = {};
