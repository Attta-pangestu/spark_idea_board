import { Loader } from "lucide-react";
import { InfoSkeleton } from "./BoardInfo";
import {  ParticipantsSkeleton } from "./Participants";
import { Toolbar, ToolbarSkeleton } from "./Toolbar";

export const LoadingCanvas = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
      <Loader className="h-16 w-16 text-muted-foreground animate-spin" />
    </main>
  );
};
