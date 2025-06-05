import { ApiService } from "./apiService";
import {
  Expense,
  ExpenseItem,
  ExpenseStatus,
  ExpenseType,
} from "@/Models/expense";

export class ExpenseService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Get all expenses with optional filtering
   */
  async getExpenses(params: {
    page?: number;
    limit?: number;
    status?: ExpenseStatus;
    type?: ExpenseType;
    department?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<{
    expenses: Expense[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<{
      expenses: Expense[];
      total: number;
      page: number;
      limit: number;
    }>(`/expenses?${queryParams.toString()}`);
  }

  /**
   * Get a single expense by ID
   */
  async getExpense(id: string): Promise<Expense> {
    return this.apiService.get<Expense>(`/expenses/${id}`);
  }

  /**
   * Create a new expense
   */
  async createExpense(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt" | "requestNumber">,
  ): Promise<Expense> {
    return this.apiService.post<Expense>("/expenses", expense);
  }

  /**
   * Update an existing expense
   */
  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    return this.apiService.put<Expense>(`/expenses/${id}`, expense);
  }

  /**
   * Delete an expense (draft only)
   */
  async deleteExpense(id: string): Promise<void> {
    return this.apiService.delete<void>(`/expenses/${id}`);
  }

  /**
   * Submit an expense for approval
   */
  async submitExpense(id: string): Promise<Expense> {
    return this.apiService.post<Expense>(`/expenses/${id}/submit`, {});
  }

  /**
   * Approve an expense
   */
  async approveExpense(id: string, notes?: string): Promise<Expense> {
    return this.apiService.post<Expense>(`/expenses/${id}/approve`, { notes });
  }

  /**
   * Reject an expense
   */
  async rejectExpense(id: string, reason: string): Promise<Expense> {
    return this.apiService.post<Expense>(`/expenses/${id}/reject`, { reason });
  }

  /**
   * Mark expense as paid (Finance only)
   */
  async payExpense(id: string, paymentReference: string): Promise<Expense> {
    return this.apiService.post<Expense>(`/expenses/${id}/pay`, {
      paymentReference,
    });
  }

  /**
   * Cancel an expense request
   */
  async cancelExpense(id: string, reason?: string): Promise<Expense> {
    return this.apiService.post<Expense>(`/expenses/${id}/cancel`, { reason });
  }

  /**
   * Get expense approval history
   */
  async getExpenseHistory(id: string): Promise<any[]> {
    return this.apiService.get<any[]>(`/expenses/${id}/history`);
  }

  /**
   * Upload attachment for expense
   */
  async uploadAttachment(
    expenseId: string,
    file: File,
    metadata?: { description?: string },
  ): Promise<any> {
    return this.apiService.uploadFile<any>(
      `/expenses/${expenseId}/attachments`,
      file,
      metadata,
    );
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(
    expenseId: string,
    attachmentId: string,
  ): Promise<void> {
    return this.apiService.delete<void>(
      `/expenses/${expenseId}/attachments/${attachmentId}`,
    );
  }

  /**
   * Check if user has active advance
   */
  async hasActiveAdvance(
    userId?: string,
  ): Promise<{ hasActive: boolean; advanceId?: string }> {
    const endpoint = userId ? `/advances/active/${userId}` : "/advances/active";
    return this.apiService.get<{ hasActive: boolean; advanceId?: string }>(
      endpoint,
    );
  }

  /**
   * Submit accountability for advance
   */
  async submitAccountability(
    advanceId: string,
    data: { items: ExpenseItem[]; notes?: string },
  ): Promise<any> {
    return this.apiService.post<any>(
      `/advances/${advanceId}/accountability`,
      data,
    );
  }
}
