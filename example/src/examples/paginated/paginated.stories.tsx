import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { CalendarList, toLocaleDateString } from "@fowusu/calendar-kit";
import { addDays } from "date-fns";

import { todayDateString } from "../../constants";
import { useMultiSelectCalendar } from "../../hooks/useMultiSelectCalendar";
const [rangeStart, rangeEnd] = [
  toLocaleDateString(addDays(todayDateString, 3)),
  toLocaleDateString(addDays(todayDateString, 7)),
];

const weekStartsOn = 1;
const MAX_FUTURE_MONTHS_COUNT = 20;
const PAGINATE_INCREMENT = 4;
const PaginatedCalendarListComponent = ({ locale }) => {
  const [futureMonths, setFutureMonths] = useState(5);
  const [loading, setLoading] = useState(false);
  const { markedDates, onDayPress, maxDate } = useMultiSelectCalendar(
    30,
    rangeStart,
    rangeEnd,
  );

  const onListEndReached = useCallback(() => {
    if (futureMonths < MAX_FUTURE_MONTHS_COUNT) {
      setLoading(true);
      const diff = MAX_FUTURE_MONTHS_COUNT - futureMonths;
      const increment = diff < PAGINATE_INCREMENT ? diff : PAGINATE_INCREMENT;
      setTimeout(() => {
        setFutureMonths((prevState) => prevState + increment);
        setLoading(false);
      }, 800);
    }
  }, [futureMonths]);

  return (
    <>
      <CalendarList
        minDate={todayDateString}
        maxDate={maxDate}
        showExtraDays={false}
        markedDates={markedDates}
        futureMonthsCount={futureMonths}
        showDayNamesOnTop
        onDayPress={onDayPress}
        firstDayOfWeek={weekStartsOn}
        locale={locale}
        onListEndReached={onListEndReached}
        weeksContainerStyle={{
          gap: 8,
        }}
        calendarContentContainerStyle={{
          paddingHorizontal: 8,
        }}
        calendarListContentContainerStyle={{
          paddingVertical: 16,
        }}
        showScrollIndicator={false}
      />
      {loading && (
        <ActivityIndicator size="large" style={{ marginHorizontal: "auto" }} />
      )}
    </>
  );
};

const meta = {
  title: "Examples/Paginated",
  component: PaginatedCalendarListComponent,
};

export default meta;

export const Mobile = {};
