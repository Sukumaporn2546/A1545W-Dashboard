import { create } from "zustand";
export const useMessageStore = create((set) => ({
  messageData: null,
  showMessage: (status, text) =>
    set({
      messageData: { status, text },
    }),
  clearMessage: () => set({ messageData: null }),
}));
