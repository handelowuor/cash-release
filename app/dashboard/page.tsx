import { WelcomeSection } from "@/components/Welcome";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { PendingTasksSection } from "@/components/PendingTasksSection";
import { BudgetOverview } from "@/components/BudgetOverview";
import { RecentActivity } from "@/components/RecentActivity";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarProvider>
        <AppSidebar className="hidden md:flex" />
      </SidebarProvider>

      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="space-y-8">
            <WelcomeSection />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickLinksSection />
              <PendingTasksSection />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BudgetOverview />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
