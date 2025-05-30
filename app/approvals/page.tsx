"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ExpenseStatus, ExpenseType } from "@/Models/expense";

type ApprovalItem = {
  id: string;
  requestNumber: string;
  title: string;
  type: ExpenseType;
  status: ExpenseStatus;
  amount: number;
  requestedBy: string;
  requestedAt: string;
  department: string;
};

const mockApprovals: ApprovalItem[] = [
  {
    id: "exp-001",
    requestNumber: "REQ-2023-001",
    title: "Field visit to Nakuru",
    type: ExpenseType.ADVANCE,
    status: ExpenseStatus.SUBMITTED,
    amount: 15000,
    requestedBy: "John Doe",
    requestedAt: "2023-06-15T10:30:00",
    department: "Sales",
  },
  {
    id: "exp-002",
    requestNumber: "REQ-2023-002",
    title: "Office supplies purchase",
    type: ExpenseType.REIMBURSEMENT,
    status: ExpenseStatus.SUBMITTED,
    amount: 5200,
    requestedBy: "Jane Smith",
    requestedAt: "2023-06-14T14:45:00",
    department: "Operations",
  },
  {
    id: "exp-003",
    requestNumber: "REQ-2023-003",
    title: "Client meeting transportation",
    type: ExpenseType.REIMBURSEMENT,
    status: ExpenseStatus.SUBMITTED,
    amount: 3500,
    requestedBy: "Michael Johnson",
    requestedAt: "2023-06-13T09:15:00",
    department: "Marketing",
  },
  {
    id: "exp-004",
    requestNumber: "REQ-2023-004",
    title: "Sales commission Q2",
    type: ExpenseType.PAYOUT,
    status: ExpenseStatus.SUBMITTED,
    amount: 25000,
    requestedBy: "Sarah Williams",
    requestedAt: "2023-06-12T16:20:00",
    department: "Sales",
  },
  {
    id: "exp-005",
    requestNumber: "REQ-2023-005",
    title: "Training workshop materials",
    type: ExpenseType.ADVANCE,
    status: ExpenseStatus.SUBMITTED,
    amount: 8000,
    requestedBy: "David Brown",
    requestedAt: "2023-06-11T11:05:00",
    department: "HR",
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleApprove = (id: string) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id
          ? { ...item, status: ExpenseStatus.APPROVED_BY_HOD }
          : item,
      ),
    );
  };

  const handleReject = (id: string) => {
    setApprovals(
      approvals.map((item) =>
        item.id === id
          ? { ...item, status: ExpenseStatus.REJECTED_BY_HOD }
          : item,
      ),
    );
  };

  const filteredApprovals =
    selectedFilter === "all"
      ? approvals
      : approvals.filter((item) => item.type === selectedFilter);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const paginatedApprovals = filteredApprovals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Pending Approvals</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and approve expense requests from your team
        </p>
      </div>

      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              selectedFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            } border border-gray-200 dark:border-gray-600`}
          >
            All
          </button>
          {Object.values(ExpenseType).map((type, index) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedFilter(type)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedFilter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              } border border-gray-200 dark:border-gray-600 ${index === Object.values(ExpenseType).length - 1 ? "rounded-r-lg" : ""}`}
            >
              {getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Requests Awaiting Your Approval
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
                {paginatedApprovals.map((item) => (
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
                          onClick={() => handleApprove(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(item.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedApprovals.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No pending approvals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={filteredApprovals.length}
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
