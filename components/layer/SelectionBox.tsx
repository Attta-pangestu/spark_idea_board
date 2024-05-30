import { ISide, XYWH } from "@/types/canvas";

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

export const SelectionBox = ({
  boxCoordinate,
  onResizePointerDownHandler,
  onResizePointerUpHandler,
}: IResizingHelper) => {
  return (
    <>
      {/* Create action box to handle resize each corner */}
      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x - HANDLE_WIDTH / 2}
        y={boxCoordinate.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "nwse-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(ISide.Top, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />
      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width / 2 - HANDLE_WIDTH / 2}
        y={boxCoordinate.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "ns-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onResizePointerDownHandler(ISide.Top + ISide.Right, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />

      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
        y={boxCoordinate.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "nesw-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onResizePointerDownHandler(ISide.Right, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />

      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
        y={boxCoordinate.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "nesw-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(ISide.Right, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />
      {/* BOTTOM SIDE */}
      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
        y={boxCoordinate.y + boxCoordinate.height / 2 - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "ew-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(
            ISide.Right + ISide.Bottom,
            boxCoordinate,
            e
          );
        }}
        onPointerUp={onResizePointerUpHandler}
      />

      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width - HANDLE_WIDTH / 2}
        y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "nwse-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(ISide.Bottom, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />

      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x + boxCoordinate.width / 2 - HANDLE_WIDTH / 2}
        y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "ns-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(
            ISide.Bottom + ISide.Left,
            boxCoordinate,
            e
          );
        }}
        onPointerUp={onResizePointerUpHandler}
      />

      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x - HANDLE_WIDTH / 2}
        y={boxCoordinate.y + boxCoordinate.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "nesw-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(ISide.Left, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />
      <rect
        className="fill-transparent stroke-blue-500 stroke-[3px]"
        x={boxCoordinate.x - HANDLE_WIDTH / 2}
        y={boxCoordinate.y + boxCoordinate.height / 2 - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        style={{ cursor: "ew-resize" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizePointerDownHandler(ISide.Left + ISide.Top, boxCoordinate, e);
        }}
        onPointerUp={onResizePointerUpHandler}
      />
    </>
  );
};
