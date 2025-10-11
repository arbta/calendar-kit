import React, { useMemo } from "react";
import { DimensionValue, StyleSheet, View, ViewStyle } from "react-native";

import { DayState, StateInputParams } from "../types";
import { getDayState } from "../utils/getDayState";

import { Day, DayProps } from "./Day";

export interface WeekProps
  extends Omit<DayProps, "dateString" | "onPress" | "viewState"> {
  weekDays: string[];
  onDayPress?: DayProps["onPress"];
  minDate?: string;
  maxDate?: string;
  markedDates?: string[];
  showExtraDays?: boolean;
  month: Date;
  isLastWeekOfList?: boolean;
  customStateCreator?: (
    stateInputParams: StateInputParams,
    defaultState: DayState,
  ) => Record<string, unknown>;
  weekContainerStyle?: ViewStyle & {
    scrollSnapAlign?: "center" | "start";
    width?: DimensionValue | `${number}px`;
  };
}

export const Week: React.FC<WeekProps> = React.memo(
  ({
    weekDays,
    month,
    locale,
    DayComponent,
    onDayPress,
    showExtraDays = true,
    minDate,
    maxDate,
    customStateCreator,
    markedDates = [],
    weekContainerStyle,
    isLastWeekOfList,
  }) => {
    const daysState = useMemo(
      () =>
        weekDays.map((dateString) => {
          const params = {
            month,
            markedDates,
            dateString,
            showExtraDays,
            minDate,
            maxDate,
            isLastWeekOfList,
          };
          const defaultState = getDayState(params);
          const customState = customStateCreator?.(params, defaultState);
          return { ...defaultState, ...customState };
        }),
      [
        weekDays,
        month,
        markedDates,
        showExtraDays,
        minDate,
        maxDate,
        customStateCreator,
        isLastWeekOfList,
      ],
    );

    const days = useMemo(
      () =>
        weekDays.map((day, index) => (
          <Day
            viewState={daysState[index]}
            onPress={onDayPress}
            DayComponent={DayComponent}
            key={day}
            dateString={day}
            locale={locale}
          />
        )),
      [weekDays, daysState, onDayPress, DayComponent, locale],
    );

    return (
      <View style={[styles.weekContainer, weekContainerStyle]}>{days}</View>
    );
  },
);

Week.displayName = "Week";

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: "row",
  },
});
