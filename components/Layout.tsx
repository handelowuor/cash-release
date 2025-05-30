"use client";

import Navbar from "./Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex">
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <div className="mx-auto max-w-7xl p-4 md:p-8 pt-6 space-y-4">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
