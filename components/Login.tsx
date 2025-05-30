"use client";

import type React from "react";
import { useAuth } from "@/Context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import FinanceCarousel from "@/components/Finance-carousel";
import suncultureLogo from "@/assets/logo.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    setLoginAttempts((prev) => prev + 1);

    // Form validation
    if (!identifier.trim()) {
      setLoginError("Please enter your email/phone/username");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // Use the login function from AuthContext
      await login(identifier, password, "/dashboard");
      // Login successful - the AuthContext will handle state updates
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(
        error.message ||
          "Login failed. Please check your credentials and try again.",
      );
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Implement Google OAuth here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a8e6c0] via-[#c1f0d3] to-[#d5f7e3] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
        {/* Left side - Finance Carousel */}
        <div className="hidden lg:flex h-full min-h-[600px] w-full p-4 overflow-hidden">
          <FinanceCarousel />
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white">
            <CardHeader className="space-y-1 text-center">
              <Image
                src={suncultureLogo}
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto"
              />
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Access your cash release dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email or Username
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@sunculture.com"
                    className="h-11 border-gray-200 focus:border-[#8bc34a] focus:ring-[#8bc34a]"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-11 pr-10 border-gray-200 focus:border-[#8bc34a] focus:ring-[#8bc34a]"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300 text-[#8bc34a] focus:ring-[#8bc34a]"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="px-0 text-[#8bc34a] hover:text-[#689f38]"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#8bc34a] hover:bg-[#689f38] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? "Connecting..." : "Sign in with Google"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Not registered yet?{" "}
                <Button
                  variant="link"
                  className="px-0 text-[#8bc34a] hover:text-[#689f38]"
                >
                  Contact your admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p className="flex items-center justify-center">
          <span className="text-[#ff9800] mr-1">🔆</span>
          Life-Changing Technology for everyday challenges
        </p>
        <p className="mt-1">
          © SunCulture |
          <Button
            variant="link"
            className="px-1 text-sm text-gray-600 hover:text-[#8bc34a]"
          >
            Privacy
          </Button>{" "}
          |
          <Button
            variant="link"
            className="px-1 text-sm text-gray-600 hover:text-[#8bc34a]"
          >
            Terms
          </Button>
        </p>
      </div>
    </div>
  );
}
