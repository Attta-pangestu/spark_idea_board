"use cl";

import { useStorage } from "@/liveblocks.config";
import React, { memo } from "react";
import { ILayerEnum, ILayerType } from "@/types/canvas";
import { RectangleShape } from "./LayerType/Rectangle";

interface ILayerPreview {
  id: string;
  selectionColor: string | undefined;
  onPressedDown: (e: React.PointerEvent, id: string) => void;
  usedColor?: string;
}

export const LayerPreview = memo(
  ({ id, selectionColor, onPressedDown }: ILayerPreview) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    switch (layer.typeLayer) {
      case ILayerEnum.Rectangle:
        return (
          <RectangleShape
            key={id}
            layerId={id}
            layerProps={layer}
            onPointerDown={onPressedDown}
            selectionColor={
              selectionColor === undefined ? "#000" : selectionColor
            }
          />
        );
      default:
        console.log("unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
