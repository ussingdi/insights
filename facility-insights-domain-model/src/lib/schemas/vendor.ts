import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(300).optional(),
  companyEmail: z.string().min(1).max(100).optional(),
  companyPhoneNumber: z.string().min(1).max(100).optional(),
  type: z.boolean().optional(),
  address: z.string().min(1).max(500).optional().nullable(),
  latitute: z.number().optional(),
  longitude: z.number().optional(),
  mainContact: z
    .object({
      name: z.string().min(1).max(100).optional(),
      email: z.string().min(1).max(300).optional(),
      phoneNumber: z.string().min(1).max(100).optional(),
      officeNumber: z.string().min(1).max(100).optional(),
    })
    .optional(),
  secondaryContact: z
    .object({
      name: z.string().min(1).max(100).optional(),
      email: z.string().min(1).max(300).optional(),
      phoneNumber: z.string().min(1).max(100).optional(),
      officeNumber: z.string().min(1).max(100).optional(),
    })
    .optional()
    .nullable(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
