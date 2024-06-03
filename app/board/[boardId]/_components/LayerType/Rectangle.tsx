import { ILayerType, IRectangleLayer } from "@/types/canvas";
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
  console.log(rotation);

  return (
    <rect
      className="drop-shadow-md"
      x={0}
      y={0}
      style={{ transform: `translate(${x}px, ${y}px)  rotate(${rotation}deg)` }}
      width={width}
      height={height}
      strokeWidth={selectionColor ? 3 : 1}
      fill={`#${rgbHex(fill.r, fill.g, fill.b)}`}
      stroke={selectionColor ?? "transparent"}
      onPointerDown={(e) => onPointerDown(e, layerId)}
    />
  );
};
