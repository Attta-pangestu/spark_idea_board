"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

interface IRoom {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
}

export function Room({ children, roomId, fallback }: IRoom) {
  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
