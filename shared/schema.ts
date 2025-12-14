import { z } from "zod";

export const emailSchema = z.object({
  id: z.string(),
  to: z.string(),
  from: z.string(),
  subject: z.string(),
  textBody: z.string().optional(),
  htmlBody: z.string().optional(),
  timestamp: z.string(),
  isRead: z.boolean(),
});

export const insertEmailSchema = emailSchema.omit({ id: true, isRead: true, timestamp: true });

export const tempAddressSchema = z.object({
  address: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
});

export type Email = z.infer<typeof emailSchema>;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type TempAddress = z.infer<typeof tempAddressSchema>;

export const users = {} as any;
export type User = { id: string; username: string; password: string };
export type InsertUser = { username: string; password: string };
