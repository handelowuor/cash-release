"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - in a real app, this would come from your auth context or API
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@sunculture.com",
    department: "Finance",
    position: "Finance Manager",
    employeeId: "EMP-2023-001",
    phoneNumber: "+254 712 345 678",
    joinDate: "2023-01-15",
  });

  const handleInputChange = (field: string, value: string) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to update the user profile
      console.log("Updating user profile:", userData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
                  alt="Profile"
                />
                <AvatarFallback>
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
              <p className="text-gray-500 mb-2">{userData.position}</p>
              <p className="text-gray-500 mb-4">{userData.department}</p>

              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={userData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={userData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={userData.employeeId}
                      onChange={(e) =>
                        handleInputChange("employeeId", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={userData.joinDate}
                      onChange={(e) =>
                        handleInputChange("joinDate", e.target.value)
                      }
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
