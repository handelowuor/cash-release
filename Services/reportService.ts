import { ApiService } from "./apiService";

export class ReportService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Generate expense reports
   */
  async getExpenseReport(params: {
    startDate?: string;
    endDate?: string;
    department?: string;
    status?: string;
    type?: string;
    userId?: string;
    groupBy?: "department" | "user" | "status" | "type" | "date";
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<any>(
      `/reports/expenses?${queryParams.toString()}`,
    );
  }

  /**
   * Generate budget utilization reports
   */
  async getBudgetReport(params: {
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
    department?: string;
    businessOrgId?: string;
    countryId?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<any>(
      `/reports/budgets?${queryParams.toString()}`,
    );
  }

  /**
   * Generate department spending reports
   */
  async getDepartmentReport(params: {
    startDate?: string;
    endDate?: string;
    department?: string;
    groupBy?: "category" | "user" | "month";
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<any>(
      `/reports/departments?${queryParams.toString()}`,
    );
  }

  /**
   * Generate user activity reports
   */
  async getUserReport(params: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    department?: string;
    activityType?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<any>(`/reports/users?${queryParams.toString()}`);
  }

  /**
   * Export reports to CSV/Excel
   */
  async exportReport(
    reportType: string,
    params: Record<string, any>,
    format: "csv" | "excel" = "excel",
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append("format", format);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    // Get a valid token
    const authService = new AuthService();
    const token = await authService.getValidToken();

    // Make the request directly to get the blob
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}/reports/export/${reportType}?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    return await response.blob();
  }
}
