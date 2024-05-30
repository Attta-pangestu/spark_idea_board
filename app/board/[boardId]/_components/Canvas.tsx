"use client";

import { LiveObject } from "@liveblocks/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BoardInfo } from "./BoardInfo";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@/liveblocks.config";
import {
  ICamera,
  ICanvasMode,
  ICanvasState,
  Icolor,
  ILayerEnum,
  ILayerType,
  IPoints,
  ISide,
  XYWH,
} from "@/types/canvas";
import { MousePresenceOtherUsers } from "./Mouse/MousePresenceOtherUser";
import {
  connectionIdToColor,
  deltaPointEventToCamera,
  resizeSelectedBox,
} from "@/lib/utils";
import { nanoid } from "nanoid";
import { LayerPreview } from "./LayerPreview";
import { ResizeSelectionBox } from "./ResizeSelectionBox";
import { MousePresenceSelf } from "./Mouse/MousePresenceSelf";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  const [camera, setCamera] = useState<ICamera>({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<IPoints>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Icolor>({
    r: 1,
    g: 32,
    b: 78,
  });

  const [canvasState, setCanvasState] = useState<ICanvasState>({
    mode: ICanvasMode.None,
  });

  // ===================================== HOOKS =================
  const layerIds = useStorage((root) => root.layerIds);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Selection for other users
  const usersSelection = useOthersMapped((other) => other.presence.selection);
  // ===================================== HOOKS ================================

  // ===================================== MEMO ================================
  const selectionColor = useMemo(() => {
    const layerAndColorRecord: Record<string, string> = {};
    ({ layerAndColorRecord });
    for (const userInfo of usersSelection) {
      const [connectionId, selection] = userInfo;
      for (const layerId of selection) {
        layerAndColorRecord[layerId] = connectionIdToColor(connectionId);
      }
      return layerAndColorRecord;
    }
  }, [usersSelection]);

  // ===================================== MEMO ================================

  // ===================================== Cnavas State Mode Handler ================================

  const insertingLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | ILayerEnum.Rectangle
        | ILayerEnum.Circle
        | ILayerEnum.Text
        | ILayerEnum.Note,
      position: IPoints
    ) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();

      const layer = new LiveObject({
        typeLayer: layerType,
        x: position.x,
        y: position.y,
        height: 150,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    },
    [lastUsedColor]
  );

  const resizingLayer = useMutation(
    ({ storage, self }, resizeCursor: IPoints) => {
      if (canvasState.mode !== ICanvasMode.Resizing) return;

      const resizedCoordinate = resizeSelectedBox(
        canvasState.initialBoxCoordinate,
        canvasState.corner,
        resizeCursor
      );
      const liveLayers = storage.get("layers");
      const selectedLayer = liveLayers.get(self.presence.selection[0]);
      if (selectedLayer) selectedLayer.update(resizedCoordinate);
    },
    [canvasState]
  );

  // ===================================== Canvas State Mode Handler ================================

  // ===================================== Layer Handler ================================
  const onDeleteLayerHandler = useMutation(({ storage }, layerId: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.delete(layerId);
    console.log("Berhasil menghapus layer");
  }, []);

  // ===================================== Layer Handler ================================

  // ===================================== Handler ================================

  const onWheelHandler = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const relativePointCamera: IPoints = deltaPointEventToCamera(e, camera);
      const absolutePoint = { x: e.clientX, y: e.clientY };
      setMyPresence({ cursor: relativePointCamera });
      const pointerCoordinate = deltaPointEventToCamera(e, camera);
      setCursorPosition(pointerCoordinate);

      if (canvasState.mode === ICanvasMode.Resizing) {
        const { initialBoxCoordinate, corner } = canvasState;
        resizingLayer(relativePointCamera);
      }
    },
    [canvasState]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({ self }, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const point = deltaPointEventToCamera(e, camera);
      const selectionLayer = self.presence.selection[0];
      console.log({ selectionLayer });
      if (canvasState.mode === ICanvasMode.Inserting) {
        insertingLayer(canvasState.LayerType, point);
        setCanvasState({ mode: ICanvasMode.Translating, current: point });
      } else if (canvasState.mode === ICanvasMode.Resizing) {
        console.log("some function to save resize to presence");
      }
      history.resume();
    },
    [camera, canvasState, history, insertingLayer]
  );

  const onPointerDownHandler = useMutation(
    ({ setMyPresence, self }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === ICanvasMode.Pencil ||
        canvasState.mode === ICanvasMode.Inserting
      ) {
        return null;
      }

      history.pause();
      e.stopPropagation();
      e.preventDefault();

      // update cursor position
      const pointerCoordinate = deltaPointEventToCamera(e, camera);
      setCursorPosition(pointerCoordinate);

      // if pointer on canvas
      if (layerId === "canvas") {
        setCanvasState({ mode: ICanvasMode.None });
        setMyPresence({ selection: [] });
        console.log("Remove All Mode.......");
      }
      // only select one layer
      else if (!self.presence.selection.includes(layerId)) {
        setCanvasState({
          mode: ICanvasMode.Translating,
          current: pointerCoordinate,
        });
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      } else {
        setCanvasState({ mode: ICanvasMode.None });
        setMyPresence({ selection: [] });
      }
    },
    [setCanvasState, camera, history, canvasState]
  );

  const onResizePointerDownHandler = useMutation(
    (
      { setMyPresence },
      corner: ISide,
      initialBoxCoordinate: XYWH,
      e: React.PointerEvent
    ) => {
      e.preventDefault();
      e.stopPropagation();
      history.pause();
      if (canvasState.mode === ICanvasMode.Resizing) {
        console.log("Selesai Resizing");
        setCanvasState({ mode: ICanvasMode.None });
        setMyPresence({ selection: [] });
      } else {
        setCanvasState({
          mode: ICanvasMode.Resizing,
          initialBoxCoordinate,
          corner,
        });
      }
    },
    [history, canvasState]
  );

  // ===================================== Handler ================================

  // ===================================== Check Canvas Stat ================================
  useEffect(() => {
    console.log("canvasState updated:", canvasState);
  }, [canvasState]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none ">
      <BoardInfo boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <svg
        className="h-[100vh] w-[100vw] cursor-none"
        onPointerMove={onPointerMove}
        onWheel={onWheelHandler}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        onPointerDown={(e) => onPointerDownHandler(e, "canvas")}
      >
        <g transform={`translate(${camera.x} ${camera.y})`}>
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onPressedDown={onPointerDownHandler}
              usedColor={lastUsedColor}
              selectionColor={selectionColor?.[layerId]}
            />
          ))}
          <MousePresenceOtherUsers />
          <MousePresenceSelf
            canvasMode={canvasState.mode}
            cursor={cursorPosition}
          />

          {(canvasState.mode === ICanvasMode.Translating ||
            canvasState.mode === ICanvasMode.Resizing) && (
            <ResizeSelectionBox
              onResizePointerDownHandler={onResizePointerDownHandler}
              onResizePointerUpHandler={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDeleteLayerHandler={onDeleteLayerHandler}
            />
          )}
          {/* <ResizeSelectionBox
            onResizePointerDownHandler={onResizePointerDownHandler}
            onResizePointerUpHandler={() => {}}
          /> */}
        </g>
      </svg>
    </main>
  );
};
