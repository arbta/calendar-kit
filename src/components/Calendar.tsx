import React, { useMemo } from "react";
import {
  DimensionValue,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import {
  dateStringToDate,
  formatMonthName,
  startOfMonth,
  startOfMonthForDateString,
} from "../utils/date";

import { FullCalendarView } from "./FullCalendarView";
import { ListWeeklyScrollContainer } from "./ListWeeklyScrollContainer";
import { FullCalendarViewProps } from "./types";
import { WeekDay, WeekDayProps } from "./WeekDay";

export interface CalendarProps
  extends Omit<FullCalendarViewProps, "month">,
    WeekDayProps {
  date: string;
  showDayNames?: boolean;
  viewAs?: "week" | "month";
  contentContainerStyle?: ViewStyle & {
    scrollSnapAlign?: "center" | "start";
    width?: DimensionValue | `${number}px`;
  };
}

export const Calendar: React.FC<CalendarProps> = React.memo(
  ({
    date,
    firstDayOfWeek = 0,
    weekdaysShort,
    MonthNameComponent,
    showDayNames = true,
    contentContainerStyle,
    WeekDayNameComponent,
    locale,
    showMonthName = true,
    weekdaysFormat,
    viewAs = "month",
    MonthAnimatedTransitionComponent = React.Fragment,
    WeekAnimatedTransitionComponent = React.Fragment,
    ...weekProps
  }) => {
    const monthDate = useMemo(
      () => startOfMonth(dateStringToDate(date)),
      [date],
    );

    const renderMonthName = () => {
      if (!showMonthName) return null;
      return MonthNameComponent ? (
        <MonthNameComponent month={monthDate} locale={locale} />
      ) : (
        <View style={styles.monthNameContainer}>
          <Text style={styles.monthNameText}>
            {formatMonthName(monthDate, locale)}
          </Text>
        </View>
      );
    };

    return (
      <View style={[styles.calenderContainer, contentContainerStyle]}>
        {renderMonthName()}
        {showDayNames ? (
          <WeekDay
            firstDayOfWeek={firstDayOfWeek}
            weekdaysShort={weekdaysShort}
            WeekDayNameComponent={WeekDayNameComponent}
            locale={locale}
            weekdaysFormat={weekdaysFormat}
          />
        ) : null}
        {viewAs === "week" ? (
          <WeekAnimatedTransitionComponent>
            <ListWeeklyScrollContainer
              {...weekProps}
              firstDayOfWeek={firstDayOfWeek}
              locale={locale}
              currentDate={weekProps.markedDates?.at(0) ?? date}
              months={[startOfMonthForDateString(date)]}
            />
          </WeekAnimatedTransitionComponent>
        ) : (
          <MonthAnimatedTransitionComponent>
            <FullCalendarView
              {...weekProps}
              firstDayOfWeek={firstDayOfWeek}
              locale={locale}
              date={date}
              month={monthDate}
            />
          </MonthAnimatedTransitionComponent>
        )}
      </View>
    );
  },
);

Calendar.displayName = "Calendar";

const styles = StyleSheet.create({
  calenderContainer: {
    width: "100%",
  },
  weeksContainer: {
    gap: 8,
  },
  monthNameContainer: {
    paddingBottom: 8,
    height: 30,
  },
  monthNameText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
