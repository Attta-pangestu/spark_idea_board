import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <Link href={`/dashboard/board/${board._id}`}>
      <div className="aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex">
          <Image
            className="rounded-full mr-4"
            src={board.imageUrl!}
            alt="author avatar"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{board.authorName}</p>
            <small className="text-muted-foreground">
              {board._creationTime.toString()}
            </small>
          </div>
        </div>
      </div>
    </Link>
  );
};
