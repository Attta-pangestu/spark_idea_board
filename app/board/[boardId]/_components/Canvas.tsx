"use client";

import { LiveObject } from "@liveblocks/client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { CurlyBraces } from "lucide-react";
import { create } from "zustand";

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

  const svgRef = useRef<SVGSVGElement | null>(null);

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

  const translatingLayer = useMutation(
    ({ storage, self }, cursorPosition: IPoints) => {
      if (canvasState.mode !== ICanvasMode.Translating) return;
      const { current } = canvasState;
      const offset: IPoints = {
        x: cursorPosition.x - current.x,
        y: cursorPosition.y - current.y,
      };

      const liveLayers = storage.get("layers");

      const selectedLayer = liveLayers.get(self.presence.selection[0]);
      if (!selectedLayer) return;

      selectedLayer.update({
        x: selectedLayer.get("x") + offset.x,
        y: selectedLayer.get("y") + offset.y,
      });
    },
    [canvasState]
  );

  const updateMoveConditionalHandler = useMutation(
    async ({ setMyPresence }, e: React.PointerEvent) => {
      const relativePointCamera: IPoints = deltaPointEventToCamera(e, camera);
      setMyPresence({ cursor: relativePointCamera });
      if (canvasState.mode === ICanvasMode.Resizing) {
        resizingLayer(relativePointCamera);
      } else if (canvasState.mode === ICanvasMode.Translating) {
        translatingLayer(relativePointCamera);
      }
    },
    [canvasState, camera, resizingLayer, translatingLayer, cursorPosition]
  );

  // ===================================== Canvas State Mode Handler ================================

  // ===================================== Utility ================================
  const getSvgCoords = (e: React.PointerEvent) => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const point: any = svg?.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgCoords = point.matrixTransform(svg?.getScreenCTM()?.inverse());
      return svgCoords;
    }
    return { x: 0, y: 0 };
  };

  // ===================================== Utility ================================

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
        insertingLayer(canvasState.LayerType, point);
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
      } else {
        setCanvasState({
          mode: ICanvasMode.Translating,
          current: pointerCoordinate,
        });
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
          />

          {(canvasState.mode === ICanvasMode.Selecting ||
            canvasState.mode === ICanvasMode.Translating ||
            canvasState.mode === ICanvasMode.Resizing) && (
            <ResizeSelectionBox
              onResizePointerDownHandler={onResizePointerDownHandler}
              onResizePointerUpHandler={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDeleteLayerHandler={onDeleteLayerHandler}
              onTranlateLayer={(layerId) => {
                setCanvasState({
                  mode: ICanvasMode.Translating,
                  current: {
                    x: cursorPosition.x - camera.x,
                    y: cursorPosition.y - camera.y,
                  },
                });
              }}
            />
          )}
        </g>
      </svg>
    </main>
  );
};
