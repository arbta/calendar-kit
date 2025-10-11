import { getDatesInRange, toLocaleDateString } from "@fowusu/calendar-kit";
import { addDays } from "date-fns";

import { todayDateString } from "../../constants";

export type DataType = {
  date: string;
  availability: {
    status: "available" | "unavailable" | "paritially_available";
    fee: number;
  };
};

export const fetchData: () => Promise<DataType[]> = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockedData = createMockData();
      resolve(mockedData);
    }, 800);
  });
};

// example mock availability from today
const createMockData = () => {
  const aMonthFromToday = toLocaleDateString(addDays(todayDateString, 30));
  const monthDateStrings = getDatesInRange(todayDateString, aMonthFromToday);

  return monthDateStrings.map((dateString) => ({
    date: dateString,
    availability: randomAvaliability(),
  }));
};

const randomAvaliability = () => {
  const fee = getRandomNumber();
  const availabilityData: DataType["availability"][] = [
    {
      status: "unavailable",
      fee: 0,
    },
    {
      status: "available",
      fee,
    },
    {
      status: "paritially_available",
      fee,
    },
  ];
  return availabilityData[Math.floor(Math.random() * 3)];
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
};
