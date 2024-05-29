"use client";

import React, { memo } from "react";
import { ILayerEnum, ILayerType, ISide, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@/liveblocks.config";
import { selectedBoxsCoordinate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const HANDLE_WIDTH = 10;

interface ISelectionBoxMenu {
  onResizePointerDownHandler: (
    side: ISide,
    initialPosition: XYWH,
    e: React.PointerEvent
  ) => void;
  onResizePointerUpHandler?: (e: React.PointerEvent) => void;
  onDelet;
}

export const ResizeSelectionBox = memo(
  ({
    onResizePointerDownHandler,
    onResizePointerUpHandler,
  }: ISelectionBoxMenu) => {
    // return selected layer id
    const selectedLayerIdBySelf: string[] = useSelf((me) =>
      me.presence.selection.length > 0 ? me.presence.selection : []
    );

    // getting selection coordinate
    const boxCoordinate: XYWH = useStorage((root) => {
      // check selected layer id
      if (selectedLayerIdBySelf.length === 0)
        return { x: 0, y: 0, width: 0, height: 0 };
      // check type of layer not includes path
      const selectedLayers: ILayerType[] = selectedLayerIdBySelf.map(
        (layerId) => {
          return root.layers.get(layerId)!;
        }
      );
      const coordinate = selectedBoxsCoordinate(selectedLayers);

      return coordinate;
    });
    if (!boxCoordinate) return null;

    const IconBox = ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => {
      return (
        <div className=" p-2 rounded-md shadow-sm text-white hover:text-black bg-transparent hover:bg-white border border-white ">
          {children}
        </div>
      );
    };

    return (
      <>
        <rect
          className=" fill-transparent stroke-blue-500 stroke-[3px] pointer-events-none"
          x={0}
          y={0}
          width={boxCoordinate.width}
          height={boxCoordinate.height}
          style={{
            transform: `translate(${boxCoordinate.x}px, ${boxCoordinate.y}px) `,
          }}
        />
        {/* Create action box to handle resize each corner */}
        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x - HANDLE_WIDTH / 2}
          y={boxCoordinate.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nwse-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(ISide.Top, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />
        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width / 2 - HANDLE_WIDTH / 2}
          y={boxCoordinate.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "ns-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizePointerDownHandler(
              ISide.Top + ISide.Right,
              boxCoordinate,
              e
            );
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
          y={boxCoordinate.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nesw-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizePointerDownHandler(ISide.Right, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
          y={boxCoordinate.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nesw-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(ISide.Right, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />
        {/* BOTTOM SIDE */}
        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
          y={boxCoordinate.y + boxCoordinate.height / 2 - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "ew-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(
              ISide.Right + ISide.Bottom,
              boxCoordinate,
              e
            );
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
          y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nwse-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(ISide.Bottom, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x + boxCoordinate.width / 2 - HANDLE_WIDTH / 2}
          y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "ns-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(
              ISide.Bottom + ISide.Left,
              boxCoordinate,
              e
            );
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x - HANDLE_WIDTH / 2}
          y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nesw-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(ISide.Left, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />
        <rect
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={boxCoordinate.x - HANDLE_WIDTH / 2}
          y={boxCoordinate.y + boxCoordinate.height / 2 - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "ew-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizePointerDownHandler(
              ISide.Left + ISide.Top,
              boxCoordinate,
              e
            );
          }}
          onPointerUp={onResizePointerUpHandler}
        />

        <foreignObject
          x={boxCoordinate.x + boxCoordinate.width / 2 - 100}
          y={boxCoordinate.y - 90}
          width={200}
          height={60}
        >
          <div className=" bg-black p-1  rounded-md flex items-center justify-center gap-2">
            <IconBox onClick={() => {}}>
              <Trash2 className="w-6 h-6 cursor-pointer " />{" "}
            </IconBox>
            <IconBox>
              <Trash2 className="w-6 h-6 " />{" "}
            </IconBox>
            <IconBox>
              <Trash2 className="w-6 h-6 " />{" "}
            </IconBox>
          </div>
        </foreignObject>
      </>
    );
  }
);

ResizeSelectionBox.displayName = "ResizeSelectionBox";
