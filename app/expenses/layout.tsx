"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, authAttempted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've confirmed the user is not authenticated
    // and authentication has been attempted (to prevent redirect loops)
    if (!isLoading && authAttempted && !isAuthenticated) {
      console.log("Expenses: Not authenticated, redirecting to login", {
        user,
        authAttempted,
      });
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      console.log("Expenses: User is authenticated", {
        hasUser: !!user,
        hasToken: !!user?.token,
        tokenLength: user?.token ? user.token.length : 0,
      });
    }
  }, [isAuthenticated, isLoading, router, user, authAttempted]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}
