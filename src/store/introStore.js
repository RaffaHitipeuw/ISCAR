import { create } from "zustand";

export const useIntroStore = create((set) => ({
  phase: "loading",
  setPhase: (p) => set({ phase: p }),

  cameraSettled: false,
  setCameraSettled: (v) => set({ cameraSettled: v }),

  hoverZoom: false,
  setHoverZoom: (v) => set({ hoverZoom: v }),

  isExplored: false,
  setExplored: () => set({ isExplored: true, phase: "descMove" }),

  cameraKF3Mid: false,
  setCameraKF3Mid: (v) => set({ cameraKF3Mid: v }),

  rotateMode: "none", // "intro" | "next" | "prev"
  setRotateMode: (mode) => set({ rotateMode: mode }),

  divisiIndex: 0,
  nextDivisi: () =>
    set((s) => ({ divisiIndex: (s.divisiIndex + 1) % 7 })),
  prevDivisi: () =>
    set((s) => ({ divisiIndex: (s.divisiIndex + 6) % 7 })),

  goBackFromGallery: () => set({ phase: "galleryBack" }),
}));
