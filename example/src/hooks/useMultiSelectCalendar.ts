import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDatesInRange, toLocaleDateString } from "@fowusu/calendar-kit";
import { addDays } from "date-fns";

import { dateRangeEnd, dateRangeStart, isSameOrBeforeDate } from "../constants";

export const useMultiSelectCalendar = (
  maxDaysInRange = 0,
  rangeStart = dateRangeStart,
  rangeEnd = dateRangeEnd,
) => {
  const [selectedDay, setSelectedDay] = useState<string>();
  const choiceTurnRef = useRef<"start" | "end">("start");
  const [dateRange, setDateRange] = useState({
    start: rangeStart,
    end: rangeEnd,
  });
  const markedDates = useMemo(() => {
    const { start, end } = dateRange;
    if (start && end) {
      return getDatesInRange(start, end);
    }
    if (start && !end) {
      return [start];
    }
    return [];
  }, [dateRange]);

  const onDayPress = useCallback((dateString) => {
    setSelectedDay(dateString);
  }, []);

  const maxDate = useMemo(() => {
    if (choiceTurnRef.current === "start") return undefined;
    return toLocaleDateString(addDays(dateRange.start, maxDaysInRange));
  }, [dateRange.start, maxDaysInRange, choiceTurnRef.current]);

  //effect for creating date range for multi select dates
  useEffect(() => {
    if (selectedDay) {
      const sameOrBeforeCheckInDate = isSameOrBeforeDate(
        selectedDay,
        dateRange.start,
      );
      if (choiceTurnRef.current === "start" || sameOrBeforeCheckInDate) {
        setDateRange({ start: selectedDay, end: undefined });
        choiceTurnRef.current = "end";
      } else {
        setDateRange((prevState) => ({ ...prevState, end: selectedDay }));
        choiceTurnRef.current = "start";
        setSelectedDay(undefined);
      }
    }
  }, [selectedDay, dateRange.start]);

  return {
    onDayPress,
    markedDates,
    maxDate,
    selectedDay,
  };
};
