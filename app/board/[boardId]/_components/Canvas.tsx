"use client";

import { useEffect, useState } from "react";
import { BoardInfo } from "./BoardInfo";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useSelf,
} from "@/liveblocks.config";
import { ICanvasMode, ICanvasState } from "@/types/canvas";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  const info = useSelf((me: any) => me.info);
  const [canvasState, setCanvasState] = useState<ICanvasState>({
    mode: ICanvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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
    </main>
  );
};
