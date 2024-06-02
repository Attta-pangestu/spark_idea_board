import { ICanvasMode, ICanvasState } from "@/types/canvas";
import { create } from "zustand";

interface IUseCanvasState {
  canvasState: ICanvasState;
  setCanvasState: (state: ICanvasState) => void;
}

export const useCanvasState = create<IUseCanvasState>((set) => ({
  canvasState: {
    mode: ICanvasMode.None,
  },
  setCanvasState: (state) => set({ canvasState: state }),
}));
