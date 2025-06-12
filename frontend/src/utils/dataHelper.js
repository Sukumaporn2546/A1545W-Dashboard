import { CONFIG } from "../configs/constants";
export const dataHelpers = {
  //   filterDuplicates: (arr) => {
  //     const seen = new Set();
  //     return arr.filter(([timestamp]) => {
  //       if (seen.has(timestamp)) return false;
  //       seen.add(timestamp);
  //       return true;
  //     });
  //   },

  formatTemperatureData: (data) =>
    data.map((item) => {
      let date = new Date(item.ts);
      let minutes = Math.floor(date.getMinutes() / 5) * 5;
      let newTs = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        minutes
      ).getTime();
      return [newTs, Number(item.value).toFixed(2)];
    }),
  formatHumidityData: (data) =>
    data.map((item) => {
      let date = new Date(item.ts);
      let minutes = Math.floor(date.getMinutes() / 5) * 5;
      let newTs = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        minutes
      ).getTime();
      return [newTs, Number(item.value).toFixed(2)];
    }),

  //   limitSeriesLength: (series, maxLength = CONFIG.MAX_SERIES_LENGTH) =>
  //     series.slice(-maxLength),

  //   extractSensorData: (message) => {
  //     if (!message.data) return null;

  //     const temperatureEntry = message.data.temperature?.[0];
  //     const humidityEntry = message.data.humidity?.[0];

  //     return {
  //       timestamp: parseInt(temperatureEntry?.[0] ?? Date.now()),
  //       temperature: parseFloat(temperatureEntry?.[1] ?? 0),
  //       humidity: parseFloat(humidityEntry?.[1] ?? 0),
  //     };
  //   },
};
