import { ILayerType, IRectangleLayer } from "@/types/canvas";

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
  const { x, y, width, height, fill } = layerProps;
  console.log(fill)

  return (
    <rect
      className="drop-shadow-md"
      // style={{ transform: `translate(${x}px, ${y}px)` }}
      x={x}
      y={y}
      width={width}
      height={height}
      strokeWidth={selectionColor ? 3 : 1}
      fill="#000"
      stroke={selectionColor ?? "transparent"}
      onPointerDown={(e) => onPointerDown(e, layerId)}
    />
  );
};
