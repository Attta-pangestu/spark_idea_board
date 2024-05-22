"use client";

import { useCallback, useEffect, useState } from "react";
import { BoardInfo } from "./BoardInfo";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
} from "@/liveblocks.config";
import { ICamera, ICanvasMode, ICanvasState } from "@/types/canvas";
import { MousePresenceOtherUsers } from "./MousePresenceOtherUser";
import { deltaPointEventToCamera } from "@/lib/utils";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  const info = useSelf((me: any) => me.info);

  const [canvasState, setCanvasState] = useState<ICanvasState>({
    mode: ICanvasMode.None,
  });

  const [camera, setCamera] = useState<ICamera>({ x: 0, y: 0 });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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
      <svg className="h-[100vh] w-[100vw]" onPointerMove={onPointerMove}>
        <g>
          <MousePresenceOtherUsers />
        </g>
      </svg>
    </main>
  );
};
