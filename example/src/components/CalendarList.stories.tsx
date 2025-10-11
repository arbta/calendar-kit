import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CalendarList,
  DayIndex,
  InnerDayProps,
  toLocaleDateString,
  useRenderCount,
} from "@fowusu/calendar-kit";
import { addDays } from "date-fns";

import { useMultiSelectCalendar } from "../hooks/useMultiSelectCalendar";

const today = new Date();

const todayDateString = toLocaleDateString(today);
const dateRangeStart = toLocaleDateString(addDays(today, 7));
const dateRangeEnd = toLocaleDateString(addDays(today, 14));
const CalendarListComponent = ({
  maxDaysInRange,
  showExtraDays,
  firstDayOfWeek,
  debugMode = false,
  futureMonthsCount,
  pastMonthsCount,
  showDayNames,
  showMonthName,
  showDayNamesOnTop,
  minDate,
  horizontal,
  locale,
}) => {
  const { markedDates, maxDate, onDayPress } = useMultiSelectCalendar(
    maxDaysInRange,
    dateRangeStart,
    dateRangeEnd,
  );

  /** extending day state with custom props
   * useful when you need to render additional
   *  state on day component
   */
  const createDayState = useCallback(({ markedDates, dateString }) => {
    if (markedDates.length === 0) {
      return {};
    }
    const indexOfDay = markedDates.indexOf(dateString);
    return {
      isStartDay: indexOfDay === 0,
      isEndDay: markedDates.length - 1 === indexOfDay,
    };
  }, []);

  const renderDayComponent = useCallback(
    (props) => <CustomDay {...props} debugMode={debugMode} />,
    [debugMode],
  );

  return (
    <CalendarList
      DayComponent={renderDayComponent}
      maxDate={maxDate}
      minDate={minDate}
      currentDate={todayDateString}
      showExtraDays={showExtraDays}
      markedDates={markedDates}
      futureMonthsCount={futureMonthsCount}
      pastMonthsCount={pastMonthsCount}
      showDayNames={showDayNames}
      showDayNamesOnTop={showDayNamesOnTop}
      onDayPress={onDayPress}
      firstDayOfWeek={firstDayOfWeek as DayIndex}
      customStateCreator={createDayState}
      calendarContentContainerStyle={{
        paddingHorizontal: 2,
      }}
      calendarListContentContainerStyle={{
        paddingVertical: 8,
      }}
      horizontal={horizontal}
      locale={locale}
      showMonthName={showMonthName}
    />
  );
};

const meta = {
  title: "Components/CalendarList/Multi Selection",
  component: CalendarListComponent,
  parameters: {
    controls: {
      exclude: ["debugMode", "large", "horizontal"],
    },
  },
  argTypes: {
    firstDayOfWeek: { control: "radio", options: [0, 1, 2, 3, 4, 5, 6] },
    currentDate: {
      control: "select",
      options: [todayDateString, "2024-01-01", "2044-12-20"],
    },
    minDate: {
      control: "select",
      options: [todayDateString, "2024-01-01", "2044-12-20"],
    },
  },
  args: {
    maxDaysInRange: 30,
    futureMonthsCount: 12,
    pastMonthsCount: 0,
    showExtraDays: true,
    debugMode: false,
    showDayNames: true,
    showDayNamesOnTop: false,
    showMonthName: true,
    currentDate: todayDateString,
    minDate: todayDateString,
    large: false,
    horizontal: false,
  },
};

export default meta;

export const Default = {};
export const Horizontal = {
  args: {
    horizontal: true,
    debugMode: true,
  },
};
export const DebugRenderCount = {
  args: {
    debugMode: true,
  },
};

export const LargeCalendar = {
  args: {
    debugMode: true,
    pastMonthsCount: 999,
    futureMonthsCount: 1000,
  },
  parameters: {
    controls: {
      exclude: ["debugMode", "large", "pastMonthsCount", "futureMonthsCount"],
    },
  },
};

const CustomDay: React.FC<InnerDayProps<any>> = (props) => {
  const { day, state, isStartDay, isEndDay, isToday, isSelected, debugMode } =
    props;
  const renderCount = useRenderCount(day.toString());
  const dayStyle = useMemo(() => {
    if (state !== "inactive") {
      if (isStartDay || isEndDay) {
        return {
          textStyle: textStyles.selected,
          containerStyle: isStartDay
            ? containerStyles.start
            : containerStyles.end,
        };
      }
      if (isSelected) {
        return {
          textStyle: textStyles.selected,
          containerStyle: containerStyles.selected,
        };
      }
    }
    if (isToday) {
      return {
        textStyle: textStyles.today,
      };
    }
    return {};
  }, [state, isStartDay, isEndDay, isSelected, isToday]);

  return (
    <View style={[containerStyles.defaultContainer, dayStyle.containerStyle]}>
      <Text
        style={[
          textStyles.defaultDayText,
          textStyles[state],
          dayStyle.textStyle,
        ]}
      >
        {day.getDate()}
      </Text>
      {debugMode ? (
        <Text style={textStyles.debugRenderText}>R={renderCount}x</Text>
      ) : null}
    </View>
  );
};

const containerStyles = StyleSheet.create({
  defaultContainer: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  selected: {
    backgroundColor: "#b1b5ff",
  },
  start: {
    backgroundColor: "#2b2e7d",
    borderRadius: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  end: {
    backgroundColor: "#2b2e7d",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});

const textStyles = StyleSheet.create({
  defaultDayText: {
    textAlign: "center",
    fontSize: 16,
  },
  selected: {
    color: "#fff",
    fontWeight: "normal",
  },
  active: {
    color: "#5a5a5a",
  },
  inactive: {
    color: "#cacaca",
  },
  today: {
    color: "#787de7",
    fontWeight: "bold",
  },
  debugRenderText: {
    textAlign: "center",
    fontSize: 10,
    color: "#868686",
  },
});
