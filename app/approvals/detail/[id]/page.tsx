"use client";

import { useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseStatus, ExpenseType, ExpenseCategory } from "@/Models/expense";
import { formatCurrency } from "@/lib/currency";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Eye,
  MessageSquare,
  UserPlus,
  PieChart,
  Clock,
  Calendar,
  DollarSign,
  Building,
  User,
  FileCheck,
  Send,
  X,
  Download,
  Paperclip,
  BarChart3,
} from "lucide-react";

type ExpenseItemDetail = {
  id: string;
  description: string;
  amount: number;
  currency?: string;
  exchangeRate?: number;
  finalAmount?: number;
  category: ExpenseCategory;
  date: string;
  status: ExpenseStatus;
  attachments: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  comments?: Comment[];
};

type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isApprover?: boolean;
};

type BudgetInfo = {
  category: ExpenseCategory;
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
};

type ApprovalDetail = {
  id: string;
  requestNumber: string;
  title: string;
  type: ExpenseType;
  status: ExpenseStatus;
  amount: number;
  requestedBy: string;
  requestedBy_email?: string;
  requestedBy_avatar?: string;
  requestedAt: string;
  department: string;
  items: ExpenseItemDetail[];
  comments?: Comment[];
  history?: {
    action: string;
    user: string;
    timestamp: string;
    comment?: string;
  }[];
};

// Mock budget data
const mockBudgetData: Record<ExpenseCategory, BudgetInfo> = {
  [ExpenseCategory.TRAVEL]: {
    category: ExpenseCategory.TRAVEL,
    allocated: 50000,
    spent: 32000,
    remaining: 18000,
    currency: "KES",
  },
  [ExpenseCategory.ACCOMMODATION]: {
    category: ExpenseCategory.ACCOMMODATION,
    allocated: 40000,
    spent: 25000,
    remaining: 15000,
    currency: "KES",
  },
  [ExpenseCategory.MEALS]: {
    category: ExpenseCategory.MEALS,
    allocated: 30000,
    spent: 18000,
    remaining: 12000,
    currency: "KES",
  },
  [ExpenseCategory.OFFICE_SUPPLIES]: {
    category: ExpenseCategory.OFFICE_SUPPLIES,
    allocated: 20000,
    spent: 5000,
    remaining: 15000,
    currency: "KES",
  },
  [ExpenseCategory.EQUIPMENT]: {
    category: ExpenseCategory.EQUIPMENT,
    allocated: 100000,
    spent: 45000,
    remaining: 55000,
    currency: "KES",
  },
  [ExpenseCategory.TRAINING]: {
    category: ExpenseCategory.TRAINING,
    allocated: 60000,
    spent: 20000,
    remaining: 40000,
    currency: "KES",
  },
  [ExpenseCategory.MARKETING]: {
    category: ExpenseCategory.MARKETING,
    allocated: 80000,
    spent: 35000,
    remaining: 45000,
    currency: "KES",
  },
  [ExpenseCategory.ENTERTAINMENT]: {
    category: ExpenseCategory.ENTERTAINMENT,
    allocated: 25000,
    spent: 10000,
    remaining: 15000,
    currency: "KES",
  },
  [ExpenseCategory.COMMUNICATION]: {
    category: ExpenseCategory.COMMUNICATION,
    allocated: 15000,
    spent: 8000,
    remaining: 7000,
    currency: "KES",
  },
  [ExpenseCategory.MISCELLANEOUS]: {
    category: ExpenseCategory.MISCELLANEOUS,
    allocated: 10000,
    spent: 2000,
    remaining: 8000,
    currency: "KES",
  },
};

// Add a foreign currency item to demonstrate exchange rates
const getMockApprovalDetail = (id: string): ApprovalDetail => ({
  id,
  requestNumber: "REQ-2023-001",
  title: "Field visit to Nakuru",
  type: ExpenseType.ADVANCE,
  status: ExpenseStatus.SUBMITTED,
  amount: 15000,
  requestedBy: "John Doe",
  requestedBy_email: "john.doe@sunculture.io",
  requestedBy_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  requestedAt: "2023-06-15T10:30:00",
  department: "Sales",
  comments: [
    {
      id: "comment-1",
      author: "John Doe",
      text: "This is for the upcoming field visit to meet potential customers in Nakuru region.",
      timestamp: "2023-06-15T10:35:00",
    },
    {
      id: "comment-2",
      author: "Sarah Manager",
      text: "Please provide more details on the expected outcomes of this trip.",
      timestamp: "2023-06-15T11:20:00",
      isApprover: true,
    },
    {
      id: "comment-3",
      author: "John Doe",
      text: "We expect to onboard at least 5 new customers and conduct training for existing customers in the region.",
      timestamp: "2023-06-15T11:45:00",
    },
  ],
  history: [
    {
      action: "Created",
      user: "John Doe",
      timestamp: "2023-06-15T10:30:00",
    },
    {
      action: "Submitted",
      user: "John Doe",
      timestamp: "2023-06-15T10:35:00",
      comment: "Submitted for approval",
    },
  ],
  items: [
    {
      id: "item-004",
      description: "International Conference Fee",
      amount: 100,
      currency: "USD",
      exchangeRate: 130.5,
      finalAmount: 13050,
      category: ExpenseCategory.TRAINING,
      date: "2023-06-09",
      status: ExpenseStatus.SUBMITTED,
      attachments: [
        {
          id: "att-005",
          name: "conference-receipt.pdf",
          type: "application/pdf",
          url: "#",
        },
      ],
      comments: [
        {
          id: "item-comment-4",
          author: "John Doe",
          text: "Conference registration fee paid in USD.",
          timestamp: "2023-06-15T10:30:00",
        },
      ],
    },
    {
      id: "item-001",
      description: "Transportation to Nakuru",
      amount: 5000,
      currency: "KES",
      exchangeRate: 1,
      finalAmount: 5000,
      category: ExpenseCategory.TRAVEL,
      date: "2023-06-10",
      status: ExpenseStatus.SUBMITTED,
      attachments: [
        {
          id: "att-001",
          name: "bus-receipt.pdf",
          type: "application/pdf",
          url: "#",
        },
      ],
      comments: [
        {
          id: "item-comment-1",
          author: "John Doe",
          text: "This covers round-trip transportation to Nakuru.",
          timestamp: "2023-06-15T10:32:00",
        },
      ],
    },
    {
      id: "item-002",
      description: "Accommodation in Nakuru",
      amount: 7000,
      currency: "KES",
      exchangeRate: 1,
      finalAmount: 7000,
      category: ExpenseCategory.ACCOMMODATION,
      date: "2023-06-11",
      status: ExpenseStatus.SUBMITTED,
      attachments: [
        {
          id: "att-002",
          name: "hotel-invoice.pdf",
          type: "application/pdf",
          url: "#",
        },
        {
          id: "att-003",
          name: "hotel-receipt.jpg",
          type: "image/jpeg",
          url: "#",
        },
      ],
      comments: [
        {
          id: "item-comment-2",
          author: "John Doe",
          text: "3 nights stay at Hotel Waterbuck in Nakuru.",
          timestamp: "2023-06-15T10:33:00",
        },
      ],
    },
    {
      id: "item-003",
      description: "Meals during stay",
      amount: 3000,
      currency: "KES",
      exchangeRate: 1,
      finalAmount: 3000,
      category: ExpenseCategory.MEALS,
      date: "2023-06-12",
      status: ExpenseStatus.SUBMITTED,
      attachments: [
        {
          id: "att-004",
          name: "restaurant-bill.jpg",
          type: "image/jpeg",
          url: "#",
        },
      ],
      comments: [
        {
          id: "item-comment-3",
          author: "John Doe",
          text: "Meals for 3 days in Nakuru.",
          timestamp: "2023-06-15T10:34:00",
        },
      ],
    },
  ],
});

const getStatusBadgeColor = (status: ExpenseStatus) => {
  switch (status) {
    case ExpenseStatus.APPROVED_BY_HOD:
    case ExpenseStatus.APPROVED_BY_FINANCE:
    case ExpenseStatus.PAID:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case ExpenseStatus.SUBMITTED:
    case ExpenseStatus.DRAFT:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case ExpenseStatus.REJECTED_BY_HOD:
    case ExpenseStatus.REJECTED_BY_FINANCE:
    case ExpenseStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getCategoryLabel = (category: ExpenseCategory) => {
  return category.replace("_", " ");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getBudgetStatusColor = (
  allocated: number,
  spent: number,
  amount: number,
) => {
  const remaining = allocated - spent;
  const wouldBeRemaining = remaining - amount;

  if (wouldBeRemaining < 0) {
    return "text-red-600 bg-red-50 border-red-200";
  } else if (wouldBeRemaining < allocated * 0.1) {
    // Less than 10% would remain
    return "text-amber-600 bg-amber-50 border-amber-200";
  } else {
    return "text-green-600 bg-green-50 border-green-200";
  }
};

type BudgetRequestData = {
  itemId: string;
  category: ExpenseCategory;
  currentBudget: number;
  requestedAmount: number;
  reason: string;
  requestedTo: string;
};

export default function ApprovalDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [approval, setApproval] = useState<ApprovalDetail>(
    getMockApprovalDetail(resolvedParams.id),
  );
  const [activeTab, setActiveTab] = useState("details");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [itemCommentText, setItemCommentText] = useState("");
  const [forwardEmail, setForwardEmail] = useState("");
  const [forwardComment, setForwardComment] = useState("");
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showBudgetRequestModal, setShowBudgetRequestModal] = useState(false);
  const [budgetRequestData, setBudgetRequestData] =
    useState<BudgetRequestData | null>(null);
  const [budgetRequestReason, setBudgetRequestReason] = useState("");
  const [budgetRequestTo, setBudgetRequestTo] = useState("");
  const [currentDocument, setCurrentDocument] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleApproveItem = (itemId: string) => {
    if (itemCommentText.trim() === "") {
      alert("Please add a comment before approving");
      return;
    }

    // Add the approval comment
    const newComment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the current user
      text: itemCommentText,
      timestamp: new Date().toISOString(),
      isApprover: true,
    };

    setApproval({
      ...approval,
      items: approval.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: ExpenseStatus.APPROVED_BY_HOD,
              comments: [...(item.comments || []), newComment],
            }
          : item,
      ),
    });

    setItemCommentText("");
  };

  const handleRejectItem = (itemId: string) => {
    if (itemCommentText.trim() === "") {
      alert("Please add a comment explaining the rejection reason");
      return;
    }

    // Add the rejection comment
    const newComment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the current user
      text: itemCommentText,
      timestamp: new Date().toISOString(),
      isApprover: true,
    };

    setApproval({
      ...approval,
      items: approval.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: ExpenseStatus.REJECTED_BY_HOD,
              comments: [...(item.comments || []), newComment],
            }
          : item,
      ),
    });

    setItemCommentText("");
  };

  const handleAddComment = () => {
    if (commentText.trim() === "") return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the current user
      text: commentText,
      timestamp: new Date().toISOString(),
      isApprover: true,
    };

    setApproval({
      ...approval,
      comments: [...(approval.comments || []), newComment],
    });

    setCommentText("");
  };

  const handleAddItemComment = (itemId: string) => {
    if (itemCommentText.trim() === "") return;

    const newComment = {
      id: `item-comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the current user
      text: itemCommentText,
      timestamp: new Date().toISOString(),
      isApprover: true,
    };

    setApproval({
      ...approval,
      items: approval.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              comments: [...(item.comments || []), newComment],
            }
          : item,
      ),
    });

    setItemCommentText("");
  };

  const handleForward = () => {
    if (forwardEmail.trim() === "") {
      alert("Please enter an email address");
      return;
    }

    // In a real app, this would send the request to another approver
    alert(`Request forwarded to ${forwardEmail} for approval`);

    // Add to history
    const newHistoryItem = {
      action: "Forwarded",
      user: "Current User", // In a real app, this would be the current user
      timestamp: new Date().toISOString(),
      comment: forwardComment,
    };

    setApproval({
      ...approval,
      history: [...(approval.history || []), newHistoryItem],
    });

    setShowForwardModal(false);
    setForwardEmail("");
    setForwardComment("");
  };

  const handleViewDocument = (name: string, url: string) => {
    setCurrentDocument({ name, url });
    setShowDocumentModal(true);
  };

  const allItemsProcessed = approval.items.every(
    (item) => item.status !== ExpenseStatus.SUBMITTED,
  );

  const handleFinishReview = () => {
    // In a real app, you would submit the changes to the backend
    // For now, just navigate back to the approvals list
    router.push("/approvals");
  };

  const selectedItem = selectedItemId
    ? approval.items.find((item) => item.id === selectedItemId)
    : null;

  const getBudgetInfo = (category: ExpenseCategory) => {
    return mockBudgetData[category];
  };

  const handleRequestBudget = (itemId: string) => {
    const item = approval.items.find((i) => i.id === itemId);
    if (!item) return;

    const budgetInfo = getBudgetInfo(item.category);
    const requestData: BudgetRequestData = {
      itemId: item.id,
      category: item.category,
      currentBudget: budgetInfo.allocated,
      requestedAmount: item.finalAmount || item.amount,
      reason: "",
      requestedTo: "",
    };

    setBudgetRequestData(requestData);
    setShowBudgetRequestModal(true);
  };

  const handleSubmitBudgetRequest = () => {
    if (!budgetRequestData || !budgetRequestReason || !budgetRequestTo) {
      alert("Please fill in all required fields");
      return;
    }

    // In a real app, this would send the request to the backend
    alert(`Budget increase request sent to ${budgetRequestTo}`);

    // Add to history
    const newHistoryItem = {
      action: "Budget Increase Requested",
      user: "Current User", // In a real app, this would be the current user
      timestamp: new Date().toISOString(),
      comment: budgetRequestReason,
    };

    setApproval({
      ...approval,
      history: [...(approval.history || []), newHistoryItem],
    });

    setShowBudgetRequestModal(false);
    setBudgetRequestData(null);
    setBudgetRequestReason("");
    setBudgetRequestTo("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/approvals")}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{approval.title}</h1>
            <Badge
              variant="secondary"
              className={getStatusBadgeColor(approval.status)}
            >
              {approval.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForwardModal(true)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Forward
            </Button>
            {allItemsProcessed && (
              <Button
                size="sm"
                onClick={handleFinishReview}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Review
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-screen-2xl mx-auto p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Items
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Details */}
                <Card className="lg:col-span-2">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Request Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <FileText className="h-4 w-4" />
                          Request Number
                        </div>
                        <p className="font-medium text-lg">
                          {approval.requestNumber}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          Requested By
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                            {approval.requestedBy_avatar && (
                              <img
                                src={approval.requestedBy_avatar}
                                alt={approval.requestedBy}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {approval.requestedBy}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {approval.requestedBy_email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Building className="h-4 w-4" />
                          Department
                        </div>
                        <p className="font-medium">{approval.department}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          Date Requested
                        </div>
                        <p className="font-medium">
                          {formatDate(approval.requestedAt)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <AlertCircle className="h-4 w-4" />
                          Type
                        </div>
                        <p className="font-medium">{approval.type}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          Total Amount
                        </div>
                        <p className="font-medium text-lg">
                          {formatCurrency(approval.amount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Summary */}
                <Card>
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Budget Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {approval.items.map((item) => {
                        const budgetInfo = getBudgetInfo(item.category);
                        const budgetStatusColor = getBudgetStatusColor(
                          budgetInfo.allocated,
                          budgetInfo.spent,
                          item.amount,
                        );
                        const percentSpent = Math.round(
                          (budgetInfo.spent / budgetInfo.allocated) * 100,
                        );
                        const percentWouldBeSpent = Math.round(
                          ((budgetInfo.spent + item.amount) /
                            budgetInfo.allocated) *
                            100,
                        );

                        return (
                          <div key={item.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">
                                {getCategoryLabel(item.category)}
                              </div>
                              <Badge
                                variant="outline"
                                className={budgetStatusColor}
                              >
                                {formatCurrency(
                                  budgetInfo.remaining - item.amount,
                                  budgetInfo.currency,
                                )}{" "}
                                remaining after
                              </Badge>
                            </div>

                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600"
                                style={{ width: `${percentSpent}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-sm">
                              <div>
                                <span className="font-medium">
                                  {formatCurrency(
                                    budgetInfo.spent,
                                    budgetInfo.currency,
                                  )}
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  spent of{" "}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    budgetInfo.allocated,
                                    budgetInfo.currency,
                                  )}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {percentSpent}% used
                                <span
                                  className={`ml-2 ${percentWouldBeSpent > 100 ? "text-red-600" : "text-blue-600"}`}
                                >
                                  → {percentWouldBeSpent}% after approval
                                </span>
                                {percentWouldBeSpent > 100 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 ml-2 h-6 text-xs"
                                    onClick={() => handleRequestBudget(item.id)}
                                  >
                                    Request More
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-1 space-y-4">
                  {approval.items.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all ${selectedItemId === item.id ? "ring-2 ring-primary" : "hover:bg-muted/10"}`}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.description}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getCategoryLabel(item.category)} •{" "}
                              {formatDate(item.date)}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={getStatusBadgeColor(item.status)}
                          >
                            {item.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <p className="font-bold">
                            {formatCurrency(item.amount)}{" "}
                            {item.currency || "KES"}
                          </p>
                          {item.currency &&
                            item.currency !== "KES" &&
                            item.finalAmount && (
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.finalAmount)} KES @{" "}
                                {item.exchangeRate} KES/{item.currency}
                              </p>
                            )}
                        </div>
                        {item.attachments.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            {item.attachments.length} attachment
                            {item.attachments.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Selected Item Details */}
                <div className="lg:col-span-2">
                  {selectedItem ? (
                    <Card>
                      <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-start">
                          <CardTitle>{selectedItem.description}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={getStatusBadgeColor(selectedItem.status)}
                          >
                            {selectedItem.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getCategoryLabel(selectedItem.category)} •{" "}
                          {formatDate(selectedItem.date)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        {/* Item Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Amount
                            </div>
                            <p className="text-xl font-bold">
                              {formatCurrency(selectedItem.amount)}{" "}
                              {selectedItem.currency || "KES"}
                            </p>
                            {selectedItem.currency &&
                              selectedItem.currency !== "KES" &&
                              selectedItem.exchangeRate && (
                                <div className="mt-1">
                                  <span className="text-sm text-muted-foreground">
                                    Exchange Rate:{" "}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {selectedItem.exchangeRate} KES/
                                    {selectedItem.currency}
                                  </span>
                                </div>
                              )}
                            {selectedItem.finalAmount !== selectedItem.amount &&
                              selectedItem.finalAmount && (
                                <div className="mt-1">
                                  <span className="text-sm text-muted-foreground">
                                    Final Amount:{" "}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {formatCurrency(selectedItem.finalAmount)}{" "}
                                    KES
                                  </span>
                                </div>
                              )}
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Budget Status
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const budgetInfo = getBudgetInfo(
                                    selectedItem.category,
                                  );
                                  const itemAmount =
                                    selectedItem.finalAmount ||
                                    selectedItem.amount;
                                  const remaining =
                                    budgetInfo.remaining - itemAmount;
                                  let statusColor, statusText, icon;

                                  if (remaining < 0) {
                                    statusColor = "text-red-600";
                                    statusText = "Over budget";
                                    icon = (
                                      <AlertCircle className="h-4 w-4 text-red-600" />
                                    );
                                  } else if (
                                    remaining <
                                    budgetInfo.allocated * 0.1
                                  ) {
                                    statusColor = "text-amber-600";
                                    statusText = "Near limit";
                                    icon = (
                                      <AlertCircle className="h-4 w-4 text-amber-600" />
                                    );
                                  } else {
                                    statusColor = "text-green-600";
                                    statusText = "Within budget";
                                    icon = (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    );
                                  }

                                  return (
                                    <>
                                      {icon}
                                      <span
                                        className={`font-medium ${statusColor}`}
                                      >
                                        {statusText}
                                      </span>
                                      <span className="text-muted-foreground">
                                        •
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          remaining,
                                          budgetInfo.currency,
                                        )}{" "}
                                        remaining after approval
                                      </span>
                                    </>
                                  );
                                })()}
                              </div>
                              {(() => {
                                const budgetInfo = getBudgetInfo(
                                  selectedItem.category,
                                );
                                const itemAmount =
                                  selectedItem.finalAmount ||
                                  selectedItem.amount;
                                const remaining =
                                  budgetInfo.remaining - itemAmount;

                                if (remaining < 0) {
                                  return (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50 mt-2"
                                      onClick={() =>
                                        handleRequestBudget(selectedItem.id)
                                      }
                                    >
                                      <AlertCircle className="mr-2 h-4 w-4" />
                                      Request Budget Increase
                                    </Button>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Attachments */}
                        {selectedItem.attachments.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Attachments</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedItem.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center p-3 bg-muted/20 rounded-md border"
                                >
                                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {attachment.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {attachment.type === "application/pdf"
                                        ? "PDF Document"
                                        : "Image"}
                                    </p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDocument(
                                          attachment.name,
                                          attachment.url,
                                        );
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        <div>
                          <h4 className="font-medium mb-3">Comments</h4>
                          <div className="space-y-3 mb-4">
                            {selectedItem.comments &&
                            selectedItem.comments.length > 0 ? (
                              selectedItem.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="bg-muted/20 rounded-md p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="font-medium">
                                      {comment.author}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatDateTime(comment.timestamp)}
                                    </div>
                                  </div>
                                  <p className="mt-1 text-sm">{comment.text}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No comments yet
                              </p>
                            )}
                          </div>

                          {/* Add Comment Form */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a comment..."
                              value={itemCommentText}
                              onChange={(e) =>
                                setItemCommentText(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAddItemComment(selectedItem.id)
                              }
                              disabled={!itemCommentText.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        {/* Approval Actions */}
                        {selectedItem.status === ExpenseStatus.SUBMITTED && (
                          <div className="border-t pt-4 flex justify-end gap-3">
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleRejectItem(selectedItem.id)}
                              disabled={!itemCommentText.trim()}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveItem(selectedItem.id)}
                              disabled={!itemCommentText.trim()}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mb-4 opacity-40" />
                        <h3 className="text-lg font-medium mb-1">
                          Select an item to view details
                        </h3>
                        <p>
                          Click on any expense item from the list to view its
                          details and take action
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Request Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    {approval.comments && approval.comments.length > 0 ? (
                      approval.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`bg-muted/20 rounded-lg p-4 ${comment.isApprover ? "border-l-4 border-blue-500" : ""}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="font-medium flex items-center gap-2">
                              {comment.author}
                              {comment.isApprover && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 text-xs"
                                >
                                  Approver
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDateTime(comment.timestamp)}
                            </div>
                          </div>
                          <p className="mt-2">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1"
                      ref={commentInputRef}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Request History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative pl-6 border-l border-gray-200 dark:border-gray-700 space-y-6">
                    {approval.history &&
                      approval.history.map((event, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                          <div className="mb-1 text-sm font-medium">
                            {event.action}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {formatDateTime(event.timestamp)} by {event.user}
                          </div>
                          {event.comment && (
                            <div className="mt-2 text-sm bg-muted/20 p-2 rounded">
                              {event.comment}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Forward for Approval</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowForwardModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="forward-email">Forward to</Label>
                <Input
                  id="forward-email"
                  placeholder="Email address"
                  type="email"
                  value={forwardEmail}
                  onChange={(e) => setForwardEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="forward-comment">Comment (optional)</Label>
                <textarea
                  id="forward-comment"
                  placeholder="Add a comment..."
                  value={forwardComment}
                  onChange={(e) => setForwardComment(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowForwardModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleForward}>
                  <Send className="mr-2 h-4 w-4" />
                  Forward
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && currentDocument && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDocumentModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">{currentDocument.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowDocumentModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 h-[70vh] overflow-auto bg-gray-100 flex items-center justify-center">
              {/* This would be replaced with an actual document viewer in a real app */}
              <div className="bg-white shadow-lg p-8 max-w-2xl w-full">
                <div className="flex justify-center mb-6">
                  <FileText className="h-16 w-16 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-center mb-4">
                  {currentDocument.name}
                </h2>
                <p className="text-center text-muted-foreground">
                  Document preview would be displayed here in a real
                  application.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Request Modal */}
      {showBudgetRequestModal && budgetRequestData && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBudgetRequestModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Request Budget Increase</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowBudgetRequestModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium">
                  {budgetRequestData.category.replace("_", " ")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Budget
                  </p>
                  <p className="font-medium">
                    {formatCurrency(budgetRequestData.currentBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Requested Amount
                  </p>
                  <p className="font-medium">
                    {formatCurrency(budgetRequestData.requestedAmount)}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="budget-request-to">Request To</Label>
                <select
                  id="budget-request-to"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  value={budgetRequestTo}
                  onChange={(e) => setBudgetRequestTo(e.target.value)}
                  required
                >
                  <option value="">Select recipient</option>
                  <option value="finance@sunculture.io">
                    Finance Department
                  </option>
                  <option value="gm@sunculture.io">General Manager</option>
                  <option value="cfo@sunculture.io">
                    Chief Financial Officer
                  </option>
                </select>
              </div>

              <div>
                <Label htmlFor="budget-request-reason">
                  Reason for Request
                </Label>
                <textarea
                  id="budget-request-reason"
                  placeholder="Explain why additional budget is needed..."
                  value={budgetRequestReason}
                  onChange={(e) => setBudgetRequestReason(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBudgetRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitBudgetRequest}>
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
