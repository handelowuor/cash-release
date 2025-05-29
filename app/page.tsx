"use client";

import LoginPage from "@/components/Login";
import { AuthProvider } from "@/Context/AuthContext";
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

  useEffect(() => {
    // Redirect to dashboard if authenticated
    router.push("/dashboard");
  }, [router]);

  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
};

const HomeContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="h-[100vh]">
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </div>
    );
  }

  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
};

export default Home;
