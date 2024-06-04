"use client";

import React, { memo, useState } from "react";
import { SketchPicker } from "react-color";
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
import { Move, Palette, Plus, RefreshCcw, Trash2 } from "lucide-react";
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
  onColorChange: (layerId: string, color: string) => void;
}

export const SelectionBoxAction = memo(
  ({
    onResizePointerDownHandler,
    onResizePointerUpHandler,
    onDeleteLayerHandler,
    onTranlateLayer,
    onRotatingLayer,
    onColorChange,
  }: ISelectionBoxMenu) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#fff");

    const selectedLayerIdBySelf: string[] = useSelf((me) =>
      me.presence.selection.length > 0 ? me.presence.selection : []
    );

    const layerId = useSelf((me) =>
      me.presence.selection.length > 0 ? me.presence.selection[0] : undefined
    );

    const boxCoordinate: XYWH = useStorage((root) => {
      if (selectedLayerIdBySelf.length === 0)
        return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };

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
          className="p-2 rounded-md shadow-sm text-white hover:text-black bg-transparent hover:bg-white border border-white"
        >
          {children}
        </button>
      );
    };

    const SelectionBox = () => {
      const { width, height, x, y, rotation } = boxCoordinate;
      return (
        <rect
          className="fill-transparent stroke-blue-500 stroke-[5px] pointer-events-none"
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

    const handleColorChange = (color: any) => {
      setCurrentColor(color.hex);
      onColorChange(layerId, color.hex);
    };

    return (
      <>
        <SelectionBox />
        <ActionBox
          boxCoordinate={boxCoordinate}
          onResizePointerDownHandler={onResizePointerDownHandler}
          onResizePointerUpHandler={onResizePointerUpHandler}
          onRotatePointerDownHandler={() =>
            onRotatingLayer(
              layerId,
              boxCoordinate?.rotation ?? 0,
              centerBoxCoordinate
            )
          }
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
          className="relative"
        >
          <div className="bg-black p-1 rounded-md flex items-center justify-center gap-2">
            <IconBox onClick={onDeleteLayerHandler}>
              <Trash2 className="w-6 h-6 cursor-pointer" />{" "}
            </IconBox>
            <IconBox onClick={onTranlateLayer}>
              <Move className="w-6 h-6 cursor-pointer" />{" "}
            </IconBox>
            <IconBox onClick={onRotatingLayer}>
              <RefreshCcw className="w-6 h-6 cursor-pointer" />{" "}
            </IconBox>
            <IconBox onClick={() => setDisplayColorPicker(!displayColorPicker)}>
              <Palette className="w-6 h-6 cursor-pointer" />{" "}
            </IconBox>
          </div>
        </foreignObject>

        {displayColorPicker ? (
          <foreignObject
            x={boxCoordinate.x + boxCoordinate.width / 2 - 100 + 200}
            y={boxCoordinate.y - 250 - 50}
            width={200}
            height={250}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="relative cursor-pointer"
          >
            <div style={{ position: "absolute", zIndex: 2 }}>
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                }}
                onClick={() => setDisplayColorPicker(false)}
              />
              <SketchPicker color={currentColor} onChange={handleColorChange} />
            </div>
          </foreignObject>
        ) : null}
      </>
    );
  }
);

SelectionBoxAction.displayName = "ResizeSelectionBox";
