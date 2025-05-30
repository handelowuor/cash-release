export enum ExpenseStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED_BY_HOD = "APPROVED_BY_HOD",
  REJECTED_BY_HOD = "REJECTED_BY_HOD",
  APPROVED_BY_FINANCE = "APPROVED_BY_FINANCE",
  REJECTED_BY_FINANCE = "REJECTED_BY_FINANCE",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum ExpenseType {
  ADVANCE = "ADVANCE",
  REIMBURSEMENT = "REIMBURSEMENT",
  ACCOUNTABILITY = "ACCOUNTABILITY",
  PAYOUT = "PAYOUT",
}

export enum ExpenseCategory {
  TRAVEL = "TRAVEL",
  ACCOMMODATION = "ACCOMMODATION",
  MEALS = "MEALS",
  OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
  EQUIPMENT = "EQUIPMENT",
  TRAINING = "TRAINING",
  MARKETING = "MARKETING",
  ENTERTAINMENT = "ENTERTAINMENT",
  COMMUNICATION = "COMMUNICATION",
  MISCELLANEOUS = "MISCELLANEOUS",
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  attachments: Attachment[];
  notes?: string;
  status?: ExpenseStatus; // Added status to track approval at item level
  currency?: string; // Added currency for per-item currency tracking
  exchangeRate?: number; // Added exchange rate for per-item currency conversion
}

export interface Expense {
  id: string;
  requestNumber: string;
  type: ExpenseType;
  status: ExpenseStatus;
  title: string;
  description: string;
  totalAmount: number;
  currency: string;
  items: ExpenseItem[];
  department: string;
  requestedBy: string;
  requestedAt: Date;
  approvedByHOD?: string;
  approvedByHODAt?: Date;
  approvedByFinance?: string;
  approvedByFinanceAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  paidAt?: Date;
  paidBy?: string;
  paymentReference?: string;
  notes?: string;
  isOverBudget: boolean;
  budgetExceptionApproved?: boolean;
  budgetExceptionApprovedBy?: string;
  budgetExceptionApprovedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  department: string;
  month: number;
  year: number;
  amount: number;
  spent: number;
  remaining: number;
  uploadedBy: string;
  uploadedAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  parentDepartment?: string;
  createdAt: Date;
  updatedAt: Date;
}
