import { Canvas } from "./_components/Canvas";

interface IBoardPage {
  params: {
    boardId: string;
  };
}

const BoardPage = ({ params }: IBoardPage) => {
  return <Canvas boardId={params.boardId} />;
};

export default BoardPage;
