import { ICanvasMode, IPoints } from "@/types/canvas";
import { Cursor } from "./OthersCursor";
import { MousePointer2, Move, Scaling } from "lucide-react";
import { canvasModeToString } from "@/lib/utils";
import { noSSR } from "next/dynamic";

export const MousePresenceSelf = ({
  canvasMode,
  cursor,
}: {
  canvasMode: ICanvasMode;
  cursor: IPoints;
}) => {
  const { x, y } = cursor;

  const MouseIcon = () => {
    switch (canvasMode) {
      case ICanvasMode.Selecting:
        return (
          <MousePointer2
            className="h-7 w-7"
            style={{
              fill: "black",
              color: "red",
            }}
          />
        );

      case ICanvasMode.None:
        return (
          <MousePointer2
            className="h-7 w-7"
            style={{
              fill: "black",
              color: "red",
            }}
          />
        );

      case ICanvasMode.Translating:
        return (
          <Move
            className="h-7 w-7"
            style={{
              fill: "black",
              color: "red",
            }}
          />
        );

      case ICanvasMode.Resizing:
        return (
          <Scaling
            className="h-7 w-7"
            style={{
              fill: "black",
              color: "red",
            }}
          />
        );
    }
  };

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px) `,
      }}
      height={50}
      width={(canvasMode.toString() + "You - Mode:").length * 15 + 34}
      className="relative drop-shadow-md"
      pointerEvents="none"
    >
      <MouseIcon />

      <div className="absolute left-5 px-1.5 py-0.5 rounded-md text-sm bg-black text-white font-semibold">
        You - Mode: {canvasModeToString(canvasMode)}
      </div>
    </foreignObject>
  );
};
