"use client";

import LoginPage from "@/components/Login";
import Layout from "@/components/Layout";
import { MobileAppResourcesSection } from "@/components/MobileAppResourcesSections";
import { PendingTasksSection } from "@/components/PendingTasksSection";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { WelcomeSection } from "@/components/Welcome";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardContent = () => (
  <div className="space-y-8">
    <WelcomeSection />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PendingTasksSection />
      <QuickLinksSection />
    </div>
    <MobileAppResourcesSection />
  </div>
);

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, authAttempted } = useAuth();

  useEffect(() => {
    // Only redirect if we've confirmed authentication status
    if (!isLoading && authAttempted && isAuthenticated) {
      console.log("Home: User is authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [router, isAuthenticated, isLoading, authAttempted]);

  // Add a console log to track render cycles
  useEffect(() => {
    console.log("Home component rendered", {
      isAuthenticated,
      isLoading,
      authAttempted,
    });
  }, [isAuthenticated, isLoading, authAttempted]);

  return <HomeContent />;
};

const HomeContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="h-[100vh]">
        <LoginPage />
      </div>
    );
  }

  return <DashboardContent />;
};

export default Home;
