import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useAPIMutation } from "@/hooks/useMutation";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, Link2, Pencil, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "./../ConfirmModal";
import { useRename } from "@/store/useRename";

interface DropdownActionProps {
  children: React.ReactNode;
  id: string;
  title: string;
}

export const DropdownAction = ({
  children,
  id,
  title,
}: DropdownActionProps) => {
  const { onOpen } = useRename();
  const { mutating, isLoading } = useAPIMutation(api.board.deleteBoardById);

  const copyLinkHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(window.location.origin + "/board/" + id)
      .then(() => {
        toast.success("Board link copied");
      });
  };

  const deleteBoardHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    mutating({ id: id })
      .then(() => {
        toast.success("Board deleted");
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-30 z-[99] flex flex-col justify-center bg-black text-white shadow-md rounded-md border border-black/10 "
        sideOffset={5}
        side="bottom"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DropdownMenuItem onClick={copyLinkHandler}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Board Link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            onOpen(id, title);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename Board
        </DropdownMenuItem>

        <ConfirmModal
          handleConfirm={deleteBoardHandler}
          title="Delete This Board"
          description="Are you sure you want to delete this board?"
          loading={isLoading}
        >
          <Button variant="destructive">
            <Trash className="h-4 w-4 mr-2" />
            Delete Board
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
