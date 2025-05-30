"use client";

import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
