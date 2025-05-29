import { Module, Action, createPermissionId } from "../Models/permissions";

// Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
const API_AUTHSERVER_BASE_URL = process.env.NEXT_PUBLIC_AUTHSERVER_BASE_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_AUTHSERVER_CLIENT_ID;

// Server-side environment variable (no NEXT_PUBLIC_ prefix)
const CLIENT_SECRET = process.env.AUTHSERVER_CLIENT_SECRET;

// Client-side storage helper (works with SSR)
const storage = {
  getItem: (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

export class AuthService {
  private clientId: string;
  private clientSecret: string | undefined;

  constructor() {
    this.clientId = CLIENT_ID || "default-client-id";

    // Only access clientSecret on the server side
    if (typeof window === "undefined") {
      this.clientSecret = CLIENT_SECRET;
    }

    // Only throw error in production, use default in development
    if (!this.clientId && process.env.NODE_ENV === "production") {
      console.warn("Client ID not provided, using default value");
    }
  }

  async login(username: string, password: string): Promise<any> {
    // This method should only be called from the server side
    if (typeof window !== "undefined") {
      throw new Error("This method should only be called from the server side");
    }

    if (!this.clientSecret) {
      throw new Error("Client Secret is not available");
    }

    const response = await fetch(`${API_AUTHSERVER_BASE_URL}/o/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "password",
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || "Login failed");
    }

    const data = await response.json();
    return data;
  }

  async getUserInfo(token: string): Promise<{
    sub: string;
    email: string;
    userType: string;
    permissions: string[];
    apps: string[];
    role?: string | null;
    modules?: string[];
    features?: string[];
    name?: string;
  }> {
    let response;
    try {
      response = await fetch(`${API_AUTHSERVER_BASE_URL}/o/userinfo/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Check if the error is due to an invalid token
        const errorData = await response.json();
        const errorMessage =
          errorData.error_description || "Fetching User Information failed";

        if (
          response.status === 401 ||
          errorMessage.includes("expired") ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("revoked")
        ) {
          throw new Error("TOKEN_EXPIRED");
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Ensure permissions object exists and has expected structure
      const permissions = data.permissions || {};
      const appPermissions = permissions.app || {};
      const role = appPermissions.roles?.[0] || null;
      const permissionsList = appPermissions.permissions || [];
      const modules = appPermissions.modules || [];
      const features = appPermissions.features || [];
      const apps = Object.keys(permissions || {});
      const name = data.name || "";

      const user = JSON.parse(storage.getItem("user") || "{}");
      user.permissions = permissionsList;
      user.modules = modules;
      user.features = features;
      user.apps = apps;
      user.role = role;
      user.name = name;
      storage.setItem("user", JSON.stringify(user));

      return {
        sub: data.sub,
        email: data.email,
        userType: data.userType,
        permissions: permissionsList,
        apps,
        role,
        modules,
        features,
        name,
      };
    } catch (error) {
      if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
        throw error; // Let the calling function handle token refresh
      }
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    // This method should be called from the client side
    if (typeof window === "undefined") {
      throw new Error("This method should only be called from the client side");
    }

    // Use API route for token refresh instead of direct call
    try {
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Token refresh failed");
      }

      const data = await response.json();
      const token = data.access_token;

      // Update the token in storage
      const user = JSON.parse(storage.getItem("user") || "{}");
      user.token = token;
      storage.setItem("user", JSON.stringify(user));

      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout();
      throw error;
    }

    const response = await fetch(`${API_AUTHSERVER_BASE_URL}/o/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || "Refresh token failed");
    }

    const data = await response.json();
    const token = data.access_token;
    const newRefreshToken = data.refresh_token;
    const expiresIn = data.expires_in;
    const expiresAt = Date.now() + expiresIn * 1000;

    storage.setItem(
      "user",
      JSON.stringify({
        ...user,
        token,
        refreshToken: newRefreshToken,
        expiresAt,
      }),
    );

    return token;
  }

  isTokenExpired(): boolean {
    const user = JSON.parse(storage.getItem("user") || "{}");
    return !user.expiresAt || Date.now() > user.expiresAt;
  }

  async getValidToken(): Promise<string> {
    try {
      if (this.isTokenExpired()) {
        return await this.refreshToken();
      }
      const user = JSON.parse(storage.getItem("user") || "{}");
      return user.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  hasPermission(module: Module, action: Action): boolean {
    const user = JSON.parse(storage.getItem("user") || "{}");
    const userPermissions = user.permissions || [];
    const permissionId = createPermissionId(module, action);
    return userPermissions.includes(permissionId);
  }

  logout(): void {
    storage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}
