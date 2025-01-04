import { z } from "zod";

export const userPreferencesSchema = z.object({
  id: z.string().uuid(),
  darkMode: z.boolean(),
  pinnedBuildings: z.array(z.string().uuid()),
  pinnedProjects: z.array(z.string().uuid()),
  createdAt: z.string().min(1).max(100),
  updatedAt: z.string().min(1).max(100),
});
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export const userPreferencesInitializer = {
  id: "",
  darkMode: false,
  pinnedBuildings: [] as Array<string>,
  pinnedProjects: [] as Array<string>,
  createdAt: "",
  updatedAt: "",
};

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(100),
  company: z.string().min(1).max(100),
  phoneNumber: z.string().min(1).max(100),
  imageURL: z.string().min(1).max(500),
  lastLogin: z.string().min(1).max(100),
  createdAt: z.string().min(1).max(100),
  updatedAt: z.string().min(1).max(100),
  preferences: userPreferencesSchema,
});
export type User = z.infer<typeof userSchema>;
export const userInitializer = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  phoneNumber: "",
  imageURL: "",
  lastLogin: "",
  createdAt: "",
  updatedAt: "",
};
