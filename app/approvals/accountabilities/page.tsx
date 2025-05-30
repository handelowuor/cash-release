"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ExpenseStatus, ExpenseType } from "@/Models/expense";
import { useRouter } from "next/navigation";

type AccountabilityItem = {
  id: string;
  requestNumber: string;
  title: string;
  type: ExpenseType;
  status: ExpenseStatus;
  amount: number;
  requestedBy: string;
  requestedAt: string;
  department: string;
  originalExpenseId: string;
};

const mockAccountabilities: AccountabilityItem[] = [
  {
    id: "acc-001",
    requestNumber: "ACC-2023-001",
    title: "Field visit to Nakuru - Accountability",
    type: ExpenseType.ACCOUNTABILITY,
    status: ExpenseStatus.SUBMITTED,
    amount: 14500,
    requestedBy: "John Doe",
    requestedAt: "2023-06-20T10:30:00",
    department: "Sales",
    originalExpenseId: "exp-001",
  },
  {
    id: "acc-002",
    requestNumber: "ACC-2023-002",
    title: "Conference attendance - Accountability",
    type: ExpenseType.ACCOUNTABILITY,
    status: ExpenseStatus.SUBMITTED,
    amount: 22000,
    requestedBy: "Jane Smith",
    requestedAt: "2023-06-19T14:45:00",
    department: "Operations",
    originalExpenseId: "exp-004",
  },
  {
    id: "acc-003",
    requestNumber: "ACC-2023-003",
    title: "Training workshop - Accountability",
    type: ExpenseType.ACCOUNTABILITY,
    status: ExpenseStatus.SUBMITTED,
    amount: 7800,
    requestedBy: "David Brown",
    requestedAt: "2023-06-18T09:15:00",
    department: "HR",
    originalExpenseId: "exp-005",
  },
];

const getTypeLabel = (type: ExpenseType) => {
  switch (type) {
    case ExpenseType.ADVANCE:
      return "Advance";
    case ExpenseType.REIMBURSEMENT:
      return "Reimbursement";
    case ExpenseType.ACCOUNTABILITY:
      return "Accountability";
    case ExpenseType.PAYOUT:
      return "Payout";
    default:
      return "Unknown";
  }
};

const getTypeColor = (type: ExpenseType) => {
  switch (type) {
    case ExpenseType.ADVANCE:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case ExpenseType.REIMBURSEMENT:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case ExpenseType.ACCOUNTABILITY:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case ExpenseType.PAYOUT:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

import { formatCurrency } from "@/lib/currency";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function AccountabilitiesPage() {
  const router = useRouter();
  const [accountabilities, setAccountabilities] =
    useState<AccountabilityItem[]>(mockAccountabilities);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleApproveItem = (accountabilityId: string, itemId: string) => {
    // In a real implementation, this would update just the specific item
    // For now, we'll just update the whole accountability status as a placeholder
    setAccountabilities(
      accountabilities.map((accountability) =>
        accountability.id === accountabilityId
          ? { ...accountability, status: ExpenseStatus.APPROVED_BY_HOD }
          : accountability,
      ),
    );
  };

  const handleRejectItem = (accountabilityId: string, itemId: string) => {
    // In a real implementation, this would update just the specific item
    // For now, we'll just update the whole accountability status as a placeholder
    setAccountabilities(
      accountabilities.map((accountability) =>
        accountability.id === accountabilityId
          ? { ...accountability, status: ExpenseStatus.REJECTED_BY_HOD }
          : accountability,
      ),
    );
  };

  // Pagination logic
  const paginatedAccountabilities = accountabilities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Pending Accountabilities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and approve accountability reports for advances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Accountability Reports Awaiting Your Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Request
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Requested By
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccountabilities.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.requestNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={getTypeColor(item.type)}
                      >
                        {getTypeLabel(item.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4">{item.requestedBy}</td>
                    <td className="px-6 py-4">{item.department}</td>
                    <td className="px-6 py-4">
                      {formatDate(item.requestedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/approvals/accountabilities/detail/${item.id}`,
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Review Items
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedAccountabilities.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No pending accountabilities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={accountabilities.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
