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

export const useHumidityStore = create((set, get) => ({
  showMessage: useMessageStore.getState().showMessage,
  realtimeHumid: null,
  seriesHumidity: [],
  isLoading: false,
  fetchLoading: false,
  error: null,
  socket: null,
  api: new ThingsBoardAPI(),
  ws: null,
  minHumidLine: null,
  maxHumidLine: null,
  compare_max_line: null,
  compare_min_line: null,
  selectedDateHumid: dayjs().format("YYYY-MM-DD"),
  startPeriodHumid: null,
  endPeriodHumid: null,
  selectedTypeHumid: null,

setCompare_max_min_Line: (max, min) => {
    const {showMessage} = get();
    if (max <= min) {
      showMessage("error", "Max temperature should be greater than min temperature!");
    } else {
      set({ compare_max_line: max, compare_min_line: min });
      showMessage("success", "Set Min and Max Temperature successfully!");
    }
  },

  
  setSelectedDate: (date) => set({ selectedDateHumid: date }),
  setLoading: (loading) => set({ isLoading: loading }),
  setFetchLoading: (loading) => set({ fetchLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearGraphHumid: () =>
    set({
      seriesHumidity: [],
    }),
  setupWebSocketHumid: async () => {
    try {
      if (!get().ws) {
        const wsInstance = new SetupWebSocket((message) =>
          get().receivedMessageHumid(message)
        );
        set({ ws: wsInstance });
        await wsInstance.start();
      }
    } catch (error) {
      console.error("can't setup websocket humidity : ", error);
    }
  },
  receivedMessageHumid: async (message) => {
    const { selectedDate, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError(true);

      const data =
        typeof message.data === "string"
          ? JSON.parse(message.data)
          : message.data;

      const humidityEntry = data.humidity?.[0];
      const timestamp = parseInt(humidityEntry?.[0] ?? Date.now());
      const humidity = parseFloat(humidityEntry?.[1] ?? 0).toFixed(2);
      const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
      set((state) => ({
        realtimeHumid: humidity,
        seriesHumidity: isToday
          ? dataHelpers
              .filterDuplicates([
                ...state.seriesHumidity,
                [timestamp, humidity],
              ])
              .slice(-288)
          : state.seriesHumidity,
      }));
    } catch (error) {
      console.error(
        "Error to receive humidity form WebSocket : ",
        error.message
      );
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
  closeWebSocketHumid: async () => {
    const { ws } = get();
    try {
      await ws.onClose();
      set({ ws: null });
    } catch (error) {
      console.error("Error to close WebSocket : ", error.message);
    }
  },

  setMinMaxHumidLine: async (min, max) => {
    const {
      api,
      showMessage,
      getMinMaxHumidLine,
      setLoading,
      setError,
      clearError,
    } = get();
    const finalMin = min ?? minTempLine;
    const finalMax = max ?? maxTempLine;
    try {
      setLoading(true);
      clearError();
      if (finalMax <= finalMin) {
        showMessage(
          "error",
          "Max humidity should be greater than min humidity!"
        );
      } else {
        const response = await api.postAttributeMaxMinHumid(min, max);
        if (response.status == 200) {
          await getMinMaxHumidLine();
          showMessage("success", "Set Min and Max Humidity successfully!");
          console.log("post attribute successfully");
        } else {
          console.error("can't post attribute  : ", response.status);
        }
      }
    } catch (error) {
      console.error("Error post attribute data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
  getMinMaxHumidLine: async () => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      const data = await api.getAttributeMaxMinHumidLine();
      console.log(data);
      set({
        maxHumidLine:
          data.data.find((e) => e.key === "maxHumidity").value ?? null,
        minHumidLine:
          data.data.find((e) => e.key === "minHumidity").value ?? null,
      });
    } catch (error) {
      console.error("Error getting attribute min/max temp:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },

  fetchHistoricalHumid: async (pickerType, selectDate) => {
    const { api, setFetchLoading, setError, clearError } = get();
    try {
      setFetchLoading(true);
      clearError();
      console.log(pickerType, selectDate);
      const timeConfig = getTimeConfiguration(pickerType, selectDate);
      if (!timeConfig) throw new Error("Invalid picker type or date");
      const { start, end, interval, limit } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      set({ startPeriodHumid: start, endPeriodHumid: end });
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
      set({
        selectedDateHumid:
          pickerType == "week"
            ? selectDate
            : pickerType == "period"
            ? selectDate
            : dayjs(selectDate).format("YYYY-MM-DD"),
      });
      set({ selectedTypeHumid: pickerType });
    } catch (error) {
      console.error("Error fetching humidity data:", error);
      setError(error.message);
    } finally {
      setFetchLoading(false);
    }
  },
}));
