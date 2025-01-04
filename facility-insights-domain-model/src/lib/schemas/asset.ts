import { z } from "zod";

export const assetSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(300).optional(),
  model: z.string().min(1).max(100).optional(),
  manufacturer: z.string().min(1).max(100).optional(),
  serialNumber: z.boolean().optional(),
  barcode: z.string().min(1).max(500).optional().nullable(),
  category: z.number().optional(),
  status: z.number().optional(),
  purchasePrice: z.number().optional(),
  purchaseDate: z.number().optional(),
  residualValue: z.number().optional(),
  usefulLife: z.number().optional(),
  placedInServiceDate: z.number().optional(),
  warrantyExpirationDate: z.number().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const assetUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  message: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
