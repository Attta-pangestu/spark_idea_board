import { EmptyNotif } from "./EmptyNotif";
import { useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

interface BoardListProps {
  boardId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ boardId, query }: BoardListProps) => {
  const { organization } = useOrganization();
  const createBoard = useMutation(api.board.createBoard);

  const data = [];

  const clickCreateBoardHandler = () => {
    if (!organization) return;

    createBoard({
      orgId: organization.id,
      title: "Untitled",
    });
  };

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
      />
    );
  }
};
