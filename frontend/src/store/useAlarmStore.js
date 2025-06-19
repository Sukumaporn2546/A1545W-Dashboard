import { create } from "zustand";
import { CONFIG } from "../configs/constants";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import { ThingsBoardAPI } from "../services/api";
import { alarmHelper } from "../utils/alarmHelper";
import { useMessageStore } from "./useMessageStore";
import { getTimeConfiguration } from "../configs/timeConfigs";
import { dateHelpers } from "../utils/dateHelper";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const useAlarmStore = create((set, get) => ({
  alarm: [],
  alarmHistoricalTemp: [],
  alarmHistoricalHumid: [],
  latestAlerts: [],
  isLoading: null,
  tableTempLoading: null,
  tableHumidLoading: null,
  isAckLoading: {},
  isClearLoading: {},
  error: null,
  api: new ThingsBoardAPI(),
  showMessage: useMessageStore.getState().showMessage,
  setTableTempLoading: (loading) => set({ tableTempLoading: loading }),
  setTableHumidLoading: (loading) => set({ tableHumidLoading: loading }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  getLatestAlarm: async () => {
    const { api } = get();
    try {
      const latest = await api.getLatestAlarm();
      const formatted = alarmHelper.formatAlarmLatestData(latest);
      set({ latestAlerts: formatted });
    } catch (error) {
      console.log("get latest alarm error : ", error);
    }
  },
  getAlarm: async () => {
    const { api, setLoading, setError, clearError } = get();
    try {
      setLoading(true);
      clearError();
      const alarmData = await api.getAlarm();
      const formatted = alarmHelper.formatAlarmData(alarmData);
      set({ alarm: formatted });
    } catch (error) {
      console.log("get alarm error : ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },
  getHistoricalAlarmTemp: async (pickerType, selectedDate) => {
    const { api, setError, clearError, setTableTempLoading } = get();
    try {
      setTableTempLoading(true);
      clearError();
      if (!selectedDate && !pickerType) {
        throw new Error("No selected and pickerType date provided");
      }
      console.log(pickerType, selectedDate);
      const timeConfig = getTimeConfiguration(pickerType, selectedDate);
      if (!timeConfig) throw new Error("Invalid data");
      const { start, end } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      console.log(start, end);
      const alarmHistoricalData = await api.getHistoricalAlarm({
        startTs,
        endTs,
      });
      console.log(alarmHistoricalData);
      const formatted = alarmHelper.formatAlarmData(alarmHistoricalData);
      set({ alarmHistoricalTemp: formatted });
    } catch (error) {
      console.error("get historical alarm error : ", error);
      setError(error.message);
    } finally {
      setTableTempLoading(false);
    }
  },
  getHistoricalAlarmHumid: async (pickerType, selectedDate) => {
    const { api, setError, clearError, setTableHumidLoading } = get();
    try {
      setTableHumidLoading(true);
      clearError();
      if (!selectedDate && pickerType) {
        throw new Error("No selected and pickerType date provided");
      }
      console.log(pickerType, selectedDate);
      const timeConfig = getTimeConfiguration(pickerType, selectedDate);
      if (!timeConfig) throw new Error("Invalid data");
      const { start, end } = timeConfig;
      const startTs = dateHelpers.createTimestamp(start);
      const endTs = dateHelpers.createTimestamp(end, true);
      console.log(start, end);
      const alarmHistoricalData = await api.getHistoricalAlarm({
        startTs,
        endTs,
      });
      console.log(alarmHistoricalData);
      const formatted = alarmHelper.formatAlarmData(alarmHistoricalData);
      set({ alarmHistoricalHumid: formatted });
    } catch (error) {
      console.error("get historical alarm error : ", error);
      setError(error.message);
    } finally {
      setTableHumidLoading(false);
    }
  },
  acknowledgeAlarm: async (alarmId) => {
    const { api, showMessage, setError, clearError } = get();
    try {
      set((state) => ({
        isAckLoading: { ...state.isAckLoading, [alarmId]: true },
      }));
      clearError();
      const response = await api.acknowledgeAlarm(alarmId);
      if (response.status == 200) {
        await get().getAlarm();
        showMessage("success", "Alarm acknowledged successfully!");
      }
    } catch (error) {
      console.log("acknowledge failed : ", error);
      showMessage("error", "Failed to acknowledge alarm.");
      setError(error.message);
    } finally {
      set((state) => ({
        isAckLoading: { ...state.isAckLoading, [alarmId]: false },
      }));
    }
  },
  clearAlarm: async (alarmId) => {
    const { api, showMessage, setError, clearError } = get();
    try {
      set((state) => ({
        isClearLoading: { ...state.isClearLoading, [alarmId]: true },
      }));
      clearError();
      const response = await api.clearAlarm(alarmId);
      if (response.status == 200) {
        await get().getAlarm();
        showMessage("success", "Alarm cleared successfully!");
      }
    } catch (error) {
      console.log("clear alarm failed : ", error);
      showMessage("error", "Failed to cleared alarm.");
      setError(error.message);
    } finally {
      set((state) => ({
        isClearLoading: { ...state.isClearLoading, [alarmId]: false },
      }));
    }
  },
}));
