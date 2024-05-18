"use client";

import { useEffect } from "react";
import { BoardInfo } from "./BoardInfo";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";

interface ICanvas {
  boardId: string;
}

export const Canvas = ({ boardId }: ICanvas) => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none ">
      <BoardInfo />
      <Participants />
      <Toolbar />
    </main>
  );
};
