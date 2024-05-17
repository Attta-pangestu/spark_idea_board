import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-md p-3 flex items-centers shadow-md">
      List of participants
    </div>
  );
};

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <div className="absolute w-[200px] gap-3 top-2 right-2 bg-slate-100 rounded-md p-3 flex items-centers shadow-md">
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
    </div>
  );
};
