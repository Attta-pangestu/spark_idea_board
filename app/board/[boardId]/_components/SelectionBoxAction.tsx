"use client";

import React, { memo } from "react";
import {
  ICanvasMode,
  ILayerEnum,
  ILayerType,
  ISide,
  XYWH,
} from "@/types/canvas";
import { useSelf, useStorage } from "@/liveblocks.config";
import { selectedBoxsCoordinate } from "@/lib/utils";
import { Move, Trash2 } from "lucide-react";
import { ResizeBox } from "@/components/layer/ResizeAction";
import { RotationAction } from "@/components/layer/RotationAction";

interface ISelectionBoxMenu {
  onResizePointerDownHandler: (
    side: ISide,
    initialPosition: XYWH,
    e: React.PointerEvent
  ) => void;
  onResizePointerUpHandler: (e: React.PointerEvent) => void;
  onDeleteLayerHandler: (layerId: string) => void;
  onTranlateLayer?: (layerId: string) => void;
  onRotatingLayer: (layerId: string, currentAngle: number) => void;
}

export const SelectionBoxAction = memo(
  ({
    onResizePointerDownHandler,
    onResizePointerUpHandler,
    onDeleteLayerHandler,
    onTranlateLayer,
    onRotatingLayer,
  }: ISelectionBoxMenu) => {
    const selectedLayerIdBySelf: string[] = useSelf((me) =>
      me.presence.selection.length > 0 ? me.presence.selection : []
    );
    // return selected layer id
    const layerId = useSelf((me) =>
      me.presence.selection.length > 0 ? me.presence.selection[0] : undefined
    );

    // getting selection coordinate
    const boxCoordinate: XYWH = useStorage((root) => {
      // check selected layer id
      if (selectedLayerIdBySelf.length === 0)
        return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };
      // check type of layer not includes path
      const selectedLayers: ILayerType[] = selectedLayerIdBySelf.map(
        (layerId) => {
          return root.layers.get(layerId)!;
        }
      );
      const coordinate: XYWH = selectedBoxsCoordinate(selectedLayers);

      return coordinate;
    });

    if (!boxCoordinate || !layerId) return null;

    const IconBox = ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: (layerId: string) => void;
    }) => {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick?.(layerId);
          }}
          className=" p-2 rounded-md shadow-sm text-white hover:text-black bg-transparent hover:bg-white border border-white "
        >
          {children}
        </button>
      );
    };

    const LayerRendered = () => {
      const { width, height, x, y, rotation } = boxCoordinate;
      return (
        <rect
          className=" fill-transparent stroke-blue-500 stroke-[5px] pointer-events-none"
          x={0}
          y={0}
          width={width}
          height={height}
          style={{
            transform: `translate(${x}px, ${y}px)  rotate(${rotation}deg)`,
          }}
        />
      );
    };

    return (
      <>
        <LayerRendered />
        <ResizeBox
          boxCoordinate={boxCoordinate}
          onResizePointerDownHandler={onResizePointerDownHandler}
          onResizePointerUpHandler={onResizePointerUpHandler}
        />

        <RotationAction
          boxCoordinate={boxCoordinate}
          layerId={layerId}
          onRotatingLayerHandler={onRotatingLayer}
        />

        <foreignObject
          x={boxCoordinate.x + boxCoordinate.width / 2 - 100}
          y={boxCoordinate.y - 90}
          width={200}
          height={50}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <div className=" bg-black p-1  rounded-md flex items-center justify-center gap-2">
            <IconBox onClick={onDeleteLayerHandler}>
              <Trash2 className="w-6 h-6 cursor-pointer " />{" "}
            </IconBox>
            <IconBox onClick={onTranlateLayer}>
              <Move className="w-6 h-6 cursor-pointer " />{" "}
            </IconBox>
          </div>
        </foreignObject>
      </>
    );
  }
);

SelectionBoxAction.displayName = "ResizeSelectionBox";
