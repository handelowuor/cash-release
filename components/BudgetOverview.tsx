"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

type BudgetData = {
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: "healthy" | "warning" | "critical";
};

const budgetData: BudgetData[] = [
  {
    department: "Sales",
    allocated: 50000,
    spent: 32500,
    remaining: 17500,
    status: "healthy",
  },
  {
    department: "Marketing",
    allocated: 30000,
    spent: 27000,
    remaining: 3000,
    status: "warning",
  },
  {
    department: "Engineering",
    allocated: 80000,
    spent: 45000,
    remaining: 35000,
    status: "healthy",
  },
  {
    department: "Customer Support",
    allocated: 25000,
    spent: 24800,
    remaining: 200,
    status: "critical",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

import { formatCurrency } from "@/lib/currency";

// Using the imported formatCurrency function instead

export function BudgetOverview() {
  const totalAllocated = budgetData.reduce(
    (sum, budget) => sum + budget.allocated,
    0,
  );
  const totalSpent = budgetData.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgetData.reduce(
    (sum, budget) => sum + budget.remaining,
    0,
  );
  const spentPercentage = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Budget
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(totalAllocated)}
                </p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Spent ({spentPercentage}%)
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remaining
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 px-1">
            <span>Department</span>
            <div className="flex items-center gap-4">
              <span className="w-20 text-right">Spent</span>
              <span className="w-20 text-right">Remaining</span>
              <span className="w-16 text-right">Status</span>
            </div>
          </div>

          {budgetData.map((budget) => {
            const spentPercentage = Math.round(
              (budget.spent / budget.allocated) * 100,
            );
            return (
              <div
                key={budget.department}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="font-medium">{budget.department}</div>
                <div className="flex items-center gap-4">
                  <div className="w-20 text-right">
                    <div className="font-medium">
                      {formatCurrency(budget.spent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {spentPercentage}%
                    </div>
                  </div>
                  <div className="w-20 text-right font-medium">
                    {formatCurrency(budget.remaining)}
                  </div>
                  <div className="w-16 text-right">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(budget.status)}
                    >
                      {budget.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
