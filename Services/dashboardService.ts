import { ApiService } from "./apiService";

export class DashboardService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Get dashboard summary data
   */
  async getDashboardSummary(): Promise<any> {
    return this.apiService.get<any>("/dashboard/summary");
  }

  /**
   * Get pending approvals count
   */
  async getPendingApprovals(): Promise<{ count: number; items: any[] }> {
    return this.apiService.get<{ count: number; items: any[] }>(
      "/dashboard/pending-approvals",
    );
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    return this.apiService.get<any[]>(
      `/dashboard/recent-activity?limit=${limit}`,
    );
  }

  /**
   * Get budget status overview
   */
  async getBudgetStatus(params?: { departmentId?: string }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.apiService.get<any>(
      `/dashboard/budget-status${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    );
  }

  /**
   * Get expense trends data
   */
  async getExpenseTrends(params?: {
    departmentId?: string;
    period?: "week" | "month" | "quarter" | "year";
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.apiService.get<any>(
      `/dashboard/expense-trends${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    );
  }
}
