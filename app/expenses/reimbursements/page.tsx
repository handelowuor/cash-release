"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { PlusCircle, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

interface Reimbursement {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
}

// Mock data for demonstration
const mockReimbursements: Reimbursement[] = [
  {
    id: "1",
    description: "Office supplies",
    amount: 2500,
    date: "2023-10-15",
    status: "approved",
  },
  {
    id: "2",
    description: "Client meeting lunch",
    amount: 1800,
    date: "2023-10-20",
    status: "pending",
  },
  {
    id: "3",
    description: "Transportation",
    amount: 1200,
    date: "2023-10-25",
    status: "rejected",
  },
  {
    id: "4",
    description: "Conference registration",
    amount: 15000,
    date: "2023-11-01",
    status: "pending",
  },
  {
    id: "5",
    description: "Team building event",
    amount: 8500,
    date: "2023-11-05",
    status: "approved",
  },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function ReimbursementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const filteredReimbursements = mockReimbursements.filter((reimbursement) =>
    reimbursement.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedReimbursements = filteredReimbursements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Reimbursements</h1>
        <Button
          onClick={() => router.push("/expenses/new")}
          className="bg-primary"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Reimbursement
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reimbursements..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Reimbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground">
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Amount (KES)</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReimbursements.map((reimbursement) => (
                  <tr
                    key={reimbursement.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/expenses/reimbursements/${reimbursement.id}`,
                      )
                    }
                  >
                    <td className="py-3 px-4">{reimbursement.description}</td>
                    <td className="py-3 px-4">
                      {reimbursement.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(reimbursement.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(reimbursement.status)}
                      >
                        {reimbursement.status.charAt(0).toUpperCase() +
                          reimbursement.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {paginatedReimbursements.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No reimbursements found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={filteredReimbursements.length}
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
