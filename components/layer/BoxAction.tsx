import React from "react";
import { IPoints, ISide, XYWH } from "@/types/canvas";
import { Rotate3D } from "lucide-react";
import {
  convertNormalToRotationPosition,
  getCenterFromLayer,
} from "@/lib/utils";

interface IResizingHelper {
  boxCoordinate: XYWH;
  onResizePointerDownHandler: (
    side: ISide,
    initialPosition: XYWH,
    e: React.PointerEvent
  ) => void;
  onResizePointerUpHandler?: (e: React.PointerEvent) => void;
  onRotatePointerDownHandler?: () => void;
}

const HANDLE_WIDTH = 10;
const ICON_OFFSET = 20;

const getSideFromPoints = (
  points: { maxX: number; maxY: number; minX: number; minY: number },
  x: number,
  y: number
): ISide => {
  const { minX, maxX, minY, maxY } = points;

  if (x === minX) {
    if (y === minY) return ISide.Top;
    if (y === maxY) return ISide.Left;
    return ISide.Left;
  } else if (x === maxX) {
    if (y === minY) return ISide.Right;
    if (y === maxY) return ISide.Bottom;
    return ISide.Right;
  }
  return ISide.Left;
};

export const ActionBox: React.FC<IResizingHelper> = ({
  boxCoordinate,
  onResizePointerDownHandler,
  onResizePointerUpHandler,
  onRotatePointerDownHandler,
}) => {
  const { x, y, width, height, rotation } = boxCoordinate;
  const centerPoint = getCenterFromLayer(boxCoordinate);
  const centerX = centerPoint.x;
  const centerY = centerPoint.y;

  const resizeIconsNormalPosition = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];

  const rotateIconsNormalPosition = [
    { x: x - ICON_OFFSET, y: y - ICON_OFFSET },
    { x: x + width + ICON_OFFSET, y: y - ICON_OFFSET },
    { x: x + width + ICON_OFFSET, y: y + height + ICON_OFFSET },
    { x: x - ICON_OFFSET, y: y + height + ICON_OFFSET },
  ];

  const resizeRotatePositions: IPoints[] = resizeIconsNormalPosition.map(
    (handle) =>
      convertNormalToRotationPosition(
        centerX,
        centerY,
        handle.x,
        handle.y,
        rotation ?? 0
      )
  );

  const getCornerPoints = () => {
    const minX = Math.min(...resizeRotatePositions.map((p) => p.x));
    const maxX = Math.max(...resizeRotatePositions.map((p) => p.x));
    const minY = Math.min(...resizeRotatePositions.map((p) => p.y));
    const maxY = Math.max(...resizeRotatePositions.map((p) => p.y));

    return { minX, maxX, minY, maxY };
  };

  const cornerPoints = getCornerPoints();

  const rotateIconsRotatePositions = rotateIconsNormalPosition.map((icon) =>
    convertNormalToRotationPosition(
      centerX,
      centerY,
      icon.x,
      icon.y,
      rotation ?? 0
    )
  );

  return (
    <>
      {resizeRotatePositions.map((handle, index) => {
        const handleX = handle.x - HANDLE_WIDTH / 2;
        const handleY = handle.y - HANDLE_WIDTH / 2;

        const side = getSideFromPoints(cornerPoints, handle.x, handle.y);
        return (
          <rect
            key={index}
            className="fill-transparent stroke-blue-500 stroke-[3px] "
            x={handleX}
            y={handleY}
            width={HANDLE_WIDTH}
            height={HANDLE_WIDTH}
            style={{ cursor: "nwse-resize" }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onResizePointerDownHandler(side, boxCoordinate, e);
            }}
            onPointerUp={onResizePointerUpHandler}
          />
        );
      })}
      {rotateIconsRotatePositions.map((icon, index) => (
        <Rotate3D
          key={index}
          className="stroke-blue-500 cursor-crosshair"
          x={icon.x - HANDLE_WIDTH / 2}
          y={icon.y - HANDLE_WIDTH / 2}
          width={HANDLE_WIDTH * 3}
          height={HANDLE_WIDTH * 3}
          onPointerDown={(e) => {
            e.stopPropagation();
            onRotatePointerDownHandler?.();
          }}
          onPointerUp={onResizePointerUpHandler}
        />
      ))}
    </>
  );
};
