import { create } from "zustand";

export const useEditorSizeStore = create((set) => ({
  isFullscreen: false,
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}));