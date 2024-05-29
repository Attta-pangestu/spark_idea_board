import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./ToolButton";
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { ICanvasMode, ICanvasState, ILayerEnum } from "@/types/canvas";

interface IToolbar {
  canvasState: ICanvasState;
  setCanvasState: (newState: ICanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canRedo,
  canUndo,
}: IToolbar) => {
  const ToolWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={`bg-white rounded-lg p-1.5 flex gap-y-2 flex-col items-center shadow-lg`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-2 bg-transparent  p-3 shadow-md">
      <ToolWrapper>
        <ToolButton
          label="Select"
          Icon={MousePointer2}
          onClick={() => setCanvasState({ mode: ICanvasMode.None })}
          isActive={
            canvasState.mode === ICanvasMode.None ||
            canvasState.mode === ICanvasMode.Translating ||
            canvasState.mode === ICanvasMode.SelectionNet ||
            canvasState.mode === ICanvasMode.Pressing ||
            canvasState.mode === ICanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          Icon={Type}
          onClick={() =>
            setCanvasState({
              mode: ICanvasMode.Inserting,
              LayerType: ILayerEnum.Text,
            })
          }
          isActive={
            canvasState.mode === ICanvasMode.Inserting &&
            canvasState.LayerType === ILayerEnum.Text
          }
        />
        <ToolButton
          label="Note"
          Icon={StickyNote}
          onClick={() =>
            setCanvasState({
              mode: ICanvasMode.Inserting,
              LayerType: ILayerEnum.Note,
            })
          }
          isActive={
            canvasState.mode === ICanvasMode.Inserting &&
            canvasState.LayerType === ILayerEnum.Note
          }
        />
        <ToolButton
          label="Rectangle"
          Icon={Square}
          onClick={() =>
            setCanvasState({
              mode: ICanvasMode.Inserting,
              LayerType: ILayerEnum.Rectangle,
            })
          }
          isActive={
            canvasState.mode === ICanvasMode.Inserting &&
            canvasState.LayerType === ILayerEnum.Rectangle
          }
        />

        <ToolButton
          label="Circle"
          Icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: ICanvasMode.Inserting,
              LayerType: ILayerEnum.Circle,
            })
          }
          isActive={
            canvasState.mode === ICanvasMode.Inserting &&
            canvasState.LayerType === ILayerEnum.Circle
          }
        />

        <ToolButton
          label="Pen"
          Icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: ICanvasMode.Pencil,
              LayerType: ILayerEnum.Path,
            })
          }
          isActive={
            canvasState.mode === ICanvasMode.Pencil &&
            canvasState.LayerType === ILayerEnum.Path
          }
        />
      </ToolWrapper>
      <ToolWrapper>
        <ToolButton
          label="Undo"
          Icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          Icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </ToolWrapper>
    </div>
  );
};

export const ToolbarSkeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-4 bg-slate-100 animate-pulse p-3 shadow-md">
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
    </div>
  );
};
