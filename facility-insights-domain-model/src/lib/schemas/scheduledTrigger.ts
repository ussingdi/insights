import { z } from "zod";

export const scheduledTriggerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  cycleType: z.string().min(1).max(300).optional(),
  cycleAmount: z.number().optional(),
  repeatType: z.string().min(1).max(100).optional(),
  workOrderDueType: z.string().min(1).max(100).optional(),
  workOrderDueAmount: z.string().min(1).max(100).optional(),
  startDate: z.string().min(1).max(500).optional().nullable(),
  endDate: z.number().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
