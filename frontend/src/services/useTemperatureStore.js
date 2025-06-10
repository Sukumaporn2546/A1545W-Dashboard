import { create } from "zustand";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { ThingsBoardAPI } from "./api";
import { getTimeConfiguration } from "../configs/timeConfigs";
import { dateHelpers } from "../utils/dateHelper";
import { dataHelpers } from "../utils/dataHelper";
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
export const useTemperatureStore = create((set, get) => ({
  currentData: {},
  seriesTemperature: [],
  seriesHumidity: [],
  token: null,
  socket: null,
  isLoading: false,
  error: null,
  api: new ThingsBoardAPI(),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  clearGraphTemp: () =>
    set({
      seriesTemperature: [],
    }),
  clearGraphHumid: () =>
    set({
      seriesHumidity: [],
    }),

  login: async () => {
    const { api, setLoading, setError } = get();

    try {
      setLoading(true);
      const token = await api.login();
      set({ token });
      return token;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  setupWebSocket: () => {
    const jwtToken =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtdWF1bndvbmd0dW1fc0BzaWxwYWtvcm4uZWR1IiwidXNlcklkIjoiMTMzMGFkZDAtMjk4Mi0xMWYwLTkwNWItNzE1MTg4YWQyY2Q4Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJlMTZiMmUwMy1lOGE1LTQ3OGQtYWZkYy1jYmEwNDIyOWFkNzciLCJleHAiOjE3NTA5ODQxMTIsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzQ5MTg0MTEyLCJmaXJzdE5hbWUiOiJTdWt1bWFwb3JuIiwibGFzdE5hbWUiOiJNdWF1bndvbmd0dW0iLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiIxMzBmNDMyMC0yOTgyLTExZjAtOTA1Yi03MTUxODhhZDJjZDgiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.n8WGVCWQdqg_1zTuRV3-GgbIRhWJnLDBp3ZntIkIhVT4ZLKJZ1bkojtZNt08Jo51t3SzsvoJudiQHoZNPIFfRA";

    const socket = new WebSocket(
      `wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=${jwtToken}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection opened");

      const subscribeMessage = JSON.stringify({
        tsSubCmds: [
          {
            entityType: "DEVICE",
            entityId: "f313ad90-3534-11f0-905b-715188ad2cd8",
            scope: "LATEST_TELEMETRY",
            cmdId: 1,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      });

      socket.send(subscribeMessage);
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const message = JSON.parse(event.data);
      if (!message.data) return;
      const temperatureEntry = message.data.temperature?.[0];
      const humidityEntry = message.data.humidity?.[0];
      const timestamp = parseInt(temperatureEntry?.[0] ?? Date.now());
      const temperature = parseFloat(temperatureEntry?.[1] ?? 0);
      const humidity = parseFloat(humidityEntry?.[1] ?? 0);
      const filterDuplicates = (arr) => {
        const seen = new Set();
        return arr.filter(([ts]) => {
          if (seen.has(ts)) return false;
          seen.add(ts);
          return true;
        });
      };

      set((state) => ({
        currentData: {
          temperature,
          humidity,
        },
        seriesTemperature: filterDuplicates([
          ...state.seriesTemperature,
          [timestamp, temperature],
        ]).slice(-288),
        seriesHumidity: filterDuplicates([
          ...state.seriesHumidity,
          [timestamp, humidity],
        ]).slice(-288),
      }));
    };
    set({ socket });
  },

  closeWebSocket: () => {
    const socket = get().socket;
    socket?.close();
    set({ socket: null }); // clear it
  },

  fetchHistoricalTemp: async (pickerType, selectDate) => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      const timeConfig = getTimeConfiguration(pickerType, selectDate);
      if (!timeConfig) throw new Error("Invalid picker type or date");
      const { start, end, interval, limit } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      console.log(`Fetching temperature data: ${start} to ${end}`);
      const data = await api.fetchTelemetryData({
        startTs,
        endTs,
        interval,
        limit,
        keys: "temperature",
      });
      if (!data.temperature) {
        throw new Error("No temperature data received");
      }
      const formatted = dataHelpers.formatTemperatureData(data.temperature);
      console.log("formatted", formatted);
      set({ seriesTemperature: formatted });
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
  fetchHistoricalHumid: async (pickerType, selectDate) => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      const timeConfig = getTimeConfiguration(pickerType, selectDate);
      if (!timeConfig) throw new Error("Invalid picker type or date");
      const { start, end, interval, limit } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      console.log(`Fetching temperature data: ${start} to ${end}`);
      const data = await api.fetchTelemetryData({
        startTs,
        endTs,
        interval,
        limit,
        keys: "humidity",
      });
      if (!data.humidity) {
        throw new Error("No humidity data received");
      }
      const formatted = dataHelpers.formatHumidityData(data.humidity);
      console.log("formatted", formatted);
      set({ seriesHumidity: formatted });
    } catch (error) {
      console.error("Error fetching humidity data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
}));
