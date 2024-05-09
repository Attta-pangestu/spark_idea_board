"use client";
import { Plus } from "lucide-react";
import { OverlayBoard } from "./OverlayBoard";
import { useAPIMutation } from "@/hooks/useMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface NewBoardProps {
  orgId: string;
}

export const NewBoard = ({ orgId }: NewBoardProps) => {
  const { mutating, isLoading } = useAPIMutation(api.board.createBoard);
  const handleCreateBoard = async () => {
    try {
      await mutating({
        orgId,
        title: "Untitled",
      });
    } catch (err) {
      throw err;
    } finally {
      toast.success("Board created");
    }
  };

  return (
    <button
      className="group relative aspect-[100/120] bg-amber-50 flex items-center border rounded-lg"
      onClick={handleCreateBoard}
    >
      <OverlayBoard />
      <Plus className="h-[4rem] aspect-square text-slate-500 flex-1" />
    </button>
  );
};
