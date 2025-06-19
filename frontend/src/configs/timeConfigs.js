import { CONFIG } from "./constants.js";
import { dateHelpers } from "../utils/dateHelper.js";
export const getTimeConfiguration = (pickerType, selectDate) => {
  switch (pickerType) {
    case "period": {
      if (!Array.isArray(selectDate)) return null;
      const [start, end] = selectDate;
      return {
        start,
        end,
        interval: CONFIG.INTERVALS.HOUR,
        limit: CONFIG.LIMITS.DAILY,
      };
    }
    case "date":
      return {
        start: selectDate,
        end: selectDate,
        interval: CONFIG.INTERVALS.FIVE_MINUTES,
        limit: CONFIG.LIMITS.DAILY,
      };
    case "week": {
      const { year, week } = dateHelpers.parseWeekString(selectDate);
      const weekRange = dateHelpers.getWeekRange(year, week);
      return {
        ...weekRange,
        interval: CONFIG.INTERVALS.HOUR,
        limit: CONFIG.LIMITS.WEEKLY,
      };
    }
    case "month": {
      const monthRange = dateHelpers.getMonthRange(selectDate);
      return {
        ...monthRange,
        interval: CONFIG.INTERVALS.DAY,
        limit: CONFIG.LIMITS.MONTHLY,
      };
    }
    case "year": {
      const yearRange = dateHelpers.getYearRange(selectDate);
      return {
        ...yearRange,
        interval: CONFIG.INTERVALS.MONTH,
        limit: CONFIG.LIMITS.YEARLY,
      };
    }
    default:
      return null;
  }
};
