"use client";

import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show layout with navbar and sidebar on all other pages
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <AppSidebar className="hidden md:flex" />
        <Layout>{children}</Layout>
      </div>
    </SidebarProvider>
  );
}
