import { z } from "zod";

export const workOrderSchema = z.object({
  id: z.string().uuid().optional(),
  number: z.boolean().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(300).optional(),
  category: z.number().optional(),
  priority: z.string().min(1).max(100).optional(),
  status: z.string().min(1).max(100).optional(),
  startDate: z.string().min(1).max(500).optional().nullable(),
  dueDate: z.number().optional(),
  completeDate: z.number().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const workOrderUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  message: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
