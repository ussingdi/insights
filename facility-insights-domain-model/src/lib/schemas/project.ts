import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  code: z.string().min(1).max(100).optional(),
  status: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const projectMemberSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
