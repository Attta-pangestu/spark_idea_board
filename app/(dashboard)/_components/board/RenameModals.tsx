"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useAPIMutation } from "@/hooks/useMutation";
import { useRename } from "@/store/useRename";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RenameModals = () => {
  const { initialValues, isOpen, onClose, isLoading, setLoading } = useRename();
  const [title, setTitle] = useState("");
  const { mutating } = useAPIMutation(api.board.renameBoardById);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    mutating({ id: initialValues.id, title: title })
      .then(() => {
        toast.success("Board renamed");
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[999]">
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new board title</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Board title"
            value={title}
            onChange={handleTitleChange}
            required
            disabled={isLoading}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
