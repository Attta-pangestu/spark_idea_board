"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRename } from "@/store/useRename";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

export const RenameModals = () => {
  const [title, setTitle] = useState("");
  const { initialValues, isOpen, onClose, isLoading, setLoading } = useRename();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board Title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new board title</DialogDescription>
        <form>
          <input
            placeholder="Board title"
            value={initialValues.title}
            onChange={handleTitleChange}
            required
            disabled={isLoading}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
