import { ILayerType, IRectangleLayer } from "@/types/canvas";

interface IRectangleShape {
  id: string;
  layerProps: IRectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const RectangleShape = ({
  id,
  layerProps,
  onPointerDown,
  selectionColor,
}: IRectangleShape) => {
  const { x, y, width, height, fill } = layerProps;

  console.log({});

  return (
    <rect
      className="drop-shadow-md"
      // style={{ transform: `translate(${x}px, ${y}px)` }}
      x={x}
      y={y}
      width={width}
      height={height}
      strokeWidth={1}
      fill="#000"
      stroke={"transparent"}
      onPointerDown={(e) => onPointerDown(e, id)}
    />
  );
};
