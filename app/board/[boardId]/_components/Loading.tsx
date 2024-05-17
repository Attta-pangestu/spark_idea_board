import { Loader } from "lucide-react";
import { BoardInfo } from "./BoardInfo";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";

export const LoadingCanvas = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <BoardInfo.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
      <Loader className="h-16 w-16 text-muted-foreground animate-spin" />
    </main>
  );
};
