"use client";

import { useState } from "react";
import { formatCurrency, currencies, Currency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Filter,
  Download,
  Users,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";

// Types based on the backend payload
interface BudgetRequest {
  id: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "VOIDED";
  approvalComments: string;
  approvedBy: string;
  dateApproved: string | null;
  approver: number;
  voidBudget: boolean;
  budgetAmount: number;
  approvedAmount: number;
  budgetReason: string;
  userId: number;
  userName: string;
  userEmail: string;
  expenseCategoriesId: number;
  expenseCategoryName: string;
  cashReleaseExpenseId: number;
  regionId: number;
  regionName: string;
  suncultureDepartmentsId: number;
  departmentName: string;
  cashReleaseExpenseItemId: number;
  requestDate: string;
  currencyCode: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

// Mock departments data
const departments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Sales" },
  { id: 5, name: "HR" },
  { id: 6, name: "Operations" },
  { id: 7, name: "Product" },
  { id: 8, name: "Customer Success" },
];

// Mock regions data
const regions = [
  { id: 1, name: "Kenya" },
  { id: 2, name: "Uganda" },
  { id: 3, name: "Tanzania" },
  { id: 4, name: "Nigeria" },
  { id: 5, name: "Ethiopia" },
];

// Mock expense categories data
const expenseCategories = [
  { id: 1, name: "Travel" },
  { id: 2, name: "Accommodation" },
  { id: 3, name: "Meals" },
  { id: 4, name: "Office Supplies" },
  { id: 5, name: "Equipment" },
  { id: 6, name: "Training" },
  { id: 7, name: "Marketing" },
  { id: 8, name: "Software" },
];

// Mock budget requests data
const initialBudgetRequests: BudgetRequest[] = [
  {
    id: "BR001",
    approvalStatus: "PENDING",
    approvalComments: "",
    approvedBy: "",
    dateApproved: null,
    approver: 0,
    voidBudget: false,
    budgetAmount: 50000,
    approvedAmount: 0,
    budgetReason: "New project equipment and software licenses",
    userId: 1,
    userName: "John Doe",
    userEmail: "john.doe@sunculture.com",
    expenseCategoriesId: 5,
    expenseCategoryName: "Equipment",
    cashReleaseExpenseId: 101,
    regionId: 1,
    regionName: "Kenya",
    suncultureDepartmentsId: 1,
    departmentName: "Engineering",
    cashReleaseExpenseItemId: 201,
    requestDate: "2024-01-15",
    currencyCode: "KES",
    priority: "HIGH",
  },
  {
    id: "BR002",
    approvalStatus: "APPROVED",
    approvalComments: "Approved for Q1 marketing campaign",
    approvedBy: "Jane Smith",
    dateApproved: "2024-01-10",
    approver: 2,
    voidBudget: false,
    budgetAmount: 75000,
    approvedAmount: 70000,
    budgetReason: "Q1 digital marketing campaign budget",
    userId: 3,
    userName: "Mike Johnson",
    userEmail: "mike.johnson@sunculture.com",
    expenseCategoriesId: 7,
    expenseCategoryName: "Marketing",
    cashReleaseExpenseId: 102,
    regionId: 2,
    regionName: "Uganda",
    suncultureDepartmentsId: 3,
    departmentName: "Marketing",
    cashReleaseExpenseItemId: 202,
    requestDate: "2024-01-08",
    currencyCode: "UGX",
    priority: "MEDIUM",
  },
  {
    id: "BR003",
    approvalStatus: "REJECTED",
    approvalComments: "Budget exceeds quarterly allocation. Please revise.",
    approvedBy: "Sarah Williams",
    dateApproved: "2024-01-12",
    approver: 4,
    voidBudget: false,
    budgetAmount: 120000,
    approvedAmount: 0,
    budgetReason: "Office renovation and new furniture",
    userId: 5,
    userName: "David Brown",
    userEmail: "david.brown@sunculture.com",
    expenseCategoriesId: 4,
    expenseCategoryName: "Office Supplies",
    cashReleaseExpenseId: 103,
    regionId: 3,
    regionName: "Tanzania",
    suncultureDepartmentsId: 6,
    departmentName: "Operations",
    cashReleaseExpenseItemId: 203,
    requestDate: "2024-01-05",
    currencyCode: "TZS",
    priority: "LOW",
  },
  {
    id: "BR004",
    approvalStatus: "PENDING",
    approvalComments: "",
    approvedBy: "",
    dateApproved: null,
    approver: 0,
    voidBudget: false,
    budgetAmount: 35000,
    approvedAmount: 0,
    budgetReason: "Team training and certification programs",
    userId: 7,
    userName: "Lisa Anderson",
    userEmail: "lisa.anderson@sunculture.com",
    expenseCategoriesId: 6,
    expenseCategoryName: "Training",
    cashReleaseExpenseId: 104,
    regionId: 1,
    regionName: "Kenya",
    suncultureDepartmentsId: 5,
    departmentName: "HR",
    cashReleaseExpenseItemId: 204,
    requestDate: "2024-01-18",
    currencyCode: "KES",
    priority: "MEDIUM",
  },
  {
    id: "BR005",
    approvalStatus: "VOIDED",
    approvalComments: "Request voided due to project cancellation",
    approvedBy: "Admin User",
    dateApproved: "2024-01-14",
    approver: 1,
    voidBudget: true,
    budgetAmount: 90000,
    approvedAmount: 0,
    budgetReason: "Software development tools and infrastructure",
    userId: 9,
    userName: "Tom Wilson",
    userEmail: "tom.wilson@sunculture.com",
    expenseCategoriesId: 8,
    expenseCategoryName: "Software",
    cashReleaseExpenseId: 105,
    regionId: 4,
    regionName: "Nigeria",
    suncultureDepartmentsId: 1,
    departmentName: "Engineering",
    cashReleaseExpenseItemId: 205,
    requestDate: "2024-01-03",
    currencyCode: "USD",
    priority: "URGENT",
  },
  {
    id: "BR006",
    approvalStatus: "PENDING",
    approvalComments: "",
    approvedBy: "",
    dateApproved: null,
    approver: 0,
    voidBudget: false,
    budgetAmount: 25000,
    approvedAmount: 0,
    budgetReason: "Customer success tools and subscriptions",
    userId: 11,
    userName: "Emma Davis",
    userEmail: "emma.davis@sunculture.com",
    expenseCategoriesId: 8,
    expenseCategoryName: "Software",
    cashReleaseExpenseId: 106,
    regionId: 1,
    regionName: "Kenya",
    suncultureDepartmentsId: 8,
    departmentName: "Customer Success",
    cashReleaseExpenseItemId: 206,
    requestDate: "2024-01-20",
    currencyCode: "KES",
    priority: "MEDIUM",
  },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  VOIDED: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-orange-100 text-orange-800",
  HIGH: "bg-red-100 text-red-800",
  URGENT: "bg-purple-100 text-purple-800",
};

export default function BudgetRequestsPage() {
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>(
    initialBudgetRequests,
  );
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "void" | null
  >(null);
  const [actionComments, setActionComments] = useState("");
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [currentRequest, setCurrentRequest] = useState<BudgetRequest | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("requests");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    region: "all",
    category: "all",
    priority: "all",
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  // Filtered requests
  const filteredRequests = budgetRequests.filter((request) => {
    const matchesStatus =
      filters.status === "all" || request.approvalStatus === filters.status;
    const matchesDepartment =
      filters.department === "all" ||
      request.suncultureDepartmentsId.toString() === filters.department;
    const matchesRegion =
      filters.region === "all" ||
      request.regionId.toString() === filters.region;
    const matchesCategory =
      filters.category === "all" ||
      request.expenseCategoriesId.toString() === filters.category;
    const matchesPriority =
      filters.priority === "all" || request.priority === filters.priority;
    const matchesDateFrom =
      !filters.dateFrom ||
      new Date(request.requestDate) >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo ||
      new Date(request.requestDate) <= new Date(filters.dateTo);
    const matchesSearch =
      !filters.searchTerm ||
      request.budgetReason
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      request.userName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return (
      matchesStatus &&
      matchesDepartment &&
      matchesRegion &&
      matchesCategory &&
      matchesPriority &&
      matchesDateFrom &&
      matchesDateTo &&
      matchesSearch
    );
  });

  // Paginated requests
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(paginatedRequests.map((req) => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  // Handle individual checkbox
  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests((prev) => [...prev, requestId]);
    } else {
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  // Handle single action
  const handleSingleAction = (
    request: BudgetRequest,
    action: "approve" | "reject" | "void",
  ) => {
    setCurrentRequest(request);
    setActionType(action);
    setApprovedAmount(request.budgetAmount);
    setActionComments("");
    setShowActionDialog(true);
  };

  // Handle bulk action
  const handleBulkAction = (action: "approve" | "reject" | "void") => {
    if (selectedRequests.length === 0) {
      alert("Please select at least one request");
      return;
    }
    setCurrentRequest(null);
    setActionType(action);
    setActionComments("");
    setShowActionDialog(true);
  };

  // Process action
  const processAction = () => {
    const now = new Date().toISOString().split("T")[0];
    const requestsToUpdate = currentRequest
      ? [currentRequest.id]
      : selectedRequests;

    setBudgetRequests((prev) =>
      prev.map((request) => {
        if (requestsToUpdate.includes(request.id)) {
          return {
            ...request,
            approvalStatus:
              actionType === "approve"
                ? "APPROVED"
                : actionType === "reject"
                  ? "REJECTED"
                  : "VOIDED",
            approvalComments: actionComments,
            approvedBy: "Current User", // In real app, get from auth context
            dateApproved: now,
            approver: 1, // In real app, get from auth context
            approvedAmount:
              actionType === "approve"
                ? currentRequest
                  ? approvedAmount
                  : request.budgetAmount
                : 0,
            voidBudget: actionType === "void",
          };
        }
        return request;
      }),
    );

    setShowActionDialog(false);
    setSelectedRequests([]);
    setCurrentRequest(null);
    setActionType(null);
    setActionComments("");
    setApprovedAmount(0);
  };

  // Get statistics
  const stats = {
    total: budgetRequests.length,
    pending: budgetRequests.filter((r) => r.approvalStatus === "PENDING")
      .length,
    approved: budgetRequests.filter((r) => r.approvalStatus === "APPROVED")
      .length,
    rejected: budgetRequests.filter((r) => r.approvalStatus === "REJECTED")
      .length,
    voided: budgetRequests.filter((r) => r.approvalStatus === "VOIDED").length,
    totalAmount: budgetRequests.reduce((sum, r) => sum + r.budgetAmount, 0),
    approvedAmount: budgetRequests.reduce(
      (sum, r) => sum + r.approvedAmount,
      0,
    ),
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage and approve budget requests from your team
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleBulkAction("approve")}
            disabled={selectedRequests.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Bulk Approve ({selectedRequests.length})
          </Button>
          <Button
            onClick={() => handleBulkAction("reject")}
            disabled={selectedRequests.length === 0}
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Bulk Reject ({selectedRequests.length})
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Voided</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.voided}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requested
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount, "KES")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Approved
                </p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(stats.approvedAmount, "KES")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Budget Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search requests..."
                    value={filters.searchTerm}
                    onChange={(e) =>
                      handleFilterChange("searchTerm", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="VOIDED">Voided</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) =>
                      handleFilterChange("department", value)
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={filters.region}
                    onValueChange={(value) =>
                      handleFilterChange("region", value)
                    }
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {regions.map((region) => (
                        <SelectItem
                          key={region.id}
                          value={region.id.toString()}
                        >
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      handleFilterChange("priority", value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Requests Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Budget Requests ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedRequests.length ===
                            paginatedRequests.length &&
                          paginatedRequests.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Approved Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.length > 0 ? (
                    paginatedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRequests.includes(request.id)}
                            onCheckedChange={(checked) =>
                              handleSelectRequest(
                                request.id,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-gray-500">
                              {request.userEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{request.departmentName}</TableCell>
                        <TableCell>{request.regionName}</TableCell>
                        <TableCell>{request.expenseCategoryName}</TableCell>
                        <TableCell>
                          {formatCurrency(
                            request.budgetAmount,
                            request.currencyCode,
                          )}
                        </TableCell>
                        <TableCell>
                          {request.approvedAmount > 0
                            ? formatCurrency(
                                request.approvedAmount,
                                request.currencyCode,
                              )
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[request.priority]}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={statusColors[request.approvalStatus]}
                          >
                            {request.approvalStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.requestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={request.budgetReason}
                        >
                          {request.budgetReason}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            {request.approvalStatus === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleSingleAction(request, "approve")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleSingleAction(request, "reject")
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleSingleAction(request, "void")
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {request.approvalComments && (
                              <Button
                                size="sm"
                                variant="ghost"
                                title={request.approvalComments}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">
                            No budget requests found matching the current
                            filters.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Pagination
                totalItems={filteredRequests.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Budget Request Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Requests by Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <span className="font-medium">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approved</span>
                      <span className="font-medium">{stats.approved}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected</span>
                      <span className="font-medium">{stats.rejected}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Voided</span>
                      <span className="font-medium">{stats.voided}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Total Requested</span>
                      <span className="font-medium">
                        {formatCurrency(stats.totalAmount, "KES")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Approved</span>
                      <span className="font-medium">
                        {formatCurrency(stats.approvedAmount, "KES")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approval Rate</span>
                      <span className="font-medium">
                        {stats.total > 0
                          ? Math.round((stats.approved / stats.total) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve"
                : actionType === "reject"
                  ? "Reject"
                  : "Void"}{" "}
              Budget Request
              {currentRequest ? "" : "s"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {currentRequest ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  {currentRequest.id} - {currentRequest.userName}
                </p>
                <p className="text-sm text-gray-600">
                  {currentRequest.budgetReason}
                </p>
                <p className="text-sm font-medium mt-2">
                  Amount:{" "}
                  {formatCurrency(
                    currentRequest.budgetAmount,
                    currentRequest.currencyCode,
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Bulk Action</p>
                <p className="text-sm text-gray-600">
                  You are about to {actionType} {selectedRequests.length} budget
                  request(s).
                </p>
              </div>
            )}

            {actionType === "approve" && currentRequest && (
              <div className="space-y-2">
                <Label htmlFor="approvedAmount">Approved Amount</Label>
                <Input
                  id="approvedAmount"
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(Number(e.target.value))}
                  max={currentRequest.budgetAmount}
                />
                <p className="text-xs text-gray-500">
                  Maximum:{" "}
                  {formatCurrency(
                    currentRequest.budgetAmount,
                    currentRequest.currencyCode,
                  )}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments {actionType === "reject" ? "(Required)" : "(Optional)"}
              </Label>
              <Input
                id="comments"
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                placeholder={`Add ${actionType} comments...`}
                required={actionType === "reject"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={processAction}
              disabled={actionType === "reject" && !actionComments.trim()}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : actionType === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
              }
            >
              {actionType === "approve"
                ? "Approve"
                : actionType === "reject"
                  ? "Reject"
                  : "Void"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
