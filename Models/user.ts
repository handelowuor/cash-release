export enum UserRole {
  EMPLOYEE = "Employee",
  HOD = "HOD",
  FINANCE = "Finance",
  GENERAL_MANAGER = "General Manager",
  ADMIN = "Admin",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  SUSPENDED = "Suspended",
}

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  email: string;
  employeeId?: string;
  mobile?: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  dateOfJoining?: string;
  dateOfBirth?: string;
  designation?: string;
}
