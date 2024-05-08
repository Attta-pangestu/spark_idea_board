import { EmptyNotif } from "./EmptyNotif";

interface BoardListProps {
  boardId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ boardId, query }: BoardListProps) => {
  const data = [];

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
};
