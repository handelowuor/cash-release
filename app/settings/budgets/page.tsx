"use client";

import { useState } from "react";
import { formatCurrency, currencies, Currency } from "@/lib/currency";
import { Budget, BudgetHistoryEntry, BudgetUploadType } from "@/Models/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Download, Pencil, Plus, Trash2, Upload } from "lucide-react";

// Mock departments data
const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Finance" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "Sales" },
  { id: "5", name: "HR" },
  { id: "6", name: "Operations" },
];

// Mock business organizations data
const businessOrganizations = [
  { id: "1", name: "Product" },
  { id: "2", name: "Growth" },
  { id: "3", name: "Kenya" },
  { id: "4", name: "Uganda" },
  { id: "5", name: "Tanzania" },
  { id: "6", name: "Nigeria" },
];

// Mock countries data
const countries = [
  { id: "1", name: "Kenya" },
  { id: "2", name: "Uganda" },
  { id: "3", name: "Tanzania" },
  { id: "4", name: "Nigeria" },
  { id: "5", name: "Ethiopia" },
];

// Mock expense categories data
const expenseCategories = [
  { id: "1", name: "Travel" },
  { id: "2", name: "Accommodation" },
  { id: "3", name: "Meals" },
  { id: "4", name: "Office Supplies" },
  { id: "5", name: "Equipment" },
  { id: "6", name: "Training" },
];

// Mock budget data
const initialBudgets: Budget[] = [
  {
    id: "1",
    department: "Engineering",
    month: 1,
    year: 2023,
    amount: 50000,
    spent: 32500,
    remaining: 17500,
    uploadedBy: "John Doe",
    uploadedAt: new Date("2023-01-01"),
    uploadType: BudgetUploadType.MANUAL,
    isActive: true,
    categoryId: "5",
    categoryName: "Equipment",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    businessOrgId: "1",
    businessOrgName: "Product",
    countryId: "1",
    countryName: "Kenya",
    currencyCode: "KES",
  },
  {
    id: "2",
    department: "Marketing",
    month: 1,
    year: 2023,
    amount: 30000,
    spent: 27000,
    remaining: 3000,
    uploadedBy: "Jane Smith",
    uploadedAt: new Date("2023-01-01"),
    uploadType: BudgetUploadType.IMPORTED,
    isActive: true,
    categoryId: "1",
    categoryName: "Travel",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    businessOrgId: "2",
    businessOrgName: "Growth",
    countryId: "2",
    countryName: "Uganda",
    currencyCode: "UGX",
  },
  {
    id: "3",
    department: "Sales",
    month: 2,
    year: 2023,
    amount: 25000,
    spent: 10000,
    remaining: 15000,
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date("2023-02-01"),
    uploadType: BudgetUploadType.MANUAL,
    isActive: true,
    categoryId: "3",
    categoryName: "Meals",
    startDate: "2023-02-01",
    endDate: "2023-12-31",
    businessOrgId: "3",
    businessOrgName: "Kenya",
    countryId: "3",
    countryName: "Tanzania",
    currencyCode: "TZS",
  },
  {
    id: "4",
    department: "HR",
    month: 2,
    year: 2023,
    amount: 15000,
    spent: 5000,
    remaining: 10000,
    uploadedBy: "Sarah Williams",
    uploadedAt: new Date("2023-02-01"),
    uploadType: BudgetUploadType.IMPORTED,
    isActive: true,
    categoryId: "6",
    categoryName: "Training",
    startDate: "2023-02-01",
    endDate: "2023-12-31",
    businessOrgId: "4",
    businessOrgName: "Uganda",
    countryId: "4",
    countryName: "Nigeria",
    currencyCode: "USD",
  },
  {
    id: "5",
    department: "Finance",
    month: 3,
    year: 2023,
    amount: 20000,
    spent: 18000,
    remaining: 2000,
    uploadedBy: "David Brown",
    uploadedAt: new Date("2023-03-01"),
    uploadType: BudgetUploadType.MANUAL,
    isActive: false,
    categoryId: "4",
    categoryName: "Office Supplies",
    startDate: "2023-03-01",
    endDate: "2023-12-31",
    businessOrgId: "5",
    businessOrgName: "Tanzania",
    countryId: "5",
    countryName: "Ethiopia",
    currencyCode: "EUR",
  },
];

// Mock budget history data
const initialBudgetHistory: BudgetHistoryEntry[] = [
  {
    id: "1",
    budgetId: "1",
    action: "CREATED",
    newValue: 50000,
    editedBy: "John Doe",
    editedAt: new Date("2023-01-01"),
    comment: "Initial budget allocation",
  },
  {
    id: "2",
    budgetId: "1",
    action: "UPDATED",
    oldValue: 50000,
    newValue: 60000,
    editedBy: "Jane Smith",
    editedAt: new Date("2023-01-15"),
    comment: "Increased budget for new project",
  },
  {
    id: "3",
    budgetId: "2",
    action: "CREATED",
    newValue: 30000,
    editedBy: "Jane Smith",
    editedAt: new Date("2023-01-01"),
    comment: "Initial budget allocation",
  },
  {
    id: "4",
    budgetId: "3",
    action: "CREATED",
    newValue: 25000,
    editedBy: "Mike Johnson",
    editedAt: new Date("2023-02-01"),
    comment: "Initial budget allocation",
  },
  {
    id: "5",
    budgetId: "4",
    action: "CREATED",
    newValue: 15000,
    editedBy: "Sarah Williams",
    editedAt: new Date("2023-02-01"),
    comment: "Initial budget allocation",
  },
];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const years = [2022, 2023, 2024, 2025, 2026];

export default function BudgetManagementPage() {
  const [activeTab, setActiveTab] = useState("budgets");
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [budgetHistory, setBudgetHistory] =
    useState<BudgetHistoryEntry[]>(initialBudgetHistory);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    department: "all_departments",
    category: "all_categories",
    month: "all_months",
    year: "all_years",
    uploadType: "all_types",
    businessOrg: "all_business_orgs",
    country: "all_countries",
  });

  // Form state
  const [formData, setFormData] = useState({
    department: "",
    categoryId: "",
    month: 1,
    year: new Date().getFullYear(),
    amount: 0,
    isActive: true,
    uploadType: BudgetUploadType.MANUAL,
    comment: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
    businessOrgId: "",
    countryId: "",
    currencyCode: "KES",
  });

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Filtered budgets
  const filteredBudgets = budgets.filter((budget) => {
    return (
      (filters.department === "all_departments" ||
        budget.department === filters.department) &&
      (filters.category === "all_categories" ||
        budget.categoryId === filters.category) &&
      (filters.month === "all_months" ||
        budget.month === parseInt(filters.month)) &&
      (filters.year === "all_years" ||
        budget.year === parseInt(filters.year)) &&
      (filters.uploadType === "all_types" ||
        budget.uploadType === filters.uploadType) &&
      (filters.businessOrg === "all_business_orgs" ||
        budget.businessOrgId === filters.businessOrg) &&
      (filters.country === "all_countries" ||
        budget.countryId === filters.country)
    );
  });

  // Paginated budgets
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const departmentName =
      departments.find((d) => d.id === formData.department)?.name || "";
    const categoryName =
      expenseCategories.find((c) => c.id === formData.categoryId)?.name || "";
    const businessOrgName =
      businessOrganizations.find((b) => b.id === formData.businessOrgId)
        ?.name || "";
    const countryName =
      countries.find((c) => c.id === formData.countryId)?.name || "";

    if (editingId) {
      // Update existing budget
      const oldBudget = budgets.find((b) => b.id === editingId);
      const oldAmount = oldBudget?.amount || 0;

      setBudgets(
        budgets.map((budget) =>
          budget.id === editingId
            ? {
                ...budget,
                department: departmentName,
                categoryId: formData.categoryId,
                categoryName,
                month: formData.month,
                year: formData.year,
                amount: formData.amount,
                remaining: formData.amount - (budget.spent || 0),
                isActive: formData.isActive,
                updatedBy: "Current User", // In a real app, get from auth context
                updatedAt: new Date(),
                startDate: formData.startDate,
                endDate: formData.endDate,
                businessOrgId: formData.businessOrgId,
                businessOrgName,
                countryId: formData.countryId,
                countryName,
                currencyCode: formData.currencyCode,
              }
            : budget,
        ),
      );

      // Add history entry
      const newHistoryEntry: BudgetHistoryEntry = {
        id: `history-${Date.now()}`,
        budgetId: editingId,
        action: "UPDATED",
        oldValue: oldAmount,
        newValue: formData.amount,
        editedBy: "Current User", // In a real app, get from auth context
        editedAt: new Date(),
        comment: formData.comment,
      };

      setBudgetHistory([newHistoryEntry, ...budgetHistory]);
      setShowEditDialog(false);
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: `budget-${Date.now()}`,
        department: departmentName,
        categoryId: formData.categoryId,
        categoryName,
        month: formData.month,
        year: formData.year,
        amount: formData.amount,
        spent: 0,
        remaining: formData.amount,
        uploadedBy: "Current User", // In a real app, get from auth context
        uploadedAt: new Date(),
        uploadType: formData.uploadType,
        isActive: formData.isActive,
        startDate: formData.startDate,
        endDate: formData.endDate,
        businessOrgId: formData.businessOrgId,
        businessOrgName,
        countryId: formData.countryId,
        countryName,
        currencyCode: formData.currencyCode,
      };

      setBudgets([...budgets, newBudget]);

      // Add history entry
      const newHistoryEntry: BudgetHistoryEntry = {
        id: `history-${Date.now()}`,
        budgetId: newBudget.id,
        action: "CREATED",
        newValue: formData.amount,
        editedBy: "Current User", // In a real app, get from auth context
        editedAt: new Date(),
        comment: formData.comment,
      };

      setBudgetHistory([newHistoryEntry, ...budgetHistory]);
    }

    resetForm();
  };

  // Handle edit button click
  const handleEdit = (budget: Budget) => {
    const department =
      departments.find((d) => d.name === budget.department)?.id || "";

    setFormData({
      department: department,
      categoryId: budget.categoryId || "",
      month: budget.month,
      year: budget.year,
      amount: budget.amount,
      isActive: budget.isActive,
      uploadType: budget.uploadType,
      comment: "",
      startDate: budget.startDate || new Date().toISOString().split("T")[0],
      endDate:
        budget.endDate ||
        new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0],
      businessOrgId: budget.businessOrgId || "",
      countryId: budget.countryId || "",
      currencyCode: budget.currencyCode || "KES",
    });

    setEditingId(budget.id);
    setShowEditDialog(true);
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      setBudgets(budgets.filter((budget) => budget.id !== id));

      // Add history entry for deletion
      const deletedBudget = budgets.find((b) => b.id === id);
      if (deletedBudget) {
        const newHistoryEntry: BudgetHistoryEntry = {
          id: `history-${Date.now()}`,
          budgetId: id,
          action: "DELETED",
          oldValue: deletedBudget.amount,
          editedBy: "Current User", // In a real app, get from auth context
          editedAt: new Date(),
          comment: "Budget deleted",
        };

        setBudgetHistory([newHistoryEntry, ...budgetHistory]);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      department: "",
      categoryId: "",
      month: 1,
      year: new Date().getFullYear(),
      amount: 0,
      isActive: true,
      uploadType: BudgetUploadType.MANUAL,
      comment: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      businessOrgId: "",
      countryId: "",
      currencyCode: "KES",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle import button click
  const handleImport = () => {
    setShowImportModal(true);
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  // Handle import form submission
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would process the file and import data
    // For now, we'll just show a success message and close the modal
    alert("File imported successfully!");
    setShowImportModal(false);
    setImportFile(null);

    // Add some mock imported budgets
    const newImportedBudgets: Budget[] = [
      {
        id: `budget-${Date.now()}-1`,
        department: "Operations",
        month: 4,
        year: 2023,
        amount: 35000,
        spent: 0,
        remaining: 35000,
        uploadedBy: "Current User",
        uploadedAt: new Date(),
        uploadType: BudgetUploadType.IMPORTED,
        isActive: true,
        categoryId: "2",
        categoryName: "Accommodation",
        startDate: "2023-04-01",
        endDate: "2023-12-31",
        businessOrgId: "3",
        businessOrgName: "Kenya",
        countryId: "3",
        countryName: "Tanzania",
        currencyCode: "TZS",
      },
      {
        id: `budget-${Date.now()}-2`,
        department: "Finance",
        month: 4,
        year: 2023,
        amount: 22000,
        spent: 0,
        remaining: 22000,
        uploadedBy: "Current User",
        uploadedAt: new Date(),
        uploadType: BudgetUploadType.IMPORTED,
        isActive: true,
        categoryId: "4",
        categoryName: "Office Supplies",
        startDate: "2023-04-01",
        endDate: "2023-12-31",
        businessOrgId: "4",
        businessOrgName: "Uganda",
        countryId: "4",
        countryName: "Nigeria",
        currencyCode: "USD",
      },
    ];

    setBudgets([...budgets, ...newImportedBudgets]);

    // Add history entries for imported budgets
    const newHistoryEntries: BudgetHistoryEntry[] = newImportedBudgets.map(
      (budget) => ({
        id: `history-${Date.now()}-${budget.id}`,
        budgetId: budget.id,
        action: "CREATED",
        newValue: budget.amount,
        editedBy: "Current User",
        editedAt: new Date(),
        comment: "Imported from file",
      }),
    );

    setBudgetHistory([...newHistoryEntries, ...budgetHistory]);
  };

  // Handle export button click
  const handleExport = (format: string) => {
    // In a real app, this would generate and download a file
    alert(`Exporting budgets as ${format}...`);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <div className="flex space-x-2">
          <Button
            onClick={handleImport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <div className="relative">
            <Button
              onClick={() => handleExport("excel")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export as Excel
            </Button>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-6">
          {showForm && !editingId && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-red-500">
                        Department *
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId" className="text-red-500">
                        Expense Category *
                      </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          handleSelectChange("categoryId", value)
                        }
                      >
                        <SelectTrigger id="categoryId">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessOrgId" className="text-red-500">
                        Business Organization *
                      </Label>
                      <Select
                        value={formData.businessOrgId}
                        onValueChange={(value) =>
                          handleSelectChange("businessOrgId", value)
                        }
                      >
                        <SelectTrigger id="businessOrgId">
                          <SelectValue placeholder="Select business organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessOrganizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="countryId" className="text-red-500">
                        Country *
                      </Label>
                      <Select
                        value={formData.countryId}
                        onValueChange={(value) =>
                          handleSelectChange("countryId", value)
                        }
                      >
                        <SelectTrigger id="countryId">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-red-500">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-red-500">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="month" className="text-red-500">
                        Month *
                      </Label>
                      <Select
                        value={formData.month.toString()}
                        onValueChange={(value) =>
                          handleSelectChange("month", value)
                        }
                      >
                        <SelectTrigger id="month">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem
                              key={month.value}
                              value={month.value.toString()}
                            >
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-red-500">
                        Year *
                      </Label>
                      <Select
                        value={formData.year.toString()}
                        onValueChange={(value) =>
                          handleSelectChange("year", value)
                        }
                      >
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-red-500">
                        Amount *
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currencyCode" className="text-red-500">
                        Currency *
                      </Label>
                      <Select
                        value={formData.currencyCode}
                        onValueChange={(value) =>
                          handleSelectChange("currencyCode", value)
                        }
                      >
                        <SelectTrigger id="currencyCode">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uploadType" className="text-red-500">
                        Upload Type *
                      </Label>
                      <Select
                        value={formData.uploadType}
                        onValueChange={(value) =>
                          handleSelectChange("uploadType", value)
                        }
                      >
                        <SelectTrigger id="uploadType">
                          <SelectValue placeholder="Select upload type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BudgetUploadType.MANUAL}>
                            Manual
                          </SelectItem>
                          <SelectItem value={BudgetUploadType.IMPORTED}>
                            Imported
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Input
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      placeholder="Add a comment about this budget change"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(checked as boolean)
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-primary">
                      {editingId ? "Update" : "Add"} Budget
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Filter Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div>
                  <Label htmlFor="filter-department">Department</Label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) =>
                      handleFilterChange("department", value)
                    }
                  >
                    <SelectTrigger id="filter-department">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_departments">
                        All Departments
                      </SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger id="filter-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_categories">
                        All Categories
                      </SelectItem>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-month">Month</Label>
                  <Select
                    value={filters.month}
                    onValueChange={(value) =>
                      handleFilterChange("month", value)
                    }
                  >
                    <SelectTrigger id="filter-month">
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_months">All Months</SelectItem>
                      {months.map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-year">Year</Label>
                  <Select
                    value={filters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                  >
                    <SelectTrigger id="filter-year">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_years">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-uploadType">Upload Type</Label>
                  <Select
                    value={filters.uploadType}
                    onValueChange={(value) =>
                      handleFilterChange("uploadType", value)
                    }
                  >
                    <SelectTrigger id="filter-uploadType">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_types">All Types</SelectItem>
                      <SelectItem value={BudgetUploadType.MANUAL}>
                        Manual
                      </SelectItem>
                      <SelectItem value={BudgetUploadType.IMPORTED}>
                        Imported
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-businessOrg">Business Org</Label>
                  <Select
                    value={filters.businessOrg}
                    onValueChange={(value) =>
                      handleFilterChange("businessOrg", value)
                    }
                  >
                    <SelectTrigger id="filter-businessOrg">
                      <SelectValue placeholder="All Business Orgs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_business_orgs">
                        All Business Orgs
                      </SelectItem>
                      {businessOrganizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-country">Country</Label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) =>
                      handleFilterChange("country", value)
                    }
                  >
                    <SelectTrigger id="filter-country">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_countries">
                        All Countries
                      </SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Business Org</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Upload Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBudgets.length > 0 ? (
                    paginatedBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>{budget.department}</TableCell>
                        <TableCell>{budget.categoryName}</TableCell>
                        <TableCell>{budget.businessOrgName || "N/A"}</TableCell>
                        <TableCell>{budget.countryName || "N/A"}</TableCell>
                        <TableCell>
                          {budget.startDate && budget.endDate
                            ? `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {months.find((m) => m.value === budget.month)?.label}{" "}
                          {budget.year}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(budget.amount, budget.currencyCode)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(budget.spent, budget.currencyCode)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            budget.remaining,
                            budget.currencyCode,
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${budget.uploadType === BudgetUploadType.MANUAL ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                          >
                            {budget.uploadType === BudgetUploadType.MANUAL
                              ? "Manual"
                              : "Imported"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${budget.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {budget.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>{budget.uploadedBy}</TableCell>
                        <TableCell>{formatDate(budget.uploadedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(budget)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(budget.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-4">
                        No budgets found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Pagination
                totalItems={filteredBudgets.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Business Org</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Edited By</TableHead>
                    <TableHead>Edited At</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetHistory.map((history) => {
                    const relatedBudget = budgets.find(
                      (b) => b.id === history.budgetId,
                    ) || {
                      department: "Unknown",
                      categoryName: "Unknown",
                      month: 1,
                      year: 2023,
                      currencyCode: "KES",
                    };

                    return (
                      <TableRow key={history.id}>
                        <TableCell>{relatedBudget.department}</TableCell>
                        <TableCell>{relatedBudget.categoryName}</TableCell>
                        <TableCell>
                          {relatedBudget.businessOrgName || "N/A"}
                        </TableCell>
                        <TableCell>
                          {relatedBudget.countryName || "N/A"}
                        </TableCell>
                        <TableCell>
                          {
                            months.find((m) => m.value === relatedBudget.month)
                              ?.label
                          }{" "}
                          {relatedBudget.year}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${history.action === "CREATED" ? "bg-green-100 text-green-800" : history.action === "UPDATED" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                          >
                            {history.action}
                          </span>
                        </TableCell>
                        <TableCell>
                          {history.oldValue !== undefined
                            ? formatCurrency(
                                history.oldValue,
                                relatedBudget.currencyCode,
                              )
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {history.newValue !== undefined
                            ? formatCurrency(
                                history.newValue,
                                relatedBudget.currencyCode,
                              )
                            : "—"}
                        </TableCell>
                        <TableCell>{history.editedBy}</TableCell>
                        <TableCell>{formatDate(history.editedAt)}</TableCell>
                        <TableCell>{history.comment || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Import Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="importFile" className="text-red-500">
                    Select File *
                  </Label>
                  <Input
                    id="importFile"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: .xlsx, .xls, .csv
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="bg-primary"
                    disabled={!importFile}
                  >
                    Import
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Budget Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-red-500">
                  Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-red-500">
                  Expense Category *
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleSelectChange("categoryId", value)
                  }
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessOrgId" className="text-red-500">
                  Business Organization *
                </Label>
                <Select
                  value={formData.businessOrgId}
                  onValueChange={(value) =>
                    handleSelectChange("businessOrgId", value)
                  }
                >
                  <SelectTrigger id="businessOrgId">
                    <SelectValue placeholder="Select business organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessOrganizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryId" className="text-red-500">
                  Country *
                </Label>
                <Select
                  value={formData.countryId}
                  onValueChange={(value) =>
                    handleSelectChange("countryId", value)
                  }
                >
                  <SelectTrigger id="countryId">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-red-500">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-red-500">
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="month" className="text-red-500">
                  Month *
                </Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) => handleSelectChange("month", value)}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-red-500">
                  Year *
                </Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => handleSelectChange("year", value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-red-500">
                  Amount *
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencyCode" className="text-red-500">
                  Currency *
                </Label>
                <Select
                  value={formData.currencyCode}
                  onValueChange={(value) =>
                    handleSelectChange("currencyCode", value)
                  }
                >
                  <SelectTrigger id="currencyCode">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uploadType" className="text-red-500">
                  Upload Type *
                </Label>
                <Select
                  value={formData.uploadType}
                  onValueChange={(value) =>
                    handleSelectChange("uploadType", value)
                  }
                >
                  <SelectTrigger id="uploadType">
                    <SelectValue placeholder="Select upload type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BudgetUploadType.MANUAL}>
                      Manual
                    </SelectItem>
                    <SelectItem value={BudgetUploadType.IMPORTED}>
                      Imported
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Add a comment about this budget change"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked as boolean)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary">
                Update Budget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
