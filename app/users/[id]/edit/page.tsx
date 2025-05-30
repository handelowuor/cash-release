"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, UserStatus } from "@/Models/user";
import { ArrowLeft, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DelegationForm from "@/components/DelegationForm";
import OutOfOfficeForm from "@/components/OutOfOfficeForm";

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    displayName: "John Doe",
    employeeId: "EMP001",
    email: "john.doe@sunculture.io",
    mobile: "+254712345678",
    role: UserRole.EMPLOYEE,
    submitsTo: "user3",
    department: "engineering",
    policy: "sunstream",
    status: UserStatus.ACTIVE,
    dateOfJoining: "2022-01-15",
    dateOfBirth: "1990-05-20",
    designation: "Software Engineer",
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "",
    lastName: "Smith",
    displayName: "Jane Smith",
    employeeId: "EMP002",
    email: "jane.smith@sunculture.io",
    mobile: "+254723456789",
    role: UserRole.FINANCE,
    submitsTo: "user3",
    department: "finance",
    policy: "sunstream",
    status: UserStatus.ACTIVE,
    dateOfJoining: "2021-08-10",
    dateOfBirth: "1988-11-15",
    designation: "Finance Manager",
  },
];

export default function EditUserPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const userId = params?.id || "1";

  const [activeTab, setActiveTab] = useState("general");
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
    status: "",
    dateOfJoining: "",
    dateOfBirth: "",
    designation: "",
  });

  // Load user data based on ID
  useEffect(() => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setFormData({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        displayName: user.displayName,
        employeeId: user.employeeId,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        submitsTo: user.submitsTo,
        department: user.department,
        policy: user.policy,
        status: user.status,
        dateOfJoining: user.dateOfJoining,
        dateOfBirth: user.dateOfBirth,
        designation: user.designation,
      });
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In a real app, you would send this data to your API
    router.push("/users");
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
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="delegation">Delegation</TabsTrigger>
          <TabsTrigger value="outOfOffice">Out of Office</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
                      value={formData.role}
                      onValueChange={(value) =>
                        handleSelectChange("role", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.EMPLOYEE}>
                          Employee
                        </SelectItem>
                        <SelectItem value={UserRole.HOD}>HOD</SelectItem>
                        <SelectItem value={UserRole.FINANCE}>
                          Finance
                        </SelectItem>
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
                      value={formData.submitsTo}
                      onValueChange={(value) =>
                        handleSelectChange("submitsTo", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user1">John Doe (HOD)</SelectItem>
                        <SelectItem value="user2">
                          Jane Smith (Manager)
                        </SelectItem>
                        <SelectItem value="user3">
                          Robert Johnson (GM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleSelectChange("department", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policy" className="text-red-500">
                      Policy *
                    </Label>
                    <Select
                      value={formData.policy}
                      onValueChange={(value) =>
                        handleSelectChange("policy", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunstream">SunStream</SelectItem>
                        <SelectItem value="standard">
                          Standard Policy
                        </SelectItem>
                        <SelectItem value="executive">
                          Executive Policy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-red-500">
                      Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                        <SelectItem value={UserStatus.SUSPENDED}>
                          Suspended
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-blue-600"
                  >
                    Show more fields
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-start space-x-4">
              <Button type="submit" className="bg-primary">
                Save Changes
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
        </TabsContent>

        <TabsContent value="delegation">
          <DelegationForm userId={userId} />
        </TabsContent>

        <TabsContent value="outOfOffice">
          <OutOfOfficeForm userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
