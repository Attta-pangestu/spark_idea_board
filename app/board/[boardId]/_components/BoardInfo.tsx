import { Skeleton } from "@/components/ui/skeleton";

export const BoardInfo = () => {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 flex item-center shadow-md">
      TODO: Information about board
    </div>
  );
};

BoardInfo.Skeleton = function BoardInfoSkeleton() {
  return (
    <div className="absolute flex items-center gap-2 top-2 left-2 rounded-md bg-slate-100 shadow-md w-[300px] p-2 ">
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
      <Skeleton className="w-[22%] h-[20px] bg-slate-300" />
    </div>
  );
};
