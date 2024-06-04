"use client";

import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  calculateRotationAngle,
  connectionIdToColor,
  deltaPointEventToCamera,
  resizeSelectedBox,
} from "@/lib/utils";
import { nanoid } from "nanoid";
import { LayerPreview } from "./LayerPreview";
import { SelectionBoxAction } from "./SelectionBoxAction";
import { MousePresenceSelf } from "./Mouse/MousePresenceSelf";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  const [camera, setCamera] = useState<ICamera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Icolor>({
    r: 1,
    g: 32,
    b: 78,
  });
  const [cursorPosition, setCursorPosition] = useState<IPoints>({
    x: 0,
    y: 0,
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
      position: IPoints,
      rotation: number
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
        rotation: 0,
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

  const translatingLayer = useMutation(
    ({ storage, self }) => {
      if (canvasState.mode !== ICanvasMode.Translating) return;
      const { current } = canvasState;
      const offset: IPoints = {
        x: cursorPosition.x - current.x,
        y: cursorPosition.y - current.y,
      };

      const liveLayers = storage.get("layers");

      const selectedLayer = liveLayers.get(self.presence.selection[0]);

      if (!selectedLayer?.get("x")) return;

      const updateLayer = {
        x: selectedLayer.get("x") + offset.x,
        y: selectedLayer.get("y") + offset.y,
      };

      selectedLayer.update({
        x: updateLayer.x,
        y: updateLayer.y,
      });

      setCanvasState({
        mode: ICanvasMode.Translating,
        current: cursorPosition,
      });
    },

    [canvasState, cursorPosition]
  );

  const rotatingLayer = useMutation(
    ({ storage }, e: React.PointerEvent) => {
      if (canvasState.mode !== ICanvasMode.Rotating) return;

      const liveLayers = storage.get("layers");
      const selectedLayer = liveLayers.get(canvasState.layerId);

      if (!selectedLayer) return;

      const layerAngle = canvasState.currentAngle;
      const initialPostion = canvasState.currentPosition;
      const currentPosition = { x: e.clientX, y: e.clientY };

      const currentAngle = calculateRotationAngle(
        canvasState.centerRotation.x,
        canvasState.centerRotation.y,
        currentPosition
      );

      console.log({ currentAngle });

      selectedLayer.update({
        rotation: currentAngle,
      });

      setCanvasState({
        mode: ICanvasMode.Rotating,
        currentAngle: currentAngle,
        currentPosition: currentPosition,
        layerId: canvasState.layerId,
        centerRotation: canvasState.centerRotation,
      });
    },
    [canvasState]
  );

  const updateColorLayer = useMutation(
    ({ storage }, layerId: string, color: string) => {
      const liveLayers = storage.get("layers");
      const selectedLayer = liveLayers.get(layerId);

      if (!selectedLayer) return;

      const rgb = color.match(/\w\w/g);
      if (!rgb) return;

      const [r, g, b] = rgb.map((c) => parseInt(c, 16));

      selectedLayer.update({
        fill: { r, g, b },
      });
    },
    []
  );

  const updateMoveConditionalHandler = useMutation(
    async ({ setMyPresence }, e: React.PointerEvent) => {
      const relativePointCamera: IPoints = deltaPointEventToCamera(e, camera);
      setMyPresence({ cursor: relativePointCamera });
      if (canvasState.mode === ICanvasMode.Resizing) {
        resizingLayer(relativePointCamera);
      } else if (canvasState.mode === ICanvasMode.Translating) {
        translatingLayer();
      } else if (canvasState.mode === ICanvasMode.Rotating) {
        rotatingLayer(e);
      }
    },
    [canvasState, camera, resizingLayer, translatingLayer, cursorPosition]
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

  const onPointerMove = useCallback(
    async (e: React.PointerEvent) => {
      await Promise.all([
        updateMoveConditionalHandler(e),
        setCursorPosition(deltaPointEventToCamera(e, camera)),
      ]);
    },
    [updateMoveConditionalHandler, camera]
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
      if (canvasState.mode === ICanvasMode.Inserting) {
        insertingLayer(canvasState.LayerType, point, 0);
        setCanvasState({ mode: ICanvasMode.Selecting });
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

      // update cursor position
      const pointerCoordinate = deltaPointEventToCamera(e, camera);

      // if pointer on canvas
      if (layerId === "canvas") {
        setCanvasState({ mode: ICanvasMode.None });
        setMyPresence({ selection: [] });
      }
      // only select one layer
      else if (!self.presence.selection.includes(layerId)) {
        setCanvasState({
          mode: ICanvasMode.Selecting,
        });
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      } else if (
        self.presence.selection.includes(layerId) &&
        canvasState.mode === ICanvasMode.Selecting
      ) {
        setCanvasState({
          mode: ICanvasMode.Translating,
          current: pointerCoordinate,
        });
      } else if (canvasState.mode === ICanvasMode.Translating) {
        setCanvasState({ mode: ICanvasMode.Selecting });
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

  const onRotationClickHandler = (
    layerId: string,
    currentAngle: number,
    center: IPoints
  ) => {
    // switching mode
    if (canvasState.mode !== ICanvasMode.Rotating) {
      setCanvasState({
        mode: ICanvasMode.Rotating,
        currentAngle: currentAngle,
        currentPosition: cursorPosition,
        centerRotation: center,
        layerId: layerId,
      });
    } else {
      setCanvasState({ mode: ICanvasMode.Selecting });
    }
  };
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
        // ref={svgRef}
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
            side={
              canvasState.mode === ICanvasMode.Resizing
                ? canvasState.corner
                : ISide.Top
            }
          />

          {(canvasState.mode === ICanvasMode.Selecting ||
            canvasState.mode === ICanvasMode.Translating ||
            canvasState.mode === ICanvasMode.Resizing) && (
            <SelectionBoxAction
              onResizePointerDownHandler={onResizePointerDownHandler}
              onResizePointerUpHandler={(e) => {
                e.stopPropagation();
              }}
              onDeleteLayerHandler={onDeleteLayerHandler}
              onTranlateLayer={() => {
                if (canvasState.mode !== ICanvasMode.Translating) {
                  setCanvasState({
                    mode: ICanvasMode.Translating,
                    current: cursorPosition,
                  });
                } else {
                  setCanvasState({ mode: ICanvasMode.Selecting });
                }
              }}
              onRotatingLayer={(layerId, currentAngle, center) =>
                onRotationClickHandler(layerId, currentAngle, center)
              }
              onColorChange={(layerId, color) =>
                updateColorLayer(layerId, color)
              }
            />
          )}
        </g>
      </svg>
    </main>
  );
};
