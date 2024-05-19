"use client"

import { RenameModals } from "@/app/(dashboard)/_components/board/RenameModals";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useRename } from "@/store/useRename";
import { useQuery } from "convex/react";
import {Poppins} from 'next/font/google' 
import { Id } from "@/convex/_generated/dataModel";
import { Hint } from "@/app/(dashboard)/_components/sidebar/Hint";
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { DropdownAction } from "@/app/(dashboard)/_components/board/DropdownAction";
import { Menu } from "lucide-react";



const font = Poppins({
  subsets: ["latin"], 
  weight: ["600"]
})

export const TabSeparator = () => {
  return (
    <div className="text-neutral-300 px-1.5"/>
  )
}

interface IBoardInfo {
  boardId: string;
}

export const BoardInfo = ({boardId} :IBoardInfo) => {
  const {onOpen} = useRename()

  const data = useQuery(api.board.getBoardById, {
    id: boardId as Id<"boards">
  })
  
  if(!data) return <InfoSkeleton />; 

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex item-center shadow-md">
      <Hint label="Go to Boards" side="bottom" sideOffset={10} >
        <Button asChild className="px-2">
            <Link href="/">
                <Image
                  src="/logo.svg"
                  width={40}
                  height={40}
                  alt="Board Logo"
                />
            </Link>
        </Button>
      </Hint> 
      <TabSeparator/>
      <Hint label="Edit Title" side="bottom" sideOffset={10}>
            <Button variant="board" className="font-normal px-2" onClick={() => onOpen(data._id, data.title)}>
              {data.title}
            </Button>
      </Hint>
      <TabSeparator/>
      <DropdownAction id={data._id} title={data.title} key={data._id}>
        <div>
          <Hint label="Main Menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board" >
                <Menu/>
            </Button>
          </Hint>
        </div>
      </DropdownAction>
    </div>
  );
};

export const InfoSkeleton = () =>  {

  return (
    <div className="absolute flex items-center gap-2 top-2 left-2 rounded-md bg-slate-100 shadow-md w-[300px] p-2 ">
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
    </div>
  );
};
