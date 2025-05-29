import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  CreditCard,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  {
    title: "New Expense",
    description: "Submit a new expense or reimbursement",
    icon: Receipt,
    href: "/expenses/new",
    color: "text-green-600 bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Request Advance",
    description: "Request and manage cash advances",
    icon: CreditCard,
    href: "/expenses/new",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Approvals",
    description: "Review and approve pending requests",
    icon: CheckCircle,
    href: "/approvals",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "Manage Users",
    description: "Add and manage user accounts",
    icon: Users,
    href: "/users",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20",
  },
];

export function QuickLinksSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {quickLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              className="h-auto p-6 flex flex-col items-start space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              asChild
            >
              <a href={link.href}>
                <div className={`p-3 rounded-lg ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
