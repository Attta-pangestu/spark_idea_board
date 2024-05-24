"use cl";

import { useStorage } from "@/liveblocks.config";
import React, { memo } from "react";
import { ILayerEnum, ILayerType } from "@/types/canvas";

interface ILayerPreview {
  id: string;
  selectionColor: string;
  onPressedDown: (e: React.PointerEvent) => void;
}

export const LayerPreview = memo(
  ({ id, selectionColor, onPressedDown }: ILayerPreview) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    switch (layer.typeLayer) {
      case ILayerEnum.Text:
        return <div>Rectangle</div>;
      default:
        console.log("unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
