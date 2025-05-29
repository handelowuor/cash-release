"use client";

import Navbar from "./Navbar";
import AppSidebar from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/Context/AuthContext";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex">
          <AppSidebar />
          <SidebarInset>
            <Navbar />
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
