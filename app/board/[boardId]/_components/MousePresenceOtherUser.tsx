"use client";

import { memo } from "react";
import { useOthersConnectionIds } from "@/liveblocks.config";
import { Cursor } from "./Cursor";

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((id: number) => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};

export const MousePresenceOtherUsers = memo(() => {
  return (
    <>
      {/*TODO : Draft Pencil */}
      <Cursors />
    </>
  );
});

MousePresenceOtherUsers.displayName = "MpusePresenceOtherUsers";
