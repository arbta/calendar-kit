import React, { useCallback, useMemo, useRef, useState } from "react";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  CalendarList,
  CalendarListRef,
  dateStringToDate,
  DayState,
  StateInputParams,
  toLocaleDateString,
} from "@fowusu/calendar-kit";
import { addDays, addMonths, subMonths } from "date-fns";

import { dateRangeStart, today, todayDateString } from "../../constants";
import { useMultiSelectCalendar } from "../../hooks/useMultiSelectCalendar";
import { formatMonthName } from "../../utils";

import { Day } from "./Day";

const maxSelectableDate = addDays(today, 330);

const weekStartsOn = 1;

const isRTLMode = I18nManager.isRTL;
const rtlStyle = isRTLMode ? { transform: [{ rotate: "180deg" }] } : undefined;

const PricelineCalendarListComponent = ({ locale }) => {
  const { markedDates, onDayPress, maxDate } = useMultiSelectCalendar(28);
  const [currentMonth, setCurrentMonth] = useState(dateRangeStart);
  const calendarListRef = useRef<CalendarListRef>();
  /** extending day state with custom props
   * useful when you need to render additional
   *  state on day component
   */
  const createDayState = useCallback(
    ({ markedDates, dateString }: StateInputParams, { state }: DayState) => {
      if (markedDates.length === 0) {
        return {};
      }
      const indexOfDay = markedDates.indexOf(dateString);
      const isAfterMaxSelectableDate =
        dateStringToDate(dateString) > maxSelectableDate;

      return {
        isStartDay: indexOfDay === 0,
        isEndDay: markedDates.length - 1 === indexOfDay && indexOfDay !== 0,
        isMultiSelect: markedDates.length > 1,
        state: isAfterMaxSelectableDate ? "inactive" : state,
      };
    },
    [],
  );

  const renderDayComponent = useCallback((props) => <Day {...props} />, []);

  const monthString = useMemo(
    () => formatMonthName(dateStringToDate(currentMonth), locale),
    [currentMonth, locale],
  );

  const goToNextMonth = () => {
    const nextMonth = addMonths(dateStringToDate(currentMonth), 1);
    scrollToMonth(nextMonth);
  };

  const scrollToMonth = useCallback((month: Date) => {
    calendarListRef.current?.scrollToDate(toLocaleDateString(month));
  }, []);

  const goToPreviousMonth = () => {
    if (currentMonth === todayDateString) {
      return;
    }
    const previousMonth = subMonths(dateStringToDate(currentMonth), 1);
    scrollToMonth(previousMonth);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 24,
          paddingVertical: 16,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Feather
            style={rtlStyle}
            name="arrow-left"
            size={16}
            color="#555555"
          />
        </TouchableOpacity>
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: 14,
            color: "#555555",
            fontWeight: "500",
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          {monthString}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Feather
            style={rtlStyle}
            name="arrow-right"
            size={16}
            color="#555555"
          />
        </TouchableOpacity>
      </View>
      <CalendarList
        ref={calendarListRef}
        horizontal
        DayComponent={renderDayComponent}
        minDate={todayDateString}
        maxDate={maxDate}
        currentDate={dateRangeStart}
        weekdaysFormat="narrow"
        locale={locale}
        showExtraDays={false}
        markedDates={markedDates}
        futureMonthsCount={11}
        onDayPress={onDayPress}
        showDayNamesOnTop
        firstDayOfWeek={weekStartsOn}
        weeksContainerStyle={{
          gap: 4,
        }}
        showMonthName={false}
        customStateCreator={createDayState}
        calendarContentContainerStyle={{
          paddingHorizontal: 2,
        }}
        showScrollIndicator={false}
        onActiveMonthChange={setCurrentMonth}
      />
    </>
  );
};

const meta = {
  title: "Examples/Priceline",
  component: PricelineCalendarListComponent,
};

export default meta;

export const Mobile = {};
