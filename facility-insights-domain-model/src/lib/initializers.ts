import { Building, Organization } from "./models.js";

export const organizationInitializer: Organization = {
  id: "",
  name: "",
  description: "",
  isDisabled: false,
  imageURL: "",
  createdAt: "",
  updatedAt: "",
};

export const organizationPackagesInitializer = {
  id: "",
  view: true,
  viewPlus: {
    base: false,
    roomData: false,
    planUpdate: false,
  },

  assesments: {
    base: false,
    icra: false,
    pcra: false,
    condition: false,
    environmentOfCare: false,
  },
  assetManager: false,
  workOrder: false,
  vendorDatabase: false,
  projectInformationCollaborationSystem: false,
  maintenanceManagementSystem: false,
};

export const buildingInitializer: Building = {
  id: "",
  name: "",
  address: "",
  latitute: "",
  longitude: "",
  isArchived: false,
  imageURL: "",
  createdAt: "",
  updatedAt: "",
};
