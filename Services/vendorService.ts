import { ApiService } from "./apiService";
import { Vendor } from "@/Models/vendor";

export class VendorService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Get all vendors with optional filtering
   */
  async getVendors(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{
    vendors: Vendor[];
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
      vendors: Vendor[];
      total: number;
      page: number;
      limit: number;
    }>(`/vendors?${queryParams.toString()}`);
  }

  /**
   * Get a single vendor by ID
   */
  async getVendor(id: string): Promise<Vendor> {
    return this.apiService.get<Vendor>(`/vendors/${id}`);
  }

  /**
   * Create a new vendor
   */
  async createVendor(
    vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">,
  ): Promise<Vendor> {
    return this.apiService.post<Vendor>("/vendors", vendor);
  }

  /**
   * Update an existing vendor
   */
  async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    return this.apiService.put<Vendor>(`/vendors/${id}`, vendor);
  }

  /**
   * Delete/deactivate a vendor
   */
  async deleteVendor(id: string): Promise<void> {
    return this.apiService.delete<void>(`/vendors/${id}`);
  }
}
