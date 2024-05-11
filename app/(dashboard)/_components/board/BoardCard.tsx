import { cn } from "@/lib/utils";
import { HeartIcon, MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { OverlayBoard } from "./OverlayBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownAction } from "./DropdownAction";
import { useAPIMutation } from "@/hooks/useMutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

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

const BoardImage = ({ image }: { image: string }) => {
  return (
    <div className=" flex-1 bg-amber-50">
      <Image className="object-fit" src={image} alt="author avatar" fill />
    </div>
  );
};

export const BoardCard = ({ board }: BoardCard) => {
  const creationDate = new Date(board._creationTime as number);
  const { mutating } = useAPIMutation(api.board.addFavorite);
  const distanceDate = formatDistanceToNow(creationDate, { addSuffix: true });

  const handleFavorite = async () => {
    mutating({ id: board._id, orgId: board.orgId, userId: board.authorId })
      .then(() => {
        toast.success("Board added to favorites");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <Link href={`/dashboard/board/${board._id}`} className="group">
      <div className="relative aspect-[100/120] border rounded-lg flex flex-col justify-between overflow-hidden cursor-default">
        <OverlayBoard />
        <BoardImage image={board.imageUrl!} />
        <DropdownAction id={board._id} title={board.title}>
          <MoreHorizontal className="absolute top-2 right-4 h-6 w-6 text-foreground opacity-100 group-hover:text-white  transition-opacity" />
        </DropdownAction>
      </div>
      {/* card info footer */}
      <div className="bg-white p-3 relative">
        <p className="text-md truncate max-w-[calc(100%-20px)]">
          {board.title}
        </p>
        <p className="mt-3 opacity-0 group-hover:opacity-100 text-md text-muted-foreground truncate">
          {board.authorName} | {distanceDate}
        </p>
        <button
          // disabled={!board.isFavorite}
          onClick={(e) => {
            e.preventDefault();
            handleFavorite();
          }}
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
