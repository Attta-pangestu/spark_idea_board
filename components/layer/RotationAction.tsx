import { ISide, XYWH } from "@/types/canvas";
import { Rotate3D } from "lucide-react";

interface IRotationAction {
  layerId: string;
  onRotatingLayerHandler: (layerId: string, currentAngle: number) => void;
  boxCoordinate: XYWH;
}

const HANDLE_WIDTH = 24;
const ICON_OFFSET = 8;

export const RotationAction = ({
  layerId,
  onRotatingLayerHandler,
  boxCoordinate,
}: IRotationAction) => {
  return (
    <>
      {/* Create action box to handle resize each corner */}
      <Rotate3D
        // TOP
        className="fill-transparent stroke-blue-500 stroke-[3px] cursor-crosshair "
        x={boxCoordinate.x - ICON_OFFSET - HANDLE_WIDTH}
        y={boxCoordinate.y - ICON_OFFSET - HANDLE_WIDTH}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onClick={(e) => {
          onRotatingLayerHandler(layerId, boxCoordinate.angle || 0);
        }}
      />

      <Rotate3D
        // RIGHT
        className="fill-transparent stroke-blue-500 stroke-[3px] cursor-crosshair"
        x={boxCoordinate.x + boxCoordinate.width + ICON_OFFSET}
        y={boxCoordinate.y - ICON_OFFSET - HANDLE_WIDTH}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onClick={(e) => {
          onRotatingLayerHandler(layerId, boxCoordinate.angle || 0);
        }}
      />

      <Rotate3D
        //Bottom
        className="fill-transparent stroke-blue-500 stroke-[3px] cursor-crosshair"
        x={boxCoordinate.x + boxCoordinate.width + ICON_OFFSET}
        y={
          boxCoordinate.y +
          boxCoordinate.height +
          ICON_OFFSET +
          HANDLE_WIDTH / 2
        }
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onClick={(e) => {
          onRotatingLayerHandler(layerId, boxCoordinate.angle || 0);
        }}
      />

      <Rotate3D
        // LEFT
        className="fill-transparent stroke-blue-500 stroke-[3px] cursor-crosshair "
        x={boxCoordinate.x - ICON_OFFSET - HANDLE_WIDTH}
        y={boxCoordinate.y + boxCoordinate.height + ICON_OFFSET + HANDLE_WIDTH}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onClick={(e) => {
          onRotatingLayerHandler(layerId, boxCoordinate.angle || 0);
        }}
      />
    </>
  );
};
