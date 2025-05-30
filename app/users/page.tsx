"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole, UserStatus } from "@/Models/user";
import { Pagination } from "@/components/ui/pagination";
import {
  PlusCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  History,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserListItem {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: UserRole;
  status: UserStatus;
}

// Mock data for demonstration
const mockUsers: UserListItem[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@sunculture.io",
    employeeId: "EMP001",
    department: "Engineering",
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@sunculture.io",
    employeeId: "EMP002",
    department: "Finance",
    role: UserRole.FINANCE,
    status: UserStatus.ACTIVE,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@sunculture.io",
    employeeId: "EMP003",
    department: "Sales",
    role: UserRole.HOD,
    status: UserStatus.ACTIVE,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@sunculture.io",
    employeeId: "EMP004",
    department: "Marketing",
    role: UserRole.EMPLOYEE,
    status: UserStatus.INACTIVE,
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@sunculture.io",
    employeeId: "EMP005",
    department: "HR",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  },
];

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case UserRole.FINANCE:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case UserRole.HOD:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case UserRole.GENERAL_MANAGER:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusBadgeColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case UserStatus.INACTIVE:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case UserStatus.SUSPENDED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          onClick={() => router.push("/users/new")}
          className="bg-primary"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or ID..."
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
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Employee ID</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.employeeId}</td>
                    <td className="py-3 px-4">{user.department}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/users/${user.id}/edit`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/users/${user.id}/history`)
                            }
                          >
                            <History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/users/${user.id}/out-of-office`)
                            }
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Out of Office
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
