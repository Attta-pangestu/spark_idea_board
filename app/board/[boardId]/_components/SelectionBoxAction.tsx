"use client";

import React, { memo } from "react";
import {
  ICanvasMode,
  ILayerEnum,
  ILayerType,
  IPoints,
  ISide,
  XYWH,
} from "@/types/canvas";
import { useSelf, useStorage } from "@/liveblocks.config";
import {
  convertNormalToRotationPosition,
  getCenterFromLayer,
  selectedBoxsCoordinate,
} from "@/lib/utils";
import { Move, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { ActionBox } from "@/components/layer/BoxAction";

interface ISelectionBoxMenu {
  onResizePointerDownHandler: (
    side: ISide,
    initialPosition: XYWH,
    e: React.PointerEvent
  ) => void;
  onResizePointerUpHandler: (e: React.PointerEvent) => void;
  onDeleteLayerHandler: (layerId: string) => void;
  onTranlateLayer?: (layerId: string) => void;
  onRotatingLayer: (
    layerId: string,
    currentAngle: number,
    center: IPoints
  ) => void;
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

    const centerBoxCoordinate = getCenterFromLayer(boxCoordinate);
    // const centerRotatePosition = convertNormalToRotationPosition(centerBoxCoordinate.x, centerBoxCoordinate.y)

    const IconBox = ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: (
        layerId: string,
        currentAngle: number,
        center: IPoints
      ) => void;
    }) => {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClick?.(
              layerId,
              boxCoordinate.rotation ?? 0,
              centerBoxCoordinate
            );
          }}
          className=" p-2 rounded-md shadow-sm text-white hover:text-black bg-transparent hover:bg-white border border-white "
        >
          {children}
        </button>
      );
    };

    const SelectionBox = () => {
      const { width, height, x, y, rotation } = boxCoordinate;
      return (
        <rect
          className=" fill-transparent stroke-blue-500 stroke-[5px] pointer-events-none"
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            transformOrigin: `${centerBoxCoordinate.x}px ${centerBoxCoordinate.y}px`,
            transform: `rotate(${rotation}deg)`,
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onTranlateLayer?.(layerId);
          }}
        />
      );
    };

    return (
      <>
        <SelectionBox />
        <ActionBox
          boxCoordinate={boxCoordinate}
          onResizePointerDownHandler={onResizePointerDownHandler}
          onResizePointerUpHandler={onResizePointerUpHandler}
          onRotatePointerDownHandler={onRotatingLayer}
        />
        <Plus
          x={centerBoxCoordinate.x - 18}
          y={centerBoxCoordinate.y - 18}
          width={36}
          height={36}
          className="text-red-500 fill-red-500"
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
            <IconBox onClick={onRotatingLayer}>
              <RefreshCcw className="w-6 h-6 cursor-pointer " />{" "}
            </IconBox>
          </div>
        </foreignObject>
      </>
    );
  }
);

SelectionBoxAction.displayName = "ResizeSelectionBox";
