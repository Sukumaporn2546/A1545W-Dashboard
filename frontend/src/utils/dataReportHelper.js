import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { dateHelpers } from "./dateHelper";

dayjs.extend(utc);
dayjs.extend(timezone);

export const dataReportHelper = {
  convertDateTemp: (start, end) => {
    if (start === end) {
      return start;
    } else {
      return `${start} to ${end}`;
    }
  },
  convertDateHumid: (start, end) =>
    start === end ? start : `${start} to ${end}`,

  getTimeGenerate: () => dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD, HH:mm"),

  getStatValue: (series, type) => {
    if (!Array.isArray(series) || series.length === 0) return "0.00";

    const values = series.map((item) => parseFloat(item[1]));

    let result;

    switch (type) {
      case "max":
        result = Math.max(...values);
        break;
      case "avg":
        result = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case "min":
      default:
        result = Math.min(...values);
        break;
    }
    return result.toFixed(2);
  },

  groupContinuousExceed: (series, compareMax, compareMin, pickerType) => {
    if (!series?.length) return [];

    const result = [];
    let currentGroup = null;

    for (let i = 0; i < series.length; i++) {
      const [ts, rawVal] = series[i];
      const value = parseFloat(rawVal);
      const type =
        value > compareMax ? "High" : value < compareMin ? "Low" : null;

      if (type) {
        if (!currentGroup) {
          currentGroup = {
            key: result.length,
            start: ts,
            end: ts,
            type,
            values: [value],
          };
        } else {
          currentGroup.end = ts;
          currentGroup.values.push(value);
        }
      } else {
        if (currentGroup) {
          result.push({ ...currentGroup });
          currentGroup = null;
        }
      }
    }

    if (currentGroup) {
      result.push({ ...currentGroup });
    }

    // return result.map((g, i) => ({
    //   key: i,
    //   message: g.type,
    //   timeRange:
    //     dateHelpers.formatThaiDate_day(g.start) ==
    //     dateHelpers.formatThaiDate_day(g.end)
    //       ? dateHelpers.formatThaiDate_day(g.start)
    //       : `${dateHelpers.formatThaiDate_day(
    //           g.start
    //         )} - ${dateHelpers.formatThaiDate_day(g.end)}`,
    //   avgValue: (g.values.reduce((a, b) => a + b, 0) / g.values.length).toFixed(
    //     2
    //   ),
    //   threshold: g.type === "High" ? compareMax : compareMin,
    // }));

    return result.map((g, i) => {
      let timeRange = "";

      switch (pickerType) {
        case "week":
          timeRange =
            dateHelpers.formatThaiDate_weekDay(g.start) ==
            dateHelpers.formatThaiDate_weekDay(g.end)
              ? dateHelpers.formatThaiDate_weekDay(g.start)
              : `${dateHelpers.formatThaiDate_weekDay(
                  g.start
                )} - ${dateHelpers.formatThaiDate_weekDay(g.end)}`;
          break;
        case "month":
          timeRange =
            dateHelpers.formatThaiDate_month(g.start) ==
            dateHelpers.formatThaiDate_month(g.end)
              ? dateHelpers.formatThaiDate_month(g.start)
              : `${dateHelpers.formatThaiDate_month(
                  g.start
                )} - ${dateHelpers.formatThaiDate_month(g.end)}`;
          break;
        case "year":
          timeRange =
            dateHelpers.formatThaiDate_year(g.start) ==
            dateHelpers.formatThaiDate_year(g.end)
              ? dateHelpers.formatThaiDate_year(g.start)
              : `${dateHelpers.formatThaiDate_year(
                  g.start
                )} - ${dateHelpers.formatThaiDate_year(g.end)}`;
          break;
        case "date":
        default:
          timeRange =
            dateHelpers.formatThaiDate_day(g.start) ==
            dateHelpers.formatThaiDate_day(g.end)
              ? dateHelpers.formatThaiDate_day(g.start)
              : `${dateHelpers.formatThaiDate_day(
                  g.start
                )} - ${dateHelpers.formatThaiDate_day(g.end)}`;
          break;
      }

      return {
        key: i,
        message: g.type,
        timeRange,
        avgValue: (
          g.values.reduce((a, b) => a + b, 0) / g.values.length
        ).toFixed(2),
        threshold: g.type === "High" ? compareMax : compareMin,
      };
    });
  },
};
