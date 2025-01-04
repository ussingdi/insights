import { z } from "zod";
import { buildingSchema } from "./building.js";
import { userSchema } from "./user.js";

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  isDisabled: z.boolean().optional(),
  imageURL: z.string().min(1).max(500).optional().nullable(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const packagesSchema = z.object({
  id: z.string().uuid().optional(),
  view: z.boolean(),
  viewPlus: z.object({
    base: z.boolean(),
    roomData: z.boolean(),
    planUpdate: z.boolean(),
  }),
  assesments: z.object({
    base: z.boolean(),
    icra: z.boolean(),
    pcra: z.boolean(),
    condition: z.boolean(),
    environmentOfCare: z.boolean(),
  }),
  assetManager: z.boolean(),
  workOrder: z.boolean(),
  vendorDatabase: z.boolean(),
  projectInformationCollaborationSystem: z.boolean(),
  maintenanceManagementSystem: z.boolean(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const regionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(500).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const floorPlanTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  isEnabled: z.boolean().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const buildingTypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const floorLevelSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  index: z.number().min(0).max(99).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const folderTemplateItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const folderTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const memberSchema = z.object({
  id: z.string().uuid().optional(),
  memberType: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const userGroupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const userGroupEnabledRegionSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const userGroupMemberSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const memberRequestSchema = z.object({
  id: z.string().uuid().optional(),
  memberType: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
