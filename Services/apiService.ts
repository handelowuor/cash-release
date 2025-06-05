import { AuthService } from "./authService";

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export class ApiService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Makes an authenticated API request
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Get a valid token (will refresh if needed)
      const token = await this.authService.getValidToken();

      // Set up headers with authentication
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      // Make the request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API request failed with status ${response.status}`,
        );
      }

      // Parse and return the response data
      return await response.json();
    } catch (error) {
      // Handle token expiration
      if (error instanceof Error && error.message.includes("TOKEN_EXPIRED")) {
        // Try to refresh the token and retry the request
        try {
          await this.authService.refreshToken();
          return this.request<T>(endpoint, options);
        } catch (refreshError) {
          // If refresh fails, logout and redirect to login
          this.authService.logout();
          throw new Error("Session expired. Please login again.");
        }
      }

      // Re-throw other errors
      throw error;
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // File upload method
  async uploadFile<T>(
    endpoint: string,
    file: File,
    metadata?: any,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    const token = await this.authService.getValidToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `File upload failed with status ${response.status}`,
      );
    }

    return await response.json();
  }
}
