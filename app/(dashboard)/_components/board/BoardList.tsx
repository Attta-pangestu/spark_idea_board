"use client";

import { EmptyNotif } from "./EmptyNotif";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useAPIMutation } from "@/hooks/useMutation";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { BoardCard } from "./BoardCard";

interface BoardListProps {
  boardId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ query }: BoardListProps) => {
  const { organization } = useOrganization();
  const { mutating, isLoading } = useAPIMutation(api.board.createBoard);
  const data = useQuery(api.board.getBoardsByOrg, {
    orgId: organization?.id as string,
  });

  const clickCreateBoardHandler = async () => {
    if (!organization) return;
    mutating({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        //do anything with board id
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        toast.success("Board created");
      });
  };

  if (data === undefined) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorites Boards" : "Search Results Boards"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 pb-10">
          {data.map((board) => (
            <BoardCard
              key={board._id}
              board={{ ...board, isFavorite: query.favorites ? true : false }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length && query.search) {
    return (
      <EmptyNotif
        imageUrl="/empty-search.svg"
        title="No Ideas Found"
        description="Try broadening your search"
      />
    );
  }

  if (!data.length && query.favorites) {
    return (
      <EmptyNotif
        imageUrl="/empty-favorites.svg"
        title="No Favorites Found"
        description="Try adding some ideas to your favorites"
      />
    );
  }

  if (!data.length) {
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
