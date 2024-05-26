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
} from "@/types/canvas";
import { MousePresenceOtherUsers } from "./MousePresenceOtherUser";
import { connectionIdToColor, deltaPointEventToCamera } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LayerPreview } from "./LayerPreview";
import { userInfo } from "os";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  const [canvasState, setCanvasState] = useState<ICanvasState>({
    mode: ICanvasMode.None,
  });

  const [camera, setCamera] = useState<ICamera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Icolor>({
    r: 0,
    g: 0,
    b: 0,
  });

  const layerIds = useStorage((root) => root.layerIds);

  // ===================================== HOOKS =================

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Selection for other users
  const usersSelection = useOthersMapped((other) => other.presence.selection);
  console.log({ usersSelection });
  // ===================================== HOOKS ================================

  // ===================================== MEMO ================================
  const selectionColor = useMemo(() => {
    const layerAndColorRecord: Record<string, string> = {};
    console.log({ layerAndColorRecord });
    for (const userInfo of usersSelection) {
      const [connectionId, selection] = userInfo;
      console.log({ connectionId, selection });
      for (const layerId of selection) {
        layerAndColorRecord[layerId] = connectionIdToColor(connectionId);
      }
      console.log({ layerAndColorRecord });
      return layerAndColorRecord;
    }
  }, [usersSelection]);

  // ===================================== MEMO ================================

  // ===================================== Handler ================================
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
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: ICanvasMode.None });
    },
    [lastUsedColor]
  );

  const onWheelHandler = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const deltaUpdateCamera = deltaPointEventToCamera(e, camera);
      setMyPresence({ cursor: deltaUpdateCamera });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = deltaPointEventToCamera(e, camera);

      if (canvasState.mode === ICanvasMode.Inserting) {
        insertingLayer(canvasState.LayerType, point);
      } else {
        setCanvasState({ mode: ICanvasMode.None });
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
      )
        return null;

      history.pause();
      e.stopPropagation();

      const point = deltaPointEventToCamera(e, camera);

      // if pointer on canvas
      if (canvasState.mode === ICanvasMode.None && layerId === "canvas") {
        setMyPresence({ selection: [] });
        console.log("Remove All Selection");
      }

      // only select one layer
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: ICanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  // ===================================== Handler ================================

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
        className="h-[100vh] w-[100vw]"
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
              selectionColor={selectionColor?.[layerId]}
            />
          ))}
          <MousePresenceOtherUsers />
        </g>
      </svg>
    </main>
  );
};
