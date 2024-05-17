"use client";

import { EmptyNotif } from "./EmptyNotif";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useAPIMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { BoardCard, IBoardCard } from "./BoardCard";
import { NewBoard } from "./NewBoard";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface BoardListProps {
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ query }: BoardListProps) => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutating, isLoading } = useAPIMutation(api.board.createBoard);
  const boardDatas: any =
    useQuery(api.board.getBoardsByOrg, {
      orgId: organization?.id as string,
      favorites: query?.favorites || "false",
      search: query.search,
    }) || [];

  const clickCreateBoardHandler = async () => {
    if (!organization) return;
    mutating({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Successfully created new board");
        router.push(`/board/${id}`);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        toast.success("Board created");
      });
  };

  if (boardDatas === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorites Boards" : "Search Results Boards"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 pb-10">
          <NewBoard orgId={organization?.id as string} />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (boardDatas?.length) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorites Boards" : "Search Results Boards"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 pb-10">
          <NewBoard orgId={organization?.id as string} />
          {boardDatas.map((board: IBoardCard) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      </div>
    );
  }

  if (!boardDatas.length && query.search) {
    return (
      <EmptyNotif
        imageUrl="/empty-search.svg"
        title="No Ideas Found"
        description="Try broadening your search"
      />
    );
  }

  if (!boardDatas.length && query.favorites) {
    return (
      <EmptyNotif
        imageUrl="/empty-favorites.svg"
        title="No Favorites Found"
        description="Try adding some ideas to your favorites"
      />
    );
  }

  if (!boardDatas.length) {
    return (
      <EmptyNotif
        imageUrl="/elements.svg"
        title="Welcome to Spark Board"
        description="Create a board to get started"
        buttonText="Create Board"
        buttonClickHandler={clickCreateBoardHandler}
        payload={{ disabled: isLoading }}
      />
    );
  }
};
