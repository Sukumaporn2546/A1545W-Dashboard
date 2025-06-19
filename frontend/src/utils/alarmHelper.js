import { dateHelpers } from "./dateHelper";
export const alarmHelper = {
  formatAlarmData: (alarm) => {
    return alarm.map((item) => ({
      id: item.id.id,
      type: item.severity,
      message: item.name,
      description: item.details.note,
      value: item.details.value ?? 0,
      max: item.details.max ?? 0,
      min: item.details.min ?? 0,
      threshold: item.name.includes("Normal")
        ? `${item.details.min},${item.details.max}`
        : parseInt(item.details.threshold),
      unit: item.name.includes("Humidity") ? " %" : " °C",
      time: dateHelpers.formatThaiDate_day(item.createdTime),
      timeInTable: item.createdTime,
      acknowledged: item.acknowledged,
      cleared: item.cleared,
      startAt: dateHelpers.formatThaiDate_day(item.startTs) ?? 0,
      endAt: dateHelpers.formatThaiDate_day(item.endTs) ?? 0,
      ackAt: dateHelpers.formatThaiDate_day(item.ackTs) ?? 0,
      clearAt: dateHelpers.formatThaiDate_day(item.clearTs) ?? 0,
    }));
  },
  formatAlarmLatestData: (alarm) => {
    return {
      id: alarm.id.id,
      type: alarm.severity,
      message: alarm.name,
      description: alarm.details.note,
      value: alarm.details.value ?? 0,
      max: alarm.details.max ?? 0,
      min: alarm.details.min ?? 0,
      unit: alarm.name.includes("Humidity") ? " %" : " °C",
      time: dateHelpers.formatThaiDate_day(alarm.createdTime),
      acknowledged: alarm.acknowledged,
      cleared: alarm.cleared,
    };
  },
};
