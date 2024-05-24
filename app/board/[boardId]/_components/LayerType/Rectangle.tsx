interface IRectangleLayer {
  id: string;
  layerProps: IRectangleLayer;
  onPointerDown: (e: React.PointerEvent) => void;
}

export const RectangleLayer = () => {
  return (
    <div>
      <h1>Rectangle</h1>
    </div>
  );
};
