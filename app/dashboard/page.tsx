import { WelcomeSection } from "@/components/Welcome";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { PendingTasksSection } from "@/components/PendingTasksSection";
import { BudgetOverview } from "@/components/BudgetOverview";
import { RecentActivity } from "@/components/RecentActivity";

export default function DashboardPage() {
  return (
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
  );
}
