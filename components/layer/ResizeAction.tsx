import { IPoints, ISide, XYWH } from "@/types/canvas";

interface IResizingHelper {
  boxCoordinate: XYWH;
  onResizePointerDownHandler: (
    side: ISide,
    initialPosition: XYWH,
    e: React.PointerEvent
  ) => void;
  onResizePointerUpHandler?: (e: React.PointerEvent) => void;
}

const HANDLE_WIDTH = 10;

const rotatePoint = (
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

export const ResizeBox = ({
  boxCoordinate,
  onResizePointerDownHandler,
  onResizePointerUpHandler,
}: IResizingHelper) => {
  const { x, y, width, height, rotation } = boxCoordinate;
  const centerX = x;
  const centerY = y;

  const handles = [
    { x: x, y: y },
    { x: x + width / 2, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height / 2 },
    { x: x + width, y: y + height },
    { x: x + width / 2, y: y + height },
    { x: x, y: y + height },
    { x: x, y: y + height / 2 },
  ];

  const rotatedHandles = handles.map((handle) =>
    rotatePoint(centerX, centerY, handle.x, handle.y, rotation ?? 0)
  );

  // Pemetaan sisi ke indeks setelah rotasi
  const getSideFromIndex = (index: number) => {
    switch (index) {
      case 0:
        return ISide.Top + ISide.Left;
      case 1:
        return ISide.Top;
      case 2:
        return ISide.Top + ISide.Right;
      case 3:
        return ISide.Right;
      case 4:
        return ISide.Right + ISide.Bottom;
      case 5:
        return ISide.Bottom;
      case 6:
        return ISide.Bottom + ISide.Left;
      case 7:
        return ISide.Left;
      default:
        return ISide.Top;
    }
  };

  return (
    <>
      {rotatedHandles.map((handle, index) => (
        <rect
          key={index}
          className="fill-transparent stroke-blue-500 stroke-[3px]"
          x={handle.x - HANDLE_WIDTH / 2}
          y={handle.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH}
          height={HANDLE_WIDTH}
          style={{ cursor: "nwse-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            const side = getSideFromIndex(index);
            onResizePointerDownHandler(side, boxCoordinate, e);
          }}
          onPointerUp={onResizePointerUpHandler}
        />
      ))}
    </>
  );
};
