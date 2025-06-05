import { ApiService } from "./apiService";
import { User, UserRole, UserStatus } from "@/Models/user";

export class UserService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * Get all users with optional filtering
   */
  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    department?: string;
    search?: string;
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();

    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.apiService.get<{
      users: User[];
      total: number;
      page: number;
      limit: number;
    }>(`/users?${queryParams.toString()}`);
  }

  /**
   * Get a single user by ID
   */
  async getUser(id: string): Promise<User> {
    return this.apiService.get<User>(`/users/${id}`);
  }

  /**
   * Create a new user
   */
  async createUser(user: Omit<User, "id">): Promise<User> {
    return this.apiService.post<User>("/users", user);
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.apiService.put<User>(`/users/${id}`, user);
  }

  /**
   * Delete/deactivate a user
   */
  async deleteUser(id: string): Promise<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }

  /**
   * Get user activity history
   */
  async getUserHistory(id: string): Promise<any[]> {
    return this.apiService.get<any[]>(`/users/${id}/history`);
  }

  /**
   * Set delegation for user absence
   */
  async setDelegation(data: {
    userId: string;
    delegateId: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<any> {
    return this.apiService.post<any>("/users/delegate", data);
  }

  /**
   * Get current user's delegations
   */
  async getMyDelegations(): Promise<any[]> {
    return this.apiService.get<any[]>("/users/delegations/my");
  }

  /**
   * Get delegations where user is the delegate
   */
  async getDelegationsToMe(): Promise<any[]> {
    return this.apiService.get<any[]>("/users/delegations/to-me");
  }
}
