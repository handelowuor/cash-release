"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Check,
  UserCheck,
  CreditCard,
  Trash2,
  Edit,
  Eye,
  X,
  FileX,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseType } from "@/Models/expense";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  type: ExpenseType;
}

// Mock data for demonstration
const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Office supplies",
    amount: 2500,
    date: "2023-10-15",
    status: "approved",
    type: ExpenseType.REIMBURSEMENT,
  },
  {
    id: "2",
    description: "Client meeting lunch",
    amount: 1800,
    date: "2023-10-20",
    status: "pending",
    type: ExpenseType.REIMBURSEMENT,
  },
  {
    id: "3",
    description: "Transportation",
    amount: 1200,
    date: "2023-10-25",
    status: "rejected",
    type: ExpenseType.REIMBURSEMENT,
  },
  {
    id: "4",
    description: "Conference registration",
    amount: 15000,
    date: "2023-11-01",
    status: "pending",
    type: ExpenseType.ADVANCE,
  },
  {
    id: "5",
    description: "Team building event",
    amount: 8500,
    date: "2023-11-05",
    status: "approved",
    type: ExpenseType.ADVANCE,
  },
  {
    id: "6",
    description: "Project materials",
    amount: 5000,
    date: "2023-11-10",
    status: "pending",
    type: ExpenseType.ACCOUNTABILITY,
  },
  {
    id: "7",
    description: "Staff training",
    amount: 12000,
    date: "2023-11-15",
    status: "approved",
    type: ExpenseType.PAYOUT,
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

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<ExpenseType>(
    ExpenseType.REIMBURSEMENT,
  );
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const router = useRouter();

  const filteredExpenses = mockExpenses
    .filter((expense) => expense.type === activeTab)
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as ExpenseType);
    setSelectedExpense(null);
    setCurrentPage(1);
  };

  const handleExpenseSelect = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case ExpenseType.REIMBURSEMENT:
        return "My Reimbursements";
      case ExpenseType.ADVANCE:
        return "My Advances";
      case ExpenseType.ACCOUNTABILITY:
        return "My Accountability";
      case ExpenseType.PAYOUT:
        return "My Payouts";
      default:
        return "My Expenses";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {selectedExpense ? (
        <ExpenseDetails
          expense={selectedExpense}
          onBack={() => setSelectedExpense(null)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{getTabTitle()}</h1>
            <Button
              onClick={() => router.push("/expenses/new")}
              className="bg-primary"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
            </Button>
          </div>

          <Tabs
            defaultValue={ExpenseType.REIMBURSEMENT}
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value={ExpenseType.REIMBURSEMENT}>
                Reimbursement
              </TabsTrigger>
              <TabsTrigger value={ExpenseType.ADVANCE}>Advance</TabsTrigger>
              <TabsTrigger value={ExpenseType.ACCOUNTABILITY}>
                Accountability
              </TabsTrigger>
              <TabsTrigger value={ExpenseType.PAYOUT}>Payout</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab.toLowerCase()}s...`}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>All {getTabTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-muted-foreground">
                          <th className="py-3 px-4 text-left">Description</th>
                          <th className="py-3 px-4 text-left">
                            Total Amount (KES)
                          </th>
                          <th className="py-3 px-4 text-left">
                            Approved Amount (KES)
                          </th>
                          <th className="py-3 px-4 text-left">Balance (KES)</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedExpenses.map((expense) => (
                          <tr
                            key={expense.id}
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleExpenseSelect(expense)}
                          >
                            <td className="py-3 px-4">{expense.description}</td>
                            <td className="py-3 px-4">
                              {expense.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {expense.status === "approved"
                                ? expense.amount.toLocaleString()
                                : "0"}
                            </td>
                            <td className="py-3 px-4">
                              {expense.status === "approved"
                                ? "0"
                                : expense.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-2">
                                <Badge
                                  variant="outline"
                                  className={getStatusBadgeColor(
                                    expense.status,
                                  )}
                                >
                                  {expense.status.charAt(0).toUpperCase() +
                                    expense.status.slice(1)}
                                </Badge>
                                {expense.type === ExpenseType.ADVANCE &&
                                  expense.status === "approved" &&
                                  !expense.accountabilityId && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                          `/approvals/accountabilities/new/${expense.id}`,
                                        );
                                      }}
                                    >
                                      Submit Accountability
                                    </Button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {paginatedExpenses.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-6 text-center text-muted-foreground"
                            >
                              No {activeTab.toLowerCase()}s found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    totalItems={filteredExpenses.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    className="mt-4"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

interface ExpenseDetailsProps {
  expense: Expense;
  onBack: () => void;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

// Mock data for expense details
const mockExpenseItems: Record<string, ExpenseItem[]> = {
  "1": [
    {
      id: "item1",
      description: "Notebooks and pens",
      amount: 1500,
      category: "Office Supplies",
      date: "2023-10-10",
    },
    {
      id: "item2",
      description: "Printer paper",
      amount: 1000,
      category: "Office Supplies",
      date: "2023-10-12",
    },
  ],
  "2": [
    {
      id: "item3",
      description: "Restaurant bill",
      amount: 1800,
      category: "Meals",
      date: "2023-10-20",
    },
  ],
  "3": [
    {
      id: "item4",
      description: "Taxi fare",
      amount: 1200,
      category: "Transportation",
      date: "2023-10-25",
    },
  ],
  "4": [
    {
      id: "item5",
      description: "Conference registration fee",
      amount: 15000,
      category: "Training",
      date: "2023-11-01",
    },
  ],
  "5": [
    {
      id: "item6",
      description: "Team lunch",
      amount: 5000,
      category: "Entertainment",
      date: "2023-11-05",
    },
    {
      id: "item7",
      description: "Team activity",
      amount: 3500,
      category: "Entertainment",
      date: "2023-11-05",
    },
  ],
  "6": [
    {
      id: "item8",
      description: "Project materials",
      amount: 5000,
      category: "Equipment",
      date: "2023-11-10",
    },
  ],
  "7": [
    {
      id: "item9",
      description: "Staff training materials",
      amount: 12000,
      category: "Training",
      date: "2023-11-15",
    },
  ],
};

// Updated mock documents to associate with specific items
const mockDocuments: Record<string, Document[]> = {
  "1": [
    {
      id: "doc1-item1", // Note the item ID in the document ID
      name: "receipt-notebooks.pdf",
      type: "PDF",
      size: "145 KB",
      url: "#",
    },
    {
      id: "doc2-item2", // Associated with item2
      name: "receipt-printer-paper.pdf",
      type: "PDF",
      size: "120 KB",
      url: "#",
    },
  ],
  "2": [
    {
      id: "doc3-item3", // Associated with item3
      name: "lunch-receipt.jpg",
      type: "Image",
      size: "1.2 MB",
      url: "#",
    },
  ],
  "3": [
    {
      id: "doc4-item4", // Associated with item4
      name: "taxi-receipt.pdf",
      type: "PDF",
      size: "180 KB",
      url: "#",
    },
  ],
  "4": [
    {
      id: "doc5-item5", // Associated with item5
      name: "conference-invoice.pdf",
      type: "PDF",
      size: "320 KB",
      url: "#",
    },
  ],
  "5": [
    {
      id: "doc6-item6", // Associated with item6
      name: "team-lunch-invoice.pdf",
      type: "PDF",
      size: "250 KB",
      url: "#",
    },
    {
      id: "doc7-item7", // Associated with item7
      name: "team-activity-invoice.pdf",
      type: "PDF",
      size: "200 KB",
      url: "#",
    },
    {
      id: "doc8-item7", // Another document for item7
      name: "participants-list.xlsx",
      type: "Excel",
      size: "120 KB",
      url: "#",
    },
  ],
  "6": [
    {
      id: "doc9-item8", // Associated with item8
      name: "materials-invoice.pdf",
      type: "PDF",
      size: "280 KB",
      url: "#",
    },
  ],
  "7": [
    {
      id: "doc10-item9", // Associated with item9
      name: "training-invoice.pdf",
      type: "PDF",
      size: "350 KB",
      url: "#",
    },
  ],
};

function ExpenseDetails({ expense, onBack }: ExpenseDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewingDocumentUrl, setViewingDocumentUrl] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const items = mockExpenseItems[expense.id] || [];

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setIsEditing(true);
  };

  const handleSaveItem = () => {
    // In a real app, save the changes to the backend
    setEditingItemId(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setIsEditing(false);
  };

  const handleViewDocument = (url: string) => {
    setViewingDocumentUrl(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="h-10">
            Back
          </Button>
          <h1 className="text-3xl font-bold">{expense.description}</h1>
          <Badge
            variant="outline"
            className={`${getStatusBadgeColor(expense.status)} text-sm px-3 py-1`}
          >
            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
          </Badge>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Expense Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">
                  Reference ID:
                </dt>
                <dd className="font-mono">{expense.id}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">Type:</dt>
                <dd className="font-semibold">{expense.type}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">
                  Total Amount:
                </dt>
                <dd className="font-semibold text-lg">
                  {expense.amount.toLocaleString()} KES
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="font-medium text-muted-foreground">
                  Submission Date:
                </dt>
                <dd>
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="font-medium text-muted-foreground">Status:</dt>
                <dd>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(expense.status)}
                  >
                    {expense.status.charAt(0).toUpperCase() +
                      expense.status.slice(1)}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Expense Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    May 15, 2023 at 10:30 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Approved by Manager</p>
                  <p className="text-sm text-muted-foreground">
                    May 16, 2023 at 2:15 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Processed by Finance</p>
                  <p className="text-sm text-muted-foreground">
                    May 18, 2023 at 9:45 AM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl">Expense Items</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-6 bg-white shadow-sm"
              >
                {isEditing && editingItemId === item.id ? (
                  // Edit mode for this item
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-medium mb-2">
                        Description
                      </label>
                      <Input
                        defaultValue={item.description}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-base font-medium mb-2">
                          Category
                        </label>
                        <select
                          defaultValue={item.category}
                          className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="TRAVEL">Travel</option>
                          <option value="ACCOMMODATION">Accommodation</option>
                          <option value="MEALS">Meals</option>
                          <option value="OFFICE_SUPPLIES">
                            Office Supplies
                          </option>
                          <option value="EQUIPMENT">Equipment</option>
                          <option value="MISCELLANEOUS">Miscellaneous</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-base font-medium mb-2">
                          Amount
                        </label>
                        <Input
                          type="number"
                          defaultValue={item.amount}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-medium mb-2">
                          Date
                        </label>
                        <Input
                          type="date"
                          defaultValue={item.date}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-3">
                        Attachments
                      </label>
                      <div className="flex flex-wrap gap-3 mb-3 bg-muted/20 p-4 rounded-md">
                        {mockDocuments[expense.id]
                          ?.filter((doc) => doc.id.includes(item.id))
                          ?.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center p-3 bg-white rounded-md border shadow-sm"
                            >
                              <FileText className="h-4 w-4 mr-2 text-blue-600" />
                              <span className="text-sm font-medium">
                                {doc.name}
                              </span>
                              <div className="ml-3 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Upload New Attachment
                      </Button>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveItem} className="px-6">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode for this item
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.description}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.category} •{" "}
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(item.id)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" /> Edit Item
                      </Button>
                    </div>

                    <div className="bg-muted/10 p-4 rounded-md mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Category
                          </p>
                          <p className="font-medium">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Amount
                          </p>
                          <p className="font-bold text-lg">
                            {item.amount.toLocaleString()} KES
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Date
                          </p>
                          <p className="font-medium">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Attachments section */}
                    {mockDocuments[expense.id]?.filter((doc) =>
                      doc.id.includes(item.id),
                    )?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-base mb-3">
                          Attachments
                        </h4>
                        <div className="flex flex-wrap gap-3 bg-muted/20 p-4 rounded-md">
                          {mockDocuments[expense.id]
                            ?.filter((doc) => doc.id.includes(item.id))
                            ?.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center p-3 bg-white rounded-md border shadow-sm"
                              >
                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="text-sm font-medium">
                                  {doc.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDocument(doc.url)}
                                  className="ml-3 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <div className="py-12 text-center text-muted-foreground bg-muted/10 rounded-lg">
                <FileX className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                <p className="text-lg">No expense items found</p>
                <p className="text-sm">
                  This expense doesn't have any items attached to it.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document viewer modal */}
      {viewingDocumentUrl && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingDocumentUrl(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Document Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewingDocumentUrl(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-[70vh] overflow-auto">
              <iframe
                src="https://docs.google.com/viewer?embedded=true&url=https://example.com/sample.pdf"
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
