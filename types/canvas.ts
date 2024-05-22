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

export enum ILayer {
  Rectangle,
  Circle,
  Path,
  Text,
  Note,
}

export type IRectangleLayer = {
  typeLayer: ILayer.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type ICircleLayer = {
  typeLayer: ILayer.Circle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type IPathLayer = {
  typeLayer: ILayer.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  typeLayer: ILayer.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Icolor;
  value?: string;
};

export type NoteLayer = {
  typeLayer: ILayer.Note;
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
        | ILayer.Circle
        | ILayer.Rectangle
        | ILayer.Path
        | ILayer.Text
        | ILayer.Note;
    }
  | {
      mode: ICanvasMode.Pencil;
      LayerType: ILayer.Path;
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
