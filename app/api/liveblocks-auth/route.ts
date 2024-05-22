import { currentUser, auth } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { NextApiRequest } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEYS as string,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }
  const { room } = await request.json();
  const board = await convex.query(api.board.getBoardById, {
    id: room,
  });

  // if (board?.orgId !== authorization.orgId) {
  //   return new Response("Unauthorized", { status: 403 });
  // }

  const userInfoSession = {
    name: user.firstName || "Anonymous",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo: userInfoSession,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }
  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
