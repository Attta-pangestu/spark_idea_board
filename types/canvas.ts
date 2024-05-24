export type Icolor = {
  r: number;
  g: number;
  b: number;
};

export type IPosition = {
  x: number;
  y: number;
};

export type ICamera = {
  x: number;
  y: number;
};

export enum ILayerEnum {
  Text,
  Note,
  Rectangle,
  Circle,
  Path,
}

export type IRectangleLayer = {
  typeLayer: ILayerEnum.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type ICircleLayer = {
  typeLayer: ILayerEnum.Circle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type IPathLayer = {
  typeLayer: ILayerEnum.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  points: number[][];
  value?: string;
};

export type ITextLayer = {
  typeLayer: ILayerEnum.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type INoteLayer = {
  typeLayer: ILayerEnum.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type IPoints = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export enum ICanvasMode {
  None,
  Pressing,
  SelectionNet,
  Translating,
  Inserting,
  Resizing,
  Pencil,
}

export type ICanvasState =
  | {
      mode: ICanvasMode.None;
    }
  | {
      mode: ICanvasMode.Inserting;
      LayerType:
        | ILayerEnum.Circle
        | ILayerEnum.Rectangle
        | ILayerEnum.Text
        | ILayerEnum.Note;
    }
  | {
      mode: ICanvasMode.Pencil;
      LayerType: ILayerEnum.Path;
    }
  | {
      mode: ICanvasMode.Pressing;
      origin: IPoints;
    }
  | {
      mode: ICanvasMode.SelectionNet;
      origin: IPoints;
      current?: IPoints;
    }
  | {
      mode: ICanvasMode.Translating;
      current: IPoints;
    }
  | {
      mode: ICanvasMode.Resizing;
    };

export type ILayerType =
  | IRectangleLayer
  | ICircleLayer
  | IPathLayer
  | ITextLayer
  | INoteLayer;
