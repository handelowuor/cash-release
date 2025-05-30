"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/Models/user";
import { ArrowLeft, Info, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    displayName: "",
    employeeId: "",
    email: "",
    mobile: "",
    role: "",
    submitsTo: "",
    department: "",
    policy: "",
    skipInvitation: false,
  });

  const [departments, setDepartments] = useState([
    { id: "1", name: "Engineering", description: "Technical team" },
    { id: "2", name: "Finance", description: "Financial operations" },
    { id: "3", name: "Marketing", description: "Marketing and communications" },
    { id: "4", name: "Sales", description: "Sales and business development" },
    { id: "5", name: "HR", description: "Human resources" },
  ]);

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In a real app, you would send this data to your API
    router.push("/users");
  };

  const handleAddDepartment = () => {
    if (newDepartment.name.trim() === "") return;

    const newId = (departments.length + 1).toString();
    setDepartments([
      ...departments,
      {
        id: newId,
        name: newDepartment.name,
        description: newDepartment.description,
      },
    ]);
    setNewDepartment({ name: "", description: "" });
  };

  const handleRemoveDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/users")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">New User</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-red-500">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-red-500">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-red-500">
                  Role *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("role", value)}
                  defaultValue={formData.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                    <SelectItem value={UserRole.HOD}>HOD</SelectItem>
                    <SelectItem value={UserRole.FINANCE}>Finance</SelectItem>
                    <SelectItem value={UserRole.GENERAL_MANAGER}>
                      General Manager
                    </SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submitsTo">
                  Submits To{" "}
                  <Info className="inline h-4 w-4 text-muted-foreground" />
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("submitsTo", value)
                  }
                  defaultValue={formData.submitsTo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">John Doe (HOD)</SelectItem>
                    <SelectItem value="user2">Jane Smith (Manager)</SelectItem>
                    <SelectItem value="user3">Robert Johnson (GM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                  defaultValue={formData.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
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
                <Label htmlFor="policy" className="text-red-500">
                  Policy *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("policy", value)}
                  defaultValue={formData.policy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunstream">SunStream</SelectItem>
                    <SelectItem value="standard">Standard Policy</SelectItem>
                    <SelectItem value="executive">Executive Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Button type="button" variant="outline" className="text-blue-600">
                Show more fields
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipInvitation"
                checked={formData.skipInvitation}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("skipInvitation", checked as boolean)
                }
              />
              <Label htmlFor="skipInvitation">Skip invitation email</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-start space-x-4">
          <Button type="submit" className="bg-primary">
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/users")}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Role Permissions Panel - Shown when a role is selected */}
      {formData.role && (
        <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
          <h3 className="text-lg font-medium mb-2">Submitter Permissions</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="perm1" defaultChecked />
              <Label htmlFor="perm1">Record Expenses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="perm2" defaultChecked />
              <Label htmlFor="perm2">Submit Reports</Label>
            </div>
            {formData.role === UserRole.HOD && (
              <div className="flex items-center space-x-2">
                <Checkbox id="perm3" defaultChecked />
                <Label htmlFor="perm3">Approve Department Expenses</Label>
              </div>
            )}
            {formData.role === UserRole.FINANCE && (
              <div className="flex items-center space-x-2">
                <Checkbox id="perm4" defaultChecked />
                <Label htmlFor="perm4">Process Payments</Label>
              </div>
            )}
            {formData.role === UserRole.ADMIN && (
              <div className="flex items-center space-x-2">
                <Checkbox id="perm5" defaultChecked />
                <Label htmlFor="perm5">Manage System Settings</Label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Department Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add New Department */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Department</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentName">Department Name</Label>
                  <Input
                    id="departmentName"
                    value={newDepartment.name}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter department name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentDescription">Description</Label>
                  <Input
                    id="departmentDescription"
                    value={newDepartment.description}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter department description"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddDepartment}
                type="button"
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>

            <Separator />

            {/* Department List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Departments</h3>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{dept.name}</td>
                        <td className="py-3 px-4">{dept.description}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDepartment(dept.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {departments.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No departments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
