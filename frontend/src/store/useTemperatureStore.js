import { create } from "zustand";
import { CONFIG } from "../configs/constants";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { ThingsBoardAPI } from "../services/api";
import { SetupWebSocket } from "../services/websocket";
import { getTimeConfiguration } from "../configs/timeConfigs";
import { dateHelpers } from "../utils/dateHelper";
import { dataHelpers } from "../utils/dataHelper";
import { useMessageStore } from "./useMessageStore";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const useTemperatureStore = create((set, get) => ({
  realtimeTemp: null,
  seriesTemperature: [],
  isLoading: false,
  error: null,
  api: new ThingsBoardAPI(),
  ws: null,
  minTempLine: null,
  maxTempLine: null,
  selectedDate: dayjs().format("YYYY-MM-DD"),
  showMessage: useMessageStore.getState().showMessage,
  startPeriodTemp: null,
  endPeriodTemp: null,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearGraphTemp: () => set({ seriesTemperature: [] }),

  setupWebSocketTempTelemetry: async () => {
    try {
      if (!get().ws) {
        const wsInstance = new SetupWebSocket(
          (message) => get().receivedMessageTemperature(message),

          101
        );
        set({ ws: wsInstance });
        await wsInstance.start();
      }
    } catch (error) {
      console.error("Can't setup telemetry WebSocket:", error);
    }
  },
  receivedMessageTemperature: async (message) => {
    const { setLoading, selectedDate, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      console.log(message);
      const data =
        typeof message.data === "string"
          ? JSON.parse(message.data)
          : message.data;
      console.log(data);
      const temperatureEntry = data.temperature?.[0];
      const timestamp = parseInt(temperatureEntry?.[0] ?? Date.now());
      const temperature = parseFloat(temperatureEntry?.[1] ?? 0);
      const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
      set((state) => ({
        realtimeTemp: temperature,
        seriesTemperature: isToday
          ? dataHelpers
              .filterDuplicates([
                ...state.seriesTemperature,
                [timestamp, temperature],
              ])
              .slice(-288)
          : state.seriesTemperature,
      }));
    } catch (error) {
      console.error("Error receiving WebSocket data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },

  closeWebSocketTempTelemetry: async () => {
    const { ws } = get();
    try {
      if (ws) {
        await ws.close();
        set({ ws: null });
      }
    } catch (error) {
      console.error("Error closing telemetry WebSocket:", error.message);
    }
  },

  setMinMaxTempLine: async (min, max) => {
    const {
      api,
      showMessage,
      getMinMaxTempLine,
      setLoading,
      setError,
      clearError,
    } = get();
    try {
      setLoading(true);
      clearError();
      const response = await api.postAttributeMaxMinTemp(min, max);
      if (response.status === 200) {
        await getMinMaxTempLine();
        showMessage("success", "Set Min and Max Temperature successfully!");
      } else {
        console.error("Can't post attribute:", response.status);
      }
    } catch (error) {
      console.error("Error posting attribute data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },

  getMinMaxTempLine: async () => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      const data = await api.getAttributeMaxMinTempLine();
      set({
        maxTempLine:
          data.data.find((e) => e.key === "maxTemperature").value ?? null,
        minTempLine:
          data.data.find((e) => e.key === "minTemperature").value ?? null,
      });
    } catch (error) {
      console.error("Error getting attribute min/max temp:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },

  fetchHistoricalTemp: async (pickerType, selectDate) => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      set({ selectedDate: dayjs(selectDate).format("YYYY-MM-DD") });
      const timeConfig = getTimeConfiguration(pickerType, selectDate);
      if (!timeConfig) throw new Error("Invalid picker type or date");
      const { start, end, interval, limit } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      set({ startPeriodTemp: start, endPeriodTemp: end });
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
      console.log("Formatted:", formatted);
      set({ seriesTemperature: formatted });
      return formatted;
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
}));
