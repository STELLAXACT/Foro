import { z } from "zod";

// User schema
export const insertUserSchema = z.object({
  nickname: z.string().min(1).max(50),
  avatar: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & {
  id: string;
  createdAt: string;
};

// Post schema
export const insertPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(["dreams", "nightmares", "occult", "urban-legends", "dark-poetry"]),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  authorId: z.string(),
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = InsertPost & {
  id: string;
  votes: number;
  createdAt: string;
  commentCount: number;
};

// Comment schema
export const insertCommentSchema = z.object({
  content: z.string().min(1),
  postId: z.string(),
  authorId: z.string(),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = InsertComment & {
  id: string;
  votes: number;
  createdAt: string;
};

// MicroFeed schema
export const insertMicroFeedSchema = z.object({
  content: z.string().min(1).max(280),
  authorId: z.string(),
});

export type InsertMicroFeed = z.infer<typeof insertMicroFeedSchema>;
export type MicroFeed = InsertMicroFeed & {
  id: string;
  createdAt: string;
};

// Chat Message schema
export const insertChatMessageSchema = z.object({
  content: z.string().min(1),
  authorId: z.string(),
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = InsertChatMessage & {
  id: string;
  createdAt: string;
};

// Dark Market Item schema
export const darkMarketItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  icon: z.string(),
  image: z.string(),
});

export type DarkMarketItem = z.infer<typeof darkMarketItemSchema>;

// Cart Item schema
export const cartItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().default(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Vote schema
export const voteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  targetId: z.string(), // postId or commentId
  type: z.enum(["upvote", "downvote"]),
});

export type Vote = z.infer<typeof voteSchema>;
