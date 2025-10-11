import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  I18nManager,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

import { DayIndex } from "../types";
import {
  createWeeksInRange,
  dateStringToDate,
  endOfMonth,
  startOfMonth,
} from "../utils/date";
import { width } from "../utils/screen";

import { VIEWABILITY_CONFIG } from "./constants";
import { CalendarListViewProps } from "./types";
import { Week, WeekProps } from "./Week";
import { useInteraction } from "./useInteraction";

export interface ListWeeklyScrollContainerProps
  extends CalendarListViewProps,
    Omit<WeekProps, "weekDays" | "month" | "isLastWeekOfList"> {
  currentDate?: string;
  months: string[];
  showDayNames?: boolean;
  firstDayOfWeek?: DayIndex;
  MonthNameComponent?: React.ComponentType<{ month: Date; locale?: string }>;
}
const isWeb = Platform.select({ web: true, default: false });

export const ListWeeklyScrollContainer = forwardRef(
  (
    {
      months,
      firstDayOfWeek = 0,
      MonthNameComponent,
      locale,
      weekContainerStyle,
      currentDate,
      onScroll,
      showScrollIndicator = false,
      decelerationRate = "fast",
      onListEndReached,
      onEndReachedThreshold,
      showDayNames,
      calendarListContentContainerStyle,
      ...weekProps
    }: ListWeeklyScrollContainerProps,
    ref: any
  ) => {
    const [scrollLayoutWidth, setScrollLayoutWidth] = useState(width);

    const listRef = useRef<any>(null);
    const initialDateRef = useRef(currentDate);
    const { interactionRef, interactionHandler } = useInteraction();

    const data = useMemo(() => {
      const lastMonth = endOfMonth(dateStringToDate(months[months.length - 1]));
      const startMonth = dateStringToDate(months[0]);
      return createWeeksInRange(startMonth, lastMonth, firstDayOfWeek).map(
        (week) => ({
          month: startOfMonth(dateStringToDate(week[0])),
          week,
        })
      );
    }, [months, firstDayOfWeek]);

    const initialMonthIndex = useMemo(() => {
      if (initialDateRef.current) {
        const indexOfInitialMonth = data.findIndex(({ week }) =>
          week.includes(initialDateRef.current as string)
        );
        return indexOfInitialMonth >= 0 ? indexOfInitialMonth : 0;
      }
      return 0;
    }, [data]);

    const webFallbackWeekContainerStyle: any = {
      scrollSnapAlign: "center",
      width: isWeb ? "100vw" : scrollLayoutWidth,
    };

    const renderItem = ({ item: { month, week }, index }: any) => {
      return (
        <Week
          {...weekProps}
          month={month}
          key={`${month}-week-${index}`}
          weekDays={week}
          isLastWeekOfList={index === data.length - 1}
          weekContainerStyle={{
            ...weekContainerStyle,
            ...webFallbackWeekContainerStyle,
          }}
        />
      );
    };

    const onScrollLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setScrollLayoutWidth(layout.width);
    };

    useImperativeHandle(ref, () => ({
      scrollToItem({
        item: dateString,
        animated = true,
      }: {
        item: string;
        animated: boolean;
      }) {
        const item = data.find(({ week }) => week.includes(dateString));
        if (item) {
          listRef.current?.scrollToItem({
            animated,
            item,
          });
        }
      },
    }));

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: any) => {
        if (!interactionRef.current) return;
        const visibleWeeks = viewableItems
          //@ts-expect-error month is any
          .filter((week) => week.isViewable)
          //@ts-expect-error item is any
          .map(({ item }) => item);
        // fix issues with fast scroll on web
        if (visibleWeeks && visibleWeeks.length > 0) {
          onScroll?.(visibleWeeks);
        }
      },
      [onScroll]
    );
    return I18nManager.isRTL ? (
      <FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        initialScrollIndex={initialMonthIndex}
        getItemLayout={(_, index) => ({
          length: scrollLayoutWidth,
          offset: scrollLayoutWidth * index,
          index,
        })}
        onLayout={onScrollLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        contentContainerStyle={calendarListContentContainerStyle}
        decelerationRate={decelerationRate}
        extraData={weekProps}
        viewabilityConfig={VIEWABILITY_CONFIG}
      />
    ) : (
      <FlashList
        ref={listRef}
        onViewableItemsChanged={onViewableItemsChanged}
        onLayout={onScrollLayout}
        horizontal
        data={data}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={scrollLayoutWidth}
        initialScrollIndex={initialMonthIndex}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onListEndReached}
        showsHorizontalScrollIndicator={showScrollIndicator}
        decelerationRate={decelerationRate}
        extraData={weekProps}
        contentContainerStyle={calendarListContentContainerStyle}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onScrollBeginDrag={interactionHandler}
      />
    );
  }
);

ListWeeklyScrollContainer.displayName = "ListWeeklyScrollContainer";
