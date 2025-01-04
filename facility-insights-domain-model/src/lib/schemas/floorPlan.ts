import { z } from "zod";

export const floorPlanSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const floorPlanUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  message: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
