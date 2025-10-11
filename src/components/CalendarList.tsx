import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";

import { CalendarListRef } from "../types";
import { createRange, dateStringToDate, formatMonthName } from "../utils/date";

import { FullCalendarListView } from "./FullCalendarListView";
import { ListWeeklyScrollContainer } from "./ListWeeklyScrollContainer";
import {
  CalendarListProps,
  CalendarListViewProps,
  FullCalendarListViewProps,
} from "./types";
import { WeekDay } from "./WeekDay";

export const CalendarList = React.memo(
  forwardRef(
    (
      {
        currentDate,
        minDate,
        pastMonthsCount,
        futureMonthsCount,
        viewAs = "month",
        showMonthName = true,
        showDayNames = true,
        MonthNameComponent,
        onScroll,
        markedDates,
        WeekAnimatedTransitionComponent = React.Fragment,
        MonthAnimatedTransitionComponent = React.Fragment,
        onActiveMonthChange,
        ...calendarProps
      }: CalendarListProps &
        FullCalendarListViewProps &
        CalendarListViewProps & {
          viewAs?: "week" | "month";
          onActiveMonthChange?: (activeMonth: string) => void;
        },
      ref: ForwardedRef<CalendarListRef>,
    ) => {
      const listRef = useRef<any>();
      const isWeeklyView = viewAs === "week";

      const months = useMemo(() => {
        return createRange({
          startMonth: minDate,
          pastMonthsCount,
          futureMonthsCount,
        });
      }, [minDate, pastMonthsCount, futureMonthsCount]);

      const [activeDate, setActiveDate] = useState<string | undefined>(
        currentDate,
      );

      const renderMonthName = () => {
        if (showMonthName && activeDate && isWeeklyView) {
          const month = dateStringToDate(activeDate);
          return MonthNameComponent ? (
            <MonthNameComponent month={month} locale={calendarProps.locale} />
          ) : (
            <View style={styles.monthNameContainer}>
              <Text style={styles.monthNameText}>
                {formatMonthName(month, calendarProps.locale)}
              </Text>
            </View>
          );
        }
        return null;
      };

      const renderDayNames = () =>
        (showDayNames && calendarProps.showDayNamesOnTop) || isWeeklyView ? (
          <WeekDay
            firstDayOfWeek={calendarProps.firstDayOfWeek}
            weekdaysShort={calendarProps.weekdaysShort}
            WeekDayNameComponent={calendarProps.WeekDayNameComponent}
            locale={calendarProps.locale}
            weekdaysFormat={calendarProps.weekdaysFormat}
          />
        ) : null;

      const handleOnScroll = useCallback(
        (visibleDates: any) => {
          onScroll?.(visibleDates);
          let month: string | undefined;
          if (isWeeklyView) {
            const { week } = visibleDates[0];
            month = week[week.length - 1];
          } else {
            month = visibleDates[0];
          }
          if (month) {
            setActiveDate(month);
          }
        },
        [onScroll, isWeeklyView],
      );

      useEffect(() => {
        if (markedDates) {
          setActiveDate(markedDates.at(0));
        }
      }, [markedDates]);

      useEffect(() => {
        if (activeDate && onActiveMonthChange) {
          onActiveMonthChange(activeDate);
        }
      }, [activeDate, onActiveMonthChange]);

      useImperativeHandle(ref, () => ({
        scrollToDate(dateString: string, animated: boolean = true) {
          listRef.current?.scrollToItem({
            animated,
            item: dateString,
          });
        },
      }));

      return (
        <>
          {renderMonthName()}
          {renderDayNames()}
          {isWeeklyView ? (
            <WeekAnimatedTransitionComponent>
              <ListWeeklyScrollContainer
                {...calendarProps}
                showDayNames={showDayNames}
                markedDates={markedDates}
                ref={listRef}
                showExtraDays
                months={months}
                minDate={minDate}
                currentDate={activeDate}
                onScroll={handleOnScroll}
              />
            </WeekAnimatedTransitionComponent>
          ) : (
            <MonthAnimatedTransitionComponent>
              <FullCalendarListView
                {...calendarProps}
                showDayNames={showDayNames}
                markedDates={markedDates}
                showMonthName={showMonthName}
                MonthNameComponent={MonthNameComponent}
                ref={listRef}
                months={months}
                minDate={minDate}
                currentDate={activeDate}
                onScroll={handleOnScroll}
              />
            </MonthAnimatedTransitionComponent>
          )}
        </>
      );
    },
  ),
);

CalendarList.displayName = "CalendarList";

const styles = StyleSheet.create({
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
