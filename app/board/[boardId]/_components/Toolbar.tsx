import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./ToolButton";
import {
  Circle,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";

export const Toolbar = () => {
  const ToolWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={`bg-white rounded-md p-1.5 flex gap-y-2 flex-col items-center shadow-md`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-2 bg-slate-100  p-3 shadow-md">
      <ToolWrapper>
        <ToolButton label="Pen" Icon={Pencil} onClick={() => {}} />
        <ToolButton label="Text" Icon={Type} onClick={() => {}} />
        <ToolButton label="Rectangle" Icon={Square} onClick={() => {}} />
        <ToolButton label="Circle" Icon={Circle} onClick={() => {}} />
        <ToolButton label="Note" Icon={StickyNote} onClick={() => {}} />
      </ToolWrapper>
      <ToolWrapper>
        <ToolButton label="Undo" Icon={Undo2} onClick={() => {}} />
        <ToolButton label="Redo" Icon={Redo2} onClick={() => {}} />
      </ToolWrapper>
    </div>
  );
};

export const ToolbarSkeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-4 flex flex-col gap-y-4 bg-slate-100 animate-pulse p-3 shadow-md">
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
      <Skeleton className="w-[50px] h-[50px] bg-slate-300" />
    </div>
  );
};
