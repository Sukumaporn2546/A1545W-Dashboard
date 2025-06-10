import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isoWeek from "dayjs/plugin/isoWeek.js";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const dateHelpers = {
  parseWeekString: (weekString) => {
    const [yearStr, weekStr] = weekString.split("-");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr.replace("th", ""), 10);
    return { year, week };
  },

  getWeekRange: (year, week) => ({
    start: dayjs()
      .year(year)
      .isoWeek(week)
      .startOf("week")
      .format("YYYY-MM-DD"),
    end: dayjs().year(year).isoWeek(week).endOf("week").format("YYYY-MM-DD"),
  }),

  getMonthRange: (dateString) => {
    const date = dayjs(dateString);
    return {
      start: date.startOf("month").format("YYYY-MM-DD"),
      end: date.endOf("month").format("YYYY-MM-DD"),
    };
  },

  getYearRange: (yearString) => {
    const date = dayjs(yearString, "YYYY");
    return {
      start: date.startOf("year").format("YYYY-MM-DD"),
      end: date.endOf("year").format("YYYY-MM-DD"),
    };
  },

  createTimestamp: (dateString, isEnd = false) => {
    const timeString = isEnd ? "23:59:59" : "00:00:00";
    return new Date(`${dateString}T${timeString}+07:00`).getTime();
  },
};
