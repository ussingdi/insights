import { z } from "zod";

export const buildingSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  address: z.string().min(1).max(300).optional(),
  latitute: z.string().min(1).max(100).optional(),
  longitude: z.string().min(1).max(100).optional(),
  isArchived: z.boolean().optional(),
  imageURL: z.string().min(1).max(500).optional().nullable(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const availableFloorLevelsSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});

export const buildingDataSchema = z.object({
  id: z.string().uuid().optional(),
  siteName: z.string().min(1).max(100).optional(),
  buildingName: z.string().min(1).max(300).optional(),
  floorName: z.string().min(1).max(100).optional(),
  roomNumber: z.string().min(1).max(100).optional(),
  roomNameA: z.string().min(1).max(100).optional(),
  roomNameB: z.string().min(1).max(100).optional(),
  roomNameC: z.string().min(1).max(100).optional(),
  costCenterNumber: z.string().min(1).max(100).optional(),
  costCenterDescription: z.string().min(1).max(100).optional(),
  areaGross: z.string().min(1).max(100).optional(),
  areaNet: z.string().min(1).max(100).optional(),
  departmentName: z.string().min(1).max(100).optional(),
  departmentNumber: z.string().min(1).max(100).optional(),
  roomType: z.string().min(1).max(100).optional(),
  suite: z.string().min(1).max(100).optional(),
  dateOfConstruction: z.string().min(1).max(100).optional(),
  dateOfRenovation: z.string().min(1).max(100).optional(),
  icraLevel: z.string().min(1).max(100).optional(),
  airPressure: z.string().min(1).max(100).optional(),
  airExchanges: z.string().min(1).max(100).optional(),
  airHandlerUnitZone: z.string().min(1).max(100).optional(),
  exhaustFanZone: z.string().min(1).max(100).optional(),
  sprinkledZone: z.string().min(1).max(100).optional(),
  medGasZone: z.string().min(1).max(100).optional(),
  smokeCompartment: z.string().min(1).max(100).optional(),
  objectId: z.string().min(1).max(100).optional(),
  createdAt: z.string().min(1).max(100).optional(),
  updatedAt: z.string().min(1).max(100).optional(),
});
