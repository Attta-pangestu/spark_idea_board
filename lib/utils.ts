import { ICamera, ILayerType, XYWH } from "@/types/canvas";
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
