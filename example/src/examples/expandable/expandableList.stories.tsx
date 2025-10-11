import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { CalendarList } from "@fowusu/calendar-kit";

import { dateRangeStart, todayDateString } from "../../constants";
import { useMultiSelectCalendar } from "../../hooks/useMultiSelectCalendar";
import { formatMonthName } from "../../utils";
const ExpandableCalendarView = ({ locale, horizontal }) => {
  const { markedDates, onDayPress } = useMultiSelectCalendar(10);
  const [viewAs, setViewAs] = useState<"week" | "month">("month");
  const [activeMonth, setActiveMonth] = useState<string>(todayDateString);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#eaeaea",
        justifyContent: "flex-end",
      }}
    >
      <Animated.View
        style={{
          height: viewAs === "month" ? 420 : undefined,
          backgroundColor: "#fff",
        }}
        layout={LinearTransition}
      >
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#eaeaea",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            {formatMonthName(new Date(activeMonth), locale)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setViewAs((prevState) =>
                prevState === "week" ? "month" : "week",
              )
            }
          >
            <Feather
              style={{ padding: 10 }}
              name={viewAs === "month" ? "minimize-2" : "maximize-2"}
              size={16}
              color="#555555"
            />
          </TouchableOpacity>
        </View>
        <CalendarList
          locale={locale}
          MonthAnimatedTransitionComponent={MonthTransitionComponent}
          WeekAnimatedTransitionComponent={WeekTransitionComponent}
          viewAs={viewAs}
          horizontal={horizontal}
          firstDayOfWeek={1}
          minDate={todayDateString}
          currentDate={dateRangeStart}
          markedDates={markedDates}
          showDayNamesOnTop
          onDayPress={onDayPress}
          weekdaysFormat="narrow"
          showMonthName={false}
          onActiveMonthChange={setActiveMonth}
          calendarListContentContainerStyle={{ paddingBottom: 24 }}
        />
      </Animated.View>
    </View>
  );
};

const MonthTransitionComponent = ({ children }) => (
  <Animated.View style={{ flex: 1 }} entering={FadeInUp} exiting={FadeOut}>
    {children}
  </Animated.View>
);
const WeekTransitionComponent = ({ children }) => (
  <Animated.View entering={FadeInDown} exiting={FadeOut}>
    {children}
  </Animated.View>
);
const meta = {
  title: "Examples/Expandable/CalendarList",
  component: ExpandableCalendarView,
  args: {
    horizontal: false,
  },
};

export default meta;

export const Mobile = {};
