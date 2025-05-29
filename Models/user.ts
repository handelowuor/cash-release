export enum UserRole {
  EMPLOYEE = "EMPLOYEE",
  HOD = "HOD",
  FINANCE = "FINANCE",
  GENERAL_MANAGER = "GENERAL_MANAGER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface User {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  position?: string;
  manager?: string;
  delegatedApprover?: string;
  delegationStartDate?: Date;
  delegationEndDate?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  updatedAt: Date;
}
