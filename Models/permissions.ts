// Permission model to define what actions users can perform

export interface Permission {
    id: string;
    name: string;
    description: string;
    module: string;
    action: string;
    countryId?: string; // Optional country ID for country-specific permissions
    createdAt: string;
    updatedAt: string;
  }

export enum Module {
    User = "User",
    Role = "Role",
    Permission = "Permission",
    Country = "Country",
    Currency = "Currency",
}

export enum Action {
    Create = "Create",
    Read = "Read",
    Update = "Update",
    Delete = "Delete",
}


// Helper function to create a permission ID
export const createPermissionId = (
    module: string,
    action: string,
    countryId?: string,
  ): string => {
    return countryId ? `${module}.${action}.${countryId}` : `${module}.${action}`;
  };
  
  // Helper function to create a permission object
  export const createPermission = (
    module: string,
    action: string,
    description: string,
    countryId?: string,
  ): Permission => {
    const now = new Date().toISOString();
    return {
      id: createPermissionId(module, action, countryId),
      name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${module}`,
      description,
      module,
      action,
      countryId,
      createdAt: now,
      updatedAt: now,
    };
  };
    