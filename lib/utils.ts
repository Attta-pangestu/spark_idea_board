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
let rotationLayer: number | undefined;

export function canvasModeToString(mode: ICanvasMode): string {
  switch (mode) {
    case ICanvasMode.None:
      return "None";
    case ICanvasMode.Pressing:
      return "Drawing";
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
    case ICanvasMode.Selecting:
      return "Selecting";
    default:
      return "";
  }
}

export const selectedBoxsCoordinate = (layers: ILayerType[]): XYWH => {
  const firstSelected = layers[0];

  if (!firstSelected) return { x: 0, y: 0, width: 0, height: 0, rotation: 0 };

  layers.map((layer, index) => {
    const { x, y, width, height, rotation } = layer;

    if (index === 0) {
      left = x;
      right = x + width;
      top = y;
      bottom = y + height;
      rotationLayer = rotation;
    } else {
      left = Math.min(left, x);
      right = Math.max(right, x + width);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y + height);
      rotationLayer = rotation;
    }
  });

  const padding = 0;
  return {
    x: left - padding,
    y: top - padding,
    width: right - left + padding * 2,
    height: bottom - top + padding * 2,
    rotation: rotationLayer,
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
    results.width = Math.abs(
      boxCoordinate.width +
        cursorRelative.x -
        (boxCoordinate.x + boxCoordinate.width)
    );
  }

  // bottom left
  if (corner === ISide.Left + ISide.Bottom) {
    results.height = Math.abs(
      boxCoordinate.height +
        cursorRelative.y -
        (boxCoordinate.y + boxCoordinate.height)
    );
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
      boxCoordinate.height +
        (cursorRelative.y - (boxCoordinate.y + boxCoordinate.height))
    );
  }

  return results;
};

export const getCenterFromLayer = (boxCoordinate: XYWH): IPoints => {
  return {
    x: boxCoordinate.x + boxCoordinate.width / 2,
    y: boxCoordinate.y + boxCoordinate.height / 2,
  };
};

export const convertNormalToRotationPosition = (
  cx: number,
  cy: number,
  x: number,
  y: number,
  angle: number
): IPoints => {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) - sin * (y - cy) + cx;
  const ny = sin * (x - cx) + cos * (y - cy) + cy;
  return { x: nx, y: ny };
};

export const calculateRotationAngle = (
  centerX: number,
  centerY: number,
  current: IPoints
): number => {
  // Calculate the angle between the center of rotation and the current pointer position
  const deltaX = current.x - centerX;
  const deltaY = current.y - centerY;

  const angle = Math.atan2(deltaY, deltaX);

  // Convert the angle from radians to degrees
  return (angle * 180) / Math.PI;
};
