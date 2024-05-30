import {
  ICamera,
  ICanvasMode,
  ILayerType,
  IPoints,
  ISide,
  XYWH,
} from "@/types/canvas";
import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export const deltaPointEventToCamera = (
  e: React.PointerEvent,
  camera: ICamera
): ICamera => {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

let left: number;
let right: number;
let top: number;
let bottom: number;

export function canvasModeToString(mode: ICanvasMode): string {
  switch (mode) {
    case ICanvasMode.None:
      return "Seleting";
    case ICanvasMode.Pressing:
      return "Pressing";
    case ICanvasMode.SelectionNet:
      return "SelectionNet";
    case ICanvasMode.Translating:
      return "Translating";
    case ICanvasMode.Inserting:
      return "Inserting";
    case ICanvasMode.Resizing:
      return "Resizing";
    case ICanvasMode.Pencil:
      return "Pencil";
    default:
      return ""; //
  }
}

export const selectedBoxsCoordinate = (layers: ILayerType[]): XYWH => {
  const firstSelected = layers[0];

  if (!firstSelected) return { x: 0, y: 0, width: 0, height: 0 };

  layers.map((layer, index) => {
    const { x, y, width, height } = layer;

    if (index === 0) {
      left = x;
      right = x + width;
      top = y;
      bottom = y + height;
    } else {
      left = Math.min(left, x);
      right = Math.max(right, x + width);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y + height);
    }
  });

  const padding = 4;
  return {
    x: left - padding,
    y: top - padding,
    width: right - left + padding * 2,
    height: bottom - top + padding * 2,
  };
};

export const resizeSelectedBox = (
  boxCoordinate: XYWH,
  corner: ISide,
  cursorRelative: IPoints
): XYWH => {
  let results = {
    x: boxCoordinate.x,
    y: boxCoordinate.y,
    width: boxCoordinate.width,
    height: boxCoordinate.height,
  };
  // top right
  if (corner === ISide.Right + ISide.Top) {
    results.y = cursorRelative.y;
    results.height = Math.abs(
      boxCoordinate.y + boxCoordinate.height - results.y
    );
  }
  // right bottom
  if (corner === ISide.Right + ISide.Bottom) {
    results.x = cursorRelative.x;
    results.width = Math.abs(
      boxCoordinate.width - cursorRelative.x + boxCoordinate.x
    );
  }

  // bottom left
  if (corner === ISide.Left + ISide.Bottom) {
    results.y = cursorRelative.y;
    results.height = Math.abs(cursorRelative.y - boxCoordinate.y);
  }
  // left top
  if (corner === ISide.Left + ISide.Top) {
    results.x = Math.min(
      cursorRelative.x,
      boxCoordinate.x + boxCoordinate.width
    );
    results.width = Math.abs(cursorRelative.x - boxCoordinate.x);
  }

  // ============== Corner ================

  //corner top
  if (corner === ISide.Top) {
    results.x = cursorRelative.x;
    results.width = Math.abs(
      boxCoordinate.width + boxCoordinate.x - cursorRelative.x
    );
    results.y = cursorRelative.y;
    results.height = Math.abs(
      boxCoordinate.y + boxCoordinate.height - results.y
    );
  }

  // corner left
  if (corner === ISide.Left) {
    results.x = cursorRelative.x;
    results.width = Math.abs(
      boxCoordinate.width - cursorRelative.x + boxCoordinate.x
    );
    results.height = Math.abs(
      boxCoordinate.height +
        (cursorRelative.y - (boxCoordinate.y + boxCoordinate.height))
    );
  }
  // corner right
  if (corner === ISide.Right) {
    results.width = Math.abs(
      boxCoordinate.width +
        cursorRelative.x -
        (boxCoordinate.x + boxCoordinate.width)
    );

    results.y = cursorRelative.y;
    results.height = Math.abs(
      boxCoordinate.height + (boxCoordinate.y - cursorRelative.y)
    );
  }

  // corner Bottom
  if (corner === ISide.Bottom) {
    results.width = Math.abs(
      boxCoordinate.width +
        cursorRelative.x -
        (boxCoordinate.x + boxCoordinate.width)
    );
    results.height = Math.abs(
      boxCoordinate.height + (cursorRelative.y - boxCoordinate.y)
    );
  }

  // if (corner === (ISide.Right || ISide.Bottom)) {
  //   results.x = cursorRelative.x;
  //   results.width = Math.abs(
  //     boxCoordinate.width + boxCoordinate.x - cursorRelative.x
  //   );
  //   results.y = cursorRelative.y;
  //   results.height = Math.abs(
  //     boxCoordinate.y + boxCoordinate.height - results.y
  //   );
  // }

  return results;
};
