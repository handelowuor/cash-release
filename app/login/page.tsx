"use client";

import LoginPage from "@/components/Login";
import { AuthProvider } from "@/Context/AuthContext";

export default function Login() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
