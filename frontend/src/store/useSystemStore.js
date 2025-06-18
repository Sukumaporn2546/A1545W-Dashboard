import { create } from "zustand";
export const useSystemStore = create((set) => ({
  messageData: null,
  openAlertPanel: false,
  compareHumid_mode: false,
  compareTemp_mode: false,
  setOpenAlertPanel: (isOpen) => set({ openAlertPanel: isOpen }),
  setCompareTempMode: (mode) => set({ compareTemp_mode: mode }),
  setCompareHumidMode: (mode) => set({ compareHumid_mode: mode }),
}));
