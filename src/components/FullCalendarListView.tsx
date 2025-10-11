import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { FlatList, I18nManager, Platform } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { startOfMonthForDateString } from "../utils/date";
import { width } from "../utils/screen";

import { Calendar } from "./Calendar";
import { VIEWABILITY_CONFIG } from "./constants";
import {
  CalendarListProps,
  CalendarListViewProps,
  FullCalendarListViewProps,
} from "./types";
import { useInteraction } from "./useInteraction";

export const FullCalendarListView = forwardRef(
  (
    {
      CalendarSeparator,
      calendarVerticalGap = 32,
      minDate,
      currentDate,
      markedDates,
      pastMonthsCount = 0,
      futureMonthsCount = 12,
      horizontal,
      showDayNamesOnTop = false,
      showDayNames = true,
      WeekDayNameComponent,
      weekdaysShort,
      firstDayOfWeek,
      calendarContentContainerStyle,
      calendarWidth = width,
      showScrollIndicator,
      onScroll,
      showMonthName = true,
      calendarListContentContainerStyle,
      decelerationRate = "fast",
      onEndReachedThreshold,
      onListEndReached,
      months,
      ...calendarProps
    }: CalendarListViewProps &
      CalendarListProps &
      FullCalendarListViewProps & {
        months: string[];
      },
    ref: any
  ) => {
    const isWeb = Platform.select({ web: true, default: false });
    const listRef = useRef<any>(null);
    const webFallbackContainerStyle: any = {
      scrollSnapAlign: horizontal ? "center" : "start",
      width: isWeb && calendarWidth === width ? "100vw" : calendarWidth,
    };
    const initialDateRef = useRef(currentDate);
    const { interactionHandler, interactionRef } = useInteraction();

    const initialMonthIndex = useMemo(() => {
      if (initialDateRef.current) {
        const indexOfInitialMonth = months.indexOf(
          startOfMonthForDateString(initialDateRef.current)
        );
        return indexOfInitialMonth >= 0 ? indexOfInitialMonth : 0;
      }
      return 0;
    }, [months]);

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: any) => {
        if (!interactionRef.current) return;
        const visibleMonths = viewableItems
          //@ts-expect-error month is any
          .filter((month) => month.isViewable)
          //@ts-expect-error item is any
          .map(({ item }) => item);
        // fix issues with fast scroll on web
        if (visibleMonths && visibleMonths.length > 0) {
          onScroll?.(visibleMonths);
        }
      },
      [onScroll]
    );

    const renderCalendar = ({
      item,
      index,
    }: {
      item: string;
      index: number;
    }) => (
      <Calendar
        {...calendarProps}
        showMonthName={showMonthName}
        showDayNames={showDayNames && !showDayNamesOnTop}
        firstDayOfWeek={firstDayOfWeek}
        weekdaysShort={weekdaysShort}
        minDate={minDate}
        markedDates={markedDates}
        date={item}
        WeekDayNameComponent={WeekDayNameComponent}
        contentContainerStyle={{
          ...calendarContentContainerStyle,
          ...webFallbackContainerStyle,
          paddingTop: index !== 0 ? calendarVerticalGap : 0,
        }}
      />
    );
    const keyExtractor = useCallback((item: string) => item, []);

    useImperativeHandle(ref, () => ({
      scrollToItem({
        item: dateString,
        animated = true,
      }: {
        item: string;
        animated?: boolean;
      }) {
        const month = startOfMonthForDateString(dateString);
        const item = months.find((m) => m === month);
        if (item) {
          listRef.current?.scrollToItem({
            animated,
            item,
          });
          interactionRef.current = true;
        }
      },
    }));
    return (
      <>
        {/*/!***/}
        {/* * Calendar will not work in horizontal and RTL mode*/}
        {/* * because of FlashList issue https://github.com/Shopify/flash-list/issues/544",*/}
        {/* **!/*/}

        {horizontal && I18nManager.isRTL ? (
          <FlatList
            data={months}
            renderItem={renderCalendar}
            ref={listRef}
            keyExtractor={keyExtractor}
            extraData={calendarProps}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            initialScrollIndex={initialMonthIndex}
            getItemLayout={(_, index) => ({
              length: calendarWidth,
              offset: calendarWidth * index,
              index,
            })}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            contentContainerStyle={calendarListContentContainerStyle}
            decelerationRate={decelerationRate}
            viewabilityConfig={VIEWABILITY_CONFIG}
          />
        ) : (
          <FlashList
            ref={listRef}
            horizontal={horizontal}
            renderItem={renderCalendar}
            keyExtractor={keyExtractor}
            data={months}
            extraData={calendarProps}
            pagingEnabled={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={showScrollIndicator}
            onViewableItemsChanged={onViewableItemsChanged}
            initialScrollIndex={initialMonthIndex}
            contentContainerStyle={calendarListContentContainerStyle}
            decelerationRate={decelerationRate}
            onEndReached={onListEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            viewabilityConfig={VIEWABILITY_CONFIG}
            onScrollBeginDrag={interactionHandler}
          />
        )}
      </>
    );
  }
);

FullCalendarListView.displayName = "FullCalendarListView";
