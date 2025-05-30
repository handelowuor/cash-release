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

// Mock departments data based on the SuncultureDepartments model
const initialDepartments = [
  { id: 1, departmentName: "Engineering", isActive: true, netSuiteId: 1001 },
  { id: 2, departmentName: "Finance", isActive: true, netSuiteId: 1002 },
  { id: 3, departmentName: "Marketing", isActive: true, netSuiteId: 1003 },
  { id: 4, departmentName: "Sales", isActive: true, netSuiteId: 1004 },
  { id: 5, departmentName: "HR", isActive: true, netSuiteId: 1005 },
  { id: 6, departmentName: "Operations", isActive: false, netSuiteId: 1006 },
];

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    departmentName: "",
    isActive: true,
    netSuiteId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing department
      setDepartments(
        departments.map((dept) =>
          dept.id === editingId
            ? {
                ...dept,
                departmentName: formData.departmentName,
                isActive: formData.isActive,
                netSuiteId: parseInt(formData.netSuiteId) || dept.netSuiteId,
              }
            : dept,
        ),
      );
    } else {
      // Add new department
      const newDepartment = {
        id: Math.max(...departments.map((d) => d.id)) + 1,
        departmentName: formData.departmentName,
        isActive: formData.isActive,
        netSuiteId: parseInt(formData.netSuiteId) || null,
      };
      setDepartments([...departments, newDepartment]);
    }

    resetForm();
  };

  const handleEdit = (department: (typeof departments)[0]) => {
    setFormData({
      departmentName: department.departmentName,
      isActive: department.isActive,
      netSuiteId: department.netSuiteId?.toString() || "",
    });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      departmentName: "",
      isActive: true,
      netSuiteId: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Departments</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Department
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Add"} Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentName" className="text-red-500">
                  Department Name *
                </Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-primary">
                  {editingId ? "Update" : "Add"} Department
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
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>NetSuite ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.departmentName}</TableCell>
                  <TableCell>{department.netSuiteId || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {department.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(department)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(department.id)}
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
