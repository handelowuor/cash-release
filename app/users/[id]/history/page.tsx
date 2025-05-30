"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

interface HistoryItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  performedBy: string;
  category: "system" | "user" | "expense" | "approval";
}

// Mock data for demonstration
const mockUserHistory: Record<string, HistoryItem[]> = {
  "1": [
    {
      id: "hist1",
      action: "User Created",
      description: "User account was created",
      timestamp: "2022-01-15T10:30:00",
      performedBy: "System",
      category: "system",
    },
    {
      id: "hist2",
      action: "Profile Updated",
      description: "User profile information was updated",
      timestamp: "2022-02-20T14:45:00",
      performedBy: "Admin User",
      category: "user",
    },
    {
      id: "hist3",
      action: "Role Changed",
      description: "User role was changed from Employee to HOD",
      timestamp: "2022-03-10T09:15:00",
      performedBy: "Admin User",
      category: "user",
    },
    {
      id: "hist4",
      action: "Expense Submitted",
      description: "User submitted expense report #EXP-2022-001",
      timestamp: "2022-04-05T11:20:00",
      performedBy: "John Doe",
      category: "expense",
    },
    {
      id: "hist5",
      action: "Expense Approved",
      description: "User approved expense report #EXP-2022-002",
      timestamp: "2022-04-15T16:30:00",
      performedBy: "John Doe",
      category: "approval",
    },
    {
      id: "hist6",
      action: "Delegate Added",
      description: "User added Michael Wilson as delegate",
      timestamp: "2022-05-01T10:00:00",
      performedBy: "John Doe",
      category: "user",
    },
    {
      id: "hist7",
      action: "Out of Office Set",
      description: "User set out of office from May 10 to May 20",
      timestamp: "2022-05-05T09:45:00",
      performedBy: "John Doe",
      category: "user",
    },
  ],
  "2": [
    {
      id: "hist8",
      action: "User Created",
      description: "User account was created",
      timestamp: "2021-08-10T08:30:00",
      performedBy: "System",
      category: "system",
    },
    {
      id: "hist9",
      action: "Department Changed",
      description: "User department was changed from Accounting to Finance",
      timestamp: "2021-09-15T13:20:00",
      performedBy: "Admin User",
      category: "user",
    },
  ],
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case "system":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "user":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "expense":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "approval":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function UserHistoryPage({
  params,
}: {
  params?: { id: string };
}) {
  const router = useRouter();
  const userId = params?.id || "1";

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Load user history based on ID
    setHistory(mockUserHistory[userId] || []);

    // Set user name based on ID (in a real app, you would fetch this from your API)
    if (userId === "1") {
      setUserName("John Doe");
    } else if (userId === "2") {
      setUserName("Jane Smith");
    } else {
      setUserName("User");
    }
  }, [userId]);

  const filteredHistory = history.filter(
    (item) =>
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.performedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/users")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{userName}'s History</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
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
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedHistory.length > 0 ? (
            <div className="space-y-4">
              {paginatedHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 border rounded-md hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{item.action}</h4>
                      <Badge
                        variant="outline"
                        className={getCategoryBadgeColor(item.category)}
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>By: {item.performedBy}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No history found</p>
            </div>
          )}

          {filteredHistory.length > 0 && (
            <Pagination
              totalItems={filteredHistory.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
