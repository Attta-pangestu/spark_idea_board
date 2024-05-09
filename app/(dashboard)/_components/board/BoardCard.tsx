import { cn } from "@/lib/utils";
import { HeartIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { OverlayBoard } from "./OverlayBoard";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardCard {
  board: {
    _id: string;
    title: string;
    imageUrl: string | null;
    authorId: string;
    authorName: string;
    _creationTime: Number;
    orgId: string;
    isFavorite?: boolean;
  };
}

export const BoardCard = ({ board }: BoardCard) => {
  const creationDate = new Date(board._creationTime as number);
  const distanceDate = formatDistanceToNow(creationDate, { addSuffix: true });

  return (
    <Link href={`/dashboard/board/${board._id}`} className="group">
      <div className="relative aspect-[100/120] border rounded-lg flex flex-col justify-between overflow-hidden cursor-default">
        <OverlayBoard />
        {/* card image */}
        <div className=" flex-1 bg-amber-50">
          <Image
            className="object-fit"
            src={board.imageUrl!}
            alt="author avatar"
            fill
          />
        </div>
      </div>
      {/* card info footer */}
      <div className="bg-white p-3">
        <p className="text-md truncate max-w-[calc(100%-20px)]">
          {board.title}
        </p>
        <p className="mt-3 opacity-0 group-hover:opacity-100 text-md text-muted-foreground truncate">
          {board.authorName} | {distanceDate}
        </p>
        <button
          disabled={!board.isFavorite}
          className={cn(
            "opacity-0 group-hover:opacity-100 absolute bottom-8 right-3 text-muted-foreground hover:text-red-500"
          )}
        >
          <Star
            className={cn("h-8 w-8", board.isFavorite && " fill-red-500")}
          />
        </button>
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className=" aspect-[100/120]  rounded-lg  cursor-default bg-black">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
