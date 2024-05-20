"use client";

import { connectionIdToColor } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";

import { UserAvatar } from "./UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import config from "./../../../../tailwind.config";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const combinedUsers = [currentUser, ...users];

  const excessUsers = users.length - MAX_SHOWN_USERS;

  return (
    <div className="absolute  gap-3 top-3 right-4 bg-slate-100 rounded-md p-4 flex items-centers shadow-md">
      <div className=" flex gap-x-2 items-center">
        <span className="font-bold ">Participants: </span>
        {combinedUsers.slice(0, MAX_SHOWN_USERS).map((user, index) => {
          const { connectionId, info }: { connectionId: number; info: any } =
            user;
          return (
            <UserAvatar
              borderColor={connectionIdToColor(connectionId)}
              key={connectionId}
              src={info?.picture}
              name={index == 0 ? "You" : info?.name}
              fallback={info?.name?.[0] || "T"}
              isYou={index === 0}
            />
          );
        })}

        {excessUsers > 0 && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute w-[200px] gap-3 top-2 right-2 bg-slate-100 rounded-md p-3 flex items-centers shadow-md">
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
    </div>
  );
};
