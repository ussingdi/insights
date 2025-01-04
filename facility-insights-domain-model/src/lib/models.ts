import { z } from "zod";
import {
  buildingTypeSchema,
  floorLevelSchema,
  floorPlanTypeSchema,
  folderTemplateSchema,
  memberSchema,
  organizationSchema,
  regionSchema,
} from "./schemas/organization.js";
import {
  availableFloorLevelsSchema,
  buildingSchema,
} from "./schemas/building.js";

export const organizationModel = organizationSchema.extend({
  regions: z.array(regionSchema).optional(),
  buildingTypes: z.array(buildingTypeSchema).optional(),
  floorPlanTypes: z.array(floorPlanTypeSchema).optional(),
  floorLevels: z.array(floorLevelSchema).optional(),
  folderTemplates: z.array(folderTemplateSchema).optional(),
  members: z.array(memberSchema).optional(),
});

export const organizationMemberModel = memberSchema.extend({
  organization: organizationSchema.optional(),
});
export const regionModel = regionSchema.extend({
  organization: organizationSchema.optional(),
});
export const floorPlanTypeModel = floorPlanTypeSchema.extend({
  organization: organizationSchema.optional(),
});
export const buildingTypeModel = buildingTypeSchema.extend({
  organization: organizationSchema.optional(),
});
export const floorLevelModel = floorLevelSchema.extend({
  organization: organizationSchema.optional(),
});
export const folderTemplateModel = folderTemplateSchema.extend({
  organization: organizationSchema.optional(),
});

export const buildingModel = buildingSchema.extend({
  type: buildingTypeSchema.optional(),
  region: regionSchema.optional(),
  organization: organizationSchema.optional(),
  availableFloorLevels: z.array(availableFloorLevelsSchema).optional(),
});

export const userModel = organizationSchema.extend({});

export type Organization = z.infer<typeof organizationModel>;
export type OrganizationRegion = z.infer<typeof regionModel>;
export type FloorPlanType = z.infer<typeof floorPlanTypeModel>;
export type BuildingType = z.infer<typeof buildingTypeModel>;
export type FloorLevel = z.infer<typeof floorLevelModel>;
export type FolderTemplate = z.infer<typeof folderTemplateModel>;
export type OrganizationMember = z.infer<typeof buildingModel>;
export type Building = z.infer<typeof buildingModel>;
