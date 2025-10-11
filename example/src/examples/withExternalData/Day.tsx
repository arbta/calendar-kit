import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InnerDayProps } from "@fowusu/calendar-kit";

import { DataType } from "./data.mock";

export const DayComponent: React.FC<
  InnerDayProps<InnerDayProps<Pick<DataType, "availability">>>
> = ({ day, locale = "en-US", state, isToday, isSelected, availability }) => {
  const dayStyle = useMemo(() => {
    if (state !== "inactive" || availability?.status !== "unavailable") {
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
  }, [state, isSelected, isToday]);

  const isAvailable = availability && availability?.status !== "unavailable";

  return (
    <>
      <View style={[containerStyles.defaultContainer, dayStyle.containerStyle]}>
        <Text
          style={[
            textStyles.defaultDayText,
            textStyles[state],
            textStyles[availability?.status],
            dayStyle.textStyle,
          ]}
        >
          {day.toLocaleDateString(locale, { day: "numeric" })}
        </Text>
        {isAvailable && (
          <View
            style={[
              containerStyles.dotStyle,
              availability.status === "available"
                ? containerStyles.dotAvailable
                : containerStyles.dotPartiallyAvailable,
            ]}
          />
        )}
      </View>
    </>
  );
};

const containerStyles = StyleSheet.create({
  defaultContainer: {
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 2,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#b1b5ff",
  },
  dotStyle: {
    height: 5,
    width: 5,
    borderRadius: 4,
    backgroundColor: "#cacaca",
  },
  dotPartiallyAvailable: {
    backgroundColor: "#ffcd50",
  },
  dotAvailable: {
    backgroundColor: "#458c4f",
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
  unavailable: {
    color: "#cacaca",
    textDecorationLine: "line-through",
  },
  today: {
    color: "#787de7",
    fontWeight: "bold",
  },
});
