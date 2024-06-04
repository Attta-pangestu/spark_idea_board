import { getCenterFromLayer } from "@/lib/utils";
import { ILayerType, IRectangleLayer } from "@/types/canvas";
import { CircleChevronUp, MoveUp } from "lucide-react";
import rgbHex from "rgb-hex";

interface IRectangleShape {
  layerId: string;
  layerProps: IRectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const RectangleShape = ({
  layerId,
  layerProps,
  onPointerDown,
  selectionColor,
}: IRectangleShape) => {
  const { x, y, width, height, fill, rotation } = layerProps;

  const centerPoint = getCenterFromLayer(layerProps);
  console.log({ centerPoint });

  return (
    <>
      <rect
        className="drop-shadow-md"
        x={x}
        y={y}
        style={{
          transformOrigin: `${centerPoint.x}px ${centerPoint.y}px`,
          transform: `rotate(${rotation}deg)`,
        }}
        width={width}
        height={height}
        strokeWidth={selectionColor ? 3 : 1}
        fill={`#${rgbHex(fill.r, fill.g, fill.b)}`}
        stroke={selectionColor ?? "transparent"}
        onPointerDown={(e) => onPointerDown(e, layerId)}
      />

      {/* <circle cx={centerPoint.x} cy={centerPoint.y} r={16} fill="red" /> */}
    </>
  );
};
