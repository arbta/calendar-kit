import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { CalendarList, StateInputParams } from "@fowusu/calendar-kit";

import { todayDateString } from "../../constants";

import { DataType, fetchData } from "./data.mock";
import { DayComponent } from "./Day";

const weekStartsOn = 1;
const CalendarListComponent = ({ locale }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // this function should be simple and pure, as complexity
  // and side effects makes calendar to rerender unnecessarily affecting performance
  const onDayPress = useCallback((dateString: string) => {
    // possible to trigger actions that does not affect UI tree state
    // example tracking clicks
    setSelectedDate(dateString);
  }, []);

  // react to selected date changes
  useEffect(() => {
    if (selectedDate) {
      const asFetchedDate = data.find(({ date }) => date === selectedDate);
      if (asFetchedDate) {
        alert(
          `Status: ${asFetchedDate.availability.status}\nHourly fee: $${asFetchedDate.availability.fee}`,
        );
      }
      // do something like side effects
    }
  }, [selectedDate, data]);

  //make api call
  useEffect(() => {
    setLoading(true);
    fetchData()
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // this is to extend the day cell state
  const createDayState = useCallback(
    ({ dateString }: StateInputParams) => {
      const fetchedDate = data.find(({ date }) => date === dateString);
      if (fetchedDate === undefined) {
        return {};
      }
      const { availability } = fetchedDate;
      return {
        availability,
      };
    },
    [data],
  );

  return (
    <>
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 40,
            right: "48%",
            backgroundColor: "#fff",
            zIndex: 10,
            borderRadius: 20,
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      )}
      <CalendarList
        minDate={todayDateString}
        futureMonthsCount={1}
        showExtraDays={false}
        markedDates={[selectedDate]}
        showDayNamesOnTop
        onDayPress={onDayPress}
        firstDayOfWeek={weekStartsOn}
        locale={locale}
        customStateCreator={createDayState}
        DayComponent={DayComponent}
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
    </>
  );
};

const meta = {
  title: "Examples/WithExternalData",
  component: CalendarListComponent,
};

export default meta;

export const Mobile = {};
