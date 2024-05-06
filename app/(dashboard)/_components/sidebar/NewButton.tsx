"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";

import { Plus } from "lucide-react";
import { Hint } from "./Hint";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square relative">
          <Hint label="Create Organization" align="end" side="right">
            <button className="  p-1 flex items-center justify-center bg-white/25 opacity-60  hover:opcacity-100 transition  rounded-md">
              <Plus size={30} className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
