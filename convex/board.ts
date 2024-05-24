import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];

export const createBoard = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name ?? "Anonymous",
      imageUrl: randomImage,
    });
    return board;
  },
});

export const getBoardsByOrg = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    let boards;

    const noFilterBoards = await ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    const favoriteId = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", identity.subject).eq("orgId", args.orgId)
      )
      .order("desc")
      .collect()
      .then((fav) => fav.map((fav) => fav.boardId));

    if (favoriteId && args.favorites === "true") {
      const favBoard = noFilterBoards
        .filter((board) => favoriteId.includes(board._id))
        .map((board) => ({
          ...board,
          isFavorite: true,
        }));
      return favBoard;
    } else if (args.search) {
      const searchedBoard = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.search as string).eq("orgId", args.orgId)
        )
        .collect()
        .then((boards) =>
          boards.map((board) => ({
            ...board,
            isFavorite: favoriteId.includes(board._id),
          }))
        );
      return searchedBoard;
    }
    const defaultBoard = noFilterBoards.map((board) => ({
      ...board,
      isFavorite: favoriteId.includes(board._id),
    }));
    return defaultBoard;
  },
});

export const getFavoriteBoards = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const favoritedBoards = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", identity.subject).eq("orgId", args.orgId)
      )
      .order("desc")
      .collect();
    const favBoardId = favoritedBoards.map((board) => board.boardId);
    return favBoardId;
  },
});

export const getAllBoards = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
    return boards;
  },
});

export const deleteBoardById = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const board = await ctx.db.delete(args.id);
    const userId = identity.subject;

    // check favorited board also deleted
    const favoriteToDelete = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (favoriteToDelete) await ctx.db.delete(favoriteToDelete._id);
  },
});

export const renameBoardById = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const board = await ctx.db.patch(args.id, { title: args.title });

    return board;
  },
});

export const addFavorite = mutation({
  args: { id: v.id("boards"), orgId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const board = await ctx.db.get(args.id);
    if (!board) throw new Error("Board not found");

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) =>
        q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId)
      )
      .unique();

    if (existingFavorite) throw new Error("Already favorited");

    await ctx.db.insert("userFavorites", {
      boardId: board._id,
      orgId: args.orgId,
      userId: userId,
    });
    return board;
  },
});

export const removeFavorite = mutation({
  args: { id: v.id("boards"), orgId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const board = await ctx.db.get(args.id);
    if (!board) throw new Error("Board not found");
    const userId = identity.subject;

    const favoriteToDelete = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) =>
        q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId)
      )
      .unique();

    if (!favoriteToDelete) throw new Error("Favorite not found");

    await ctx.db.delete(favoriteToDelete._id);
  },
});

export const getFavoritesByUserAndOrg = query({
  args: { orgId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId)
      throw new Error("Unauthorized : User Id does not match identity");

    const favorites = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", args.userId).eq("orgId", args.orgId)
      )
      .collect();

    return favorites;
  },
});

export const getBoardById = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id);
    return board;
  },
});
