"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/Services/authService";

interface User {
  id: string | number | null;
  email: string;
  name?: string;
  role?: string;
  userType?: string;
  permissions?: string[];
  modules?: string[];
  features?: string[];
  apps?: string[];
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  userRoles: string[];
  userPermissions: string[];
  login: (
    identifier: string,
    password: string,
    redirectPath?: string,
  ) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  checkPermission: (module: string, action: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authService = new AuthService();
  const isAuthenticated = !!user?.token;

  // Debug authentication state
  useEffect(() => {
    console.log("Authentication state changed:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!user?.token,
      tokenLength: user?.token ? user.token.length : 0,
      permissions: user?.permissions?.length || 0,
    });
  }, [isAuthenticated, user]);

  const checkPermission = async (
    module: string,
    action: string,
  ): Promise<boolean> => {
    return userPermissions.includes(`${module}.${action}`);
  };

  // Check localStorage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
          setUserRoles(parsedUser.role ? [parsedUser.role] : []);
          setUserPermissions(parsedUser.permissions || []);
          console.log("User authenticated from localStorage", {
            isAuthenticated: true,
            token: parsedUser.token.substring(0, 10) + "...",
            permissions: parsedUser.permissions?.length || 0,
          });
        } else {
          console.log("Invalid user data in localStorage");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (
    identifier: string,
    password: string,
    redirectPath?: string,
  ) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", { identifier });

      // Use API route instead of direct authService call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
        credentials: "include", // Include cookies in the request
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const tokenResponse = await response.json();
      console.log("Token response received", { hasToken: !!tokenResponse });

      // Handle different response formats
      const token = tokenResponse.access_token || tokenResponse;

      // Store the token immediately to ensure it's available for potential refresh
      const tempUser = { token };
      localStorage.setItem("user", JSON.stringify(tempUser));

      let userInfo;
      try {
        userInfo = await authService.getUserInfo(token);
      } catch (error) {
        if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
          // Try to refresh the token and retry getUserInfo
          try {
            const newToken = await authService.refreshToken();
            userInfo = await authService.getUserInfo(newToken);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            throw new Error("Session expired. Please login again.");
          }
        } else {
          throw error;
        }
      }

      const {
        sub,
        permissions,
        apps,
        name,
        role,
        modules,
        features,
        userType,
      } = userInfo;
      const newUser: User = {
        id: sub ?? null,
        email: identifier,
        name: name || "",
        role: role ?? undefined,
        userType: userType,
        permissions: permissions || [],
        modules: modules || [],
        features: features || [],
        apps: apps || [],
        token,
      };
      // Store in state and localStorage
      setUser(newUser);
      setUserRoles(role ? [role] : []);
      setUserPermissions(permissions || []);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Redirect to dashboard after successful login if no specific path is provided
      if (redirectPath) {
        window.location.href = redirectPath;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("user");
    setUser(null);
    setUserRoles([]);
    setUserPermissions([]);
    // Use window.location instead of navigate
    window.location.href = "/login";
  };

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRoles,
        userPermissions,
        login,
        logout,
        hasPermission,
        checkPermission,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
