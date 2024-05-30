"use client";
import { connectionIdToColor } from "@/lib/utils";
import { useOther } from "@/liveblocks.config";
import { ICanvasMode } from "@/types/canvas";
import { MousePointer2 } from "lucide-react";
import { memo, useEffect } from "react";

interface ICursor {
  connectionId: number;
}

interface IInfo {
  name?: string;
  picture?: string;
}

export const Cursor = ({ connectionId }: ICursor) => {
  const presence = useOther(connectionId, (user) => user.presence);
  const info: any = useOther(connectionId, (user) => user.info);

  if (!presence || !info) return null;

  const { cursor } = presence || {};
  const { x, y } = cursor || {};

  const name = info?.name || "Anonymous";

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px) `,
      }}
      height={50}
      width={name.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: connectionIdToColor(connectionId),
          color: connectionIdToColor(connectionId),
        }}
      />
    </foreignObject>
  );
};
