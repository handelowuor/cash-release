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

// Mock departments data
const departments = [
  { id: "engineering", name: "Engineering" },
  { id: "finance", name: "Finance" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
  { id: "hr", name: "HR" },
];

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
    nationalId: "",
    role: "",
    submitsTo: "",
    department: "",
    policy: "",
    skipInvitation: false,
  });

  // Department management has been moved to a separate page under Settings

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

  // Department management functions have been moved to a separate page under Settings

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
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId || ""}
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

      {/* Note: Department Management has been moved to a separate page under Settings */}
    </div>
  );
}
