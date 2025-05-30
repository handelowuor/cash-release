import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityItem = {
  id: string;
  type: "advance" | "expense" | "reimbursement" | "payout";
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  date: string;
  user: string;
};

const recentActivity: ActivityItem[] = [
  {
    id: "ACT-001",
    type: "advance",
    description: "Field visit to Nakuru",
    amount: 15000,
    status: "approved",
    date: "2023-06-15T10:30:00",
    user: "John Doe",
  },
  {
    id: "ACT-002",
    type: "expense",
    description: "Office supplies purchase",
    amount: 5200,
    status: "pending",
    date: "2023-06-14T14:45:00",
    user: "Jane Smith",
  },
  {
    id: "ACT-003",
    type: "reimbursement",
    description: "Client meeting transportation",
    amount: 3500,
    status: "completed",
    date: "2023-06-13T09:15:00",
    user: "Michael Johnson",
  },
  {
    id: "ACT-004",
    type: "payout",
    description: "Sales commission Q2",
    amount: 25000,
    status: "rejected",
    date: "2023-06-12T16:20:00",
    user: "Sarah Williams",
  },
  {
    id: "ACT-005",
    type: "advance",
    description: "Training workshop materials",
    amount: 8000,
    status: "pending",
    date: "2023-06-11T11:05:00",
    user: "David Brown",
  },
];

const getTypeLabel = (type: string) => {
  switch (type) {
    case "advance":
      return "Advance";
    case "expense":
      return "Expense";
    case "reimbursement":
      return "Reimbursement";
    case "payout":
      return "Payout";
    default:
      return "Transaction";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "advance":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "expense":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "reimbursement":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "payout":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

import { formatCurrency } from "@/lib/currency";

// Using the imported formatCurrency function instead

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={getTypeColor(activity.type)}
                  >
                    {getTypeLabel(activity.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.id}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={getStatusColor(activity.status)}
                >
                  {activity.status}
                </Badge>
              </div>
              <div className="font-medium">{activity.description}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{activity.user}</span>
                <span className="font-medium">
                  {formatCurrency(activity.amount)}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-right">
                {formatDate(activity.date)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
