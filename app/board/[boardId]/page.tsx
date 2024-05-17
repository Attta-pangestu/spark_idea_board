import { Room } from "@/components/room/LiveBlocksRooms";
import { Canvas } from "./_components/Canvas";
import { LoadingCanvas } from "./_components/Loading";

interface IBoardPage {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: IBoardPage) => {
  return (
    <Room roomId={params.boardId} fallback={<LoadingCanvas />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardPage;
