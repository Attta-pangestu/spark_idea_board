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

export interface IBoardCard {
  _id: string;
  title: string;
  imageUrl: string | null;
  authorId: string;
  authorName: string;
  _creationTime: Number;
  orgId: string;
  isFavorite?: boolean;
}

const BoardImage = ({ image }: { image: string }) => {
  return (
    <div className=" flex-1 bg-amber-50">
      <Image
        className="object-fill w-full h-full"
        src={image}
        alt="author avatar"
        width={120}
        height={120}
        priority
      />
    </div>
  );
};

export const BoardCard = ({ board }: { board: IBoardCard }) => {
  const creationDate = new Date(board._creationTime as number);
  const { mutating: addFavoriteMutate, isLoading: addFavoriteIsLoading } =
    useAPIMutation(api.board.addFavorite);
  const { mutating: removeFavoriteMutate, isLoading: removeFavoriteIsLoading } =
    useAPIMutation(api.board.removeFavorite);

  const distanceDate = formatDistanceToNow(creationDate, { addSuffix: true });

  const handleFavorite = async () => {
    addFavoriteMutate({
      id: board._id,
      orgId: board.orgId,
      userId: board.authorId,
    })
      .then(() => {
        toast.success("Board added to favorites");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleUnFavorite = async () => {
    removeFavoriteMutate({
      id: board._id,
      orgId: board.orgId,
      userId: board.authorId,
    })
      .then(() => {
        toast.success("Board removed from favorites");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <Link href={`/board/${board._id}`} className="group">
      <div className="relative aspect-[100/120] border rounded-lg flex flex-col justify-between overflow-hidden cursor-default">
        <OverlayBoard />
        <BoardImage image={board.imageUrl!} />
        <DropdownAction id={board._id} title={board.title}>
          <MoreHorizontal className="absolute top-2 right-4 h-6 w-6 text-foreground opacity-100 group-hover:text-white  transition-opacity" />
        </DropdownAction>
      </div>
      {/* card footer */}
      <div
        className="bg-white p-3 relative"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <p className="text-md truncate max-w-[calc(100%-20px)]">
          {board.title}
        </p>
        <p className="mt-3 opacity-0 group-hover:opacity-100 text-md text-muted-foreground truncate">
          {board.authorName} | {distanceDate}
        </p>
        <button
          disabled={addFavoriteIsLoading || removeFavoriteIsLoading}
          onClick={(e) => {
            e.preventDefault();
            board.isFavorite ? handleUnFavorite() : handleFavorite();
          }}
          className={cn(
            "opacity-0 group-hover:opacity-100 absolute bottom-8 right-3 text-muted-foreground hover:text-golden"
          )}
        >
          <Star
            className={cn(
              "h-8 w-8",
              board.isFavorite && " fill-golden-default text-golden-default"
            )}
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
