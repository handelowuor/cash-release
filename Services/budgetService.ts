import { ApiService } from "./apiService";
import { Budget, BudgetUploadType } from "@/Models/expense";

export class BudgetService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Get all budgets with optional filtering
   */
  async getBudgets(params: {
    page?: number;
    limit?: number;
    department?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
    businessOrgId?: string;
    countryId?: string;
  }): Promise<{
    budgets: Budget[];
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
      budgets: Budget[];
      total: number;
      page: number;
      limit: number;
    }>(`/budgets?${queryParams.toString()}`);
  }

  /**
   * Get a single budget by ID
   */
  async getBudget(id: string): Promise<Budget> {
    return this.apiService.get<Budget>(`/budgets/${id}`);
  }

  /**
   * Create a new budget
   */
  async createBudget(
    budget: Omit<
      Budget,
      "id" | "createdAt" | "updatedAt" | "spent" | "remaining"
    >,
  ): Promise<Budget> {
    return this.apiService.post<Budget>("/budgets", budget);
  }

  /**
   * Update an existing budget
   */
  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    return this.apiService.put<Budget>(`/budgets/${id}`, budget);
  }

  /**
   * Delete a budget
   */
  async deleteBudget(id: string): Promise<void> {
    return this.apiService.delete<void>(`/budgets/${id}`);
  }

  /**
   * Get budgets for a specific department
   */
  async getDepartmentBudgets(
    departmentId: string,
    year?: number,
    month?: number,
  ): Promise<Budget[]> {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append("year", year.toString());
    if (month) queryParams.append("month", month.toString());

    return this.apiService.get<Budget[]>(
      `/budgets/departments/${departmentId}?${queryParams.toString()}`,
    );
  }

  /**
   * Get budget modification history
   */
  async getBudgetHistory(id: string): Promise<any[]> {
    return this.apiService.get<any[]>(`/budgets/history/${id}`);
  }

  /**
   * Upload budgets in bulk (CSV/Excel)
   */
  async uploadBudgets(
    file: File,
    options?: { uploadType?: BudgetUploadType },
  ): Promise<{ success: boolean; imported: number; errors: any[] }> {
    return this.apiService.uploadFile<{
      success: boolean;
      imported: number;
      errors: any[];
    }>("/budgets/upload", file, options);
  }

  /**
   * Get budget summary for dashboard
   */
  async getBudgetSummary(params: {
    departmentId?: string;
    year?: number;
    month?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<any>(
      `/dashboard/budget-status?${queryParams.toString()}`,
    );
  }
}
