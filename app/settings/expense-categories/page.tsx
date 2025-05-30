"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock expense categories data based on the expenseCategories model
const initialExpenseCategories = [
  {
    id: 1,
    expenseName: "Travel",
    isActive: true,
    netSuiteId: 2001,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 2,
    expenseName: "Accommodation",
    isActive: true,
    netSuiteId: 2002,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 3,
    expenseName: "Meals",
    isActive: true,
    netSuiteId: 2003,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 4,
    expenseName: "Office Supplies",
    isActive: true,
    netSuiteId: 2004,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 5,
    expenseName: "Equipment",
    isActive: true,
    netSuiteId: 2005,
    restrictToFinance: true,
    restictToUser: false,
  },
  {
    id: 6,
    expenseName: "Training",
    isActive: true,
    netSuiteId: 2006,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 7,
    expenseName: "Marketing",
    isActive: true,
    netSuiteId: 2007,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 8,
    expenseName: "Entertainment",
    isActive: false,
    netSuiteId: 2008,
    restrictToFinance: true,
    restictToUser: true,
  },
  {
    id: 9,
    expenseName: "Communication",
    isActive: true,
    netSuiteId: 2009,
    restrictToFinance: false,
    restictToUser: false,
  },
  {
    id: 10,
    expenseName: "Miscellaneous",
    isActive: true,
    netSuiteId: 2010,
    restrictToFinance: false,
    restictToUser: false,
  },
];

export default function ManageExpenseCategoriesPage() {
  const [categories, setCategories] = useState(initialExpenseCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    expenseName: "",
    isActive: true,
    netSuiteId: "",
    restrictToFinance: false,
    restictToUser: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? {
                ...cat,
                expenseName: formData.expenseName,
                isActive: formData.isActive,
                netSuiteId: parseInt(formData.netSuiteId) || cat.netSuiteId,
                restrictToFinance: formData.restrictToFinance,
                restictToUser: formData.restictToUser,
              }
            : cat,
        ),
      );
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        expenseName: formData.expenseName,
        isActive: formData.isActive,
        netSuiteId: parseInt(formData.netSuiteId) || null,
        restrictToFinance: formData.restrictToFinance,
        restictToUser: formData.restictToUser,
      };
      setCategories([...categories, newCategory]);
    }

    resetForm();
  };

  const handleEdit = (category: (typeof categories)[0]) => {
    setFormData({
      expenseName: category.expenseName,
      isActive: category.isActive,
      netSuiteId: category.netSuiteId?.toString() || "",
      restrictToFinance: category.restrictToFinance,
      restictToUser: category.restictToUser,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      expenseName: "",
      isActive: true,
      netSuiteId: "",
      restrictToFinance: false,
      restictToUser: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Expense Categories</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Expense Category
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Add"} Expense Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expenseName" className="text-red-500">
                  Expense Name *
                </Label>
                <Input
                  id="expenseName"
                  name="expenseName"
                  value={formData.expenseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="netSuiteId">NetSuite ID</Label>
                <Input
                  id="netSuiteId"
                  name="netSuiteId"
                  type="number"
                  value={formData.netSuiteId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("isActive", checked as boolean)
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="restrictToFinance"
                    checked={formData.restrictToFinance}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "restrictToFinance",
                        checked as boolean,
                      )
                    }
                  />
                  <Label htmlFor="restrictToFinance">Restrict to Finance</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="restictToUser"
                    checked={formData.restictToUser}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("restictToUser", checked as boolean)
                    }
                  />
                  <Label htmlFor="restictToUser">Restrict to User</Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-primary">
                  {editingId ? "Update" : "Add"} Expense Category
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
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense Name</TableHead>
                <TableHead>NetSuite ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Restrictions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.expenseName}</TableCell>
                  <TableCell>{category.netSuiteId || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {category.restrictToFinance && (
                      <span className="px-2 py-1 mr-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Finance
                      </span>
                    )}
                    {category.restictToUser && (
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        User
                      </span>
                    )}
                    {!category.restrictToFinance &&
                      !category.restictToUser &&
                      "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
