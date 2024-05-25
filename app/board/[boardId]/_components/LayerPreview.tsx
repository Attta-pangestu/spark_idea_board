"use cl";

import { useStorage } from "@/liveblocks.config";
import React, { memo } from "react";
import { ILayerEnum, ILayerType } from "@/types/canvas";
import { RectangleShape } from "./LayerType/Rectangle";

interface ILayerPreview {
  id: string;
  selectionColor: string;
  onPressedDown: (e: React.PointerEvent, id: string) => void;
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
            id={id}
            layerProps={layer}
            onPointerDown={onPressedDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.log("unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
