import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ThingsBoardAPI } from "../services/api.js";
import { ThingsBoardWebSocket } from "../services/websocket.js";
import { dataHelpers, dateHelpers } from "../utils/dataHelpers.js";
import { CONFIG } from "../config/constants.js";

// Types for better code documentation
/**
 * @typedef {Object} SensorData
 * @property {number} temperature
 * @property {number} humidity
 */

/**
 * @typedef {Array<[number, number]>} TimeSeries
 */

/**
 * @typedef {'period'|'date'|'week'|'month'|'year'} PickerType
 */

export const useTemperatureStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    currentData: {},
    seriesTemperature: [],
    seriesHumidity: [],
    token: null,
    socket: null,
    isLoading: false,
    error: null,

    // API instance
    api: new ThingsBoardAPI(),

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    clearGraphTemp: () => set({ seriesTemperature: [] }),
    clearGraphHumid: () => set({ seriesHumidity: [] }),

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

    setupWebSocket: async () => {
      const { socket, closeWebSocket } = get();

      // Close existing connection
      if (socket) {
        closeWebSocket();
      }

      try {
        const webSocket = new ThingsBoardWebSocket((message) => {
          const sensorData = dataHelpers.extractSensorData(message);
          if (!sensorData) return;

          const { timestamp, temperature, humidity } = sensorData;

          set((state) => ({
            currentData: { temperature, humidity },
            seriesTemperature: dataHelpers.limitSeriesLength(
              dataHelpers.filterDuplicates([
                ...state.seriesTemperature,
                [timestamp, temperature],
              ])
            ),
            seriesHumidity: dataHelpers.limitSeriesLength(
              dataHelpers.filterDuplicates([
                ...state.seriesHumidity,
                [timestamp, humidity],
              ])
            ),
          }));
        });

        await webSocket.connect();
        set({ socket: webSocket });
      } catch (error) {
        console.error("Failed to setup WebSocket:", error);
        get().setError("Failed to establish real-time connection");
      }
    },

    closeWebSocket: () => {
      const { socket } = get();
      if (socket) {
        socket.close();
        set({ socket: null });
      }
    },

    fetchHistoricalTemp: async (pickerType, selectDate) => {
      const { api, setLoading, setError, clearError } = get();

      try {
        setLoading(true);
        clearError();

        const timeConfig = get().getTimeConfiguration(pickerType, selectDate);
        if (!timeConfig) {
          throw new Error("Invalid picker type or date selection");
        }

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
        set({ seriesTemperature: formatted });
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },

    fetchHistoricalHumid: async (pickerType, selectDate) => {
      const { setLoading, setError, clearError } = get();

      try {
        setLoading(true);
        clearError();

        // For now using mock data as in original code
        const api = new ThingsBoardAPI();
        const data = await api.fetchMockHumidityData();

        const formatted = dataHelpers.formatHumidityData(data);
        set({ seriesHumidity: formatted });
      } catch (error) {
        console.error("Error fetching humidity data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },

    // Helper method to get time configuration based on picker type
    getTimeConfiguration: (pickerType, selectDate) => {
      switch (pickerType) {
        case "period":
          if (!Array.isArray(selectDate)) return null;
          const [start, end] = selectDate;
          return {
            start,
            end,
            interval: CONFIG.INTERVALS.FIVE_MINUTES,
            limit: CONFIG.LIMITS.DAILY,
          };

        case "date":
          return {
            start: selectDate,
            end: selectDate,
            interval: CONFIG.INTERVALS.FIVE_MINUTES,
            limit: CONFIG.LIMITS.DAILY,
          };

        case "week":
          const { year, week } = dateHelpers.parseWeekString(selectDate);
          const weekRange = dateHelpers.getWeekRange(year, week);
          return {
            ...weekRange,
            interval: CONFIG.INTERVALS.HOUR,
            limit: CONFIG.LIMITS.WEEKLY,
          };

        case "month":
          const monthRange = dateHelpers.getMonthRange(selectDate);
          return {
            ...monthRange,
            interval: CONFIG.INTERVALS.DAY,
            limit: CONFIG.LIMITS.MONTHLY,
          };

        case "year":
          const yearRange = dateHelpers.getYearRange(selectDate);
          return {
            ...yearRange,
            interval: CONFIG.INTERVALS.MONTH,
            limit: CONFIG.LIMITS.YEARLY,
          };

        default:
          return null;
      }
    },

    // Cleanup method
    cleanup: () => {
      get().closeWebSocket();
      set({
        currentData: {},
        seriesTemperature: [],
        seriesHumidity: [],
        token: null,
        error: null,
      });
    },
  }))
);
