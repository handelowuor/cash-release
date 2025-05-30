"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DelegationFormProps {
  userId: string;
}

interface Delegate {
  id: string;
  name: string;
  email: string;
  startDate: string;
  endDate: string;
}

// Mock data for demonstration
const mockDelegates: Record<string, Delegate[]> = {
  "1": [],
  "2": [
    {
      id: "delegate1",
      name: "Michael Wilson",
      email: "michael.wilson@sunculture.io",
      startDate: "2023-05-01",
      endDate: "2023-05-15",
    },
  ],
};

const mockUsers = [
  { id: "user1", name: "John Doe", email: "john.doe@sunculture.io" },
  { id: "user2", name: "Jane Smith", email: "jane.smith@sunculture.io" },
  {
    id: "user3",
    name: "Robert Johnson",
    email: "robert.johnson@sunculture.io",
  },
  { id: "user4", name: "Emily Davis", email: "emily.davis@sunculture.io" },
  {
    id: "user5",
    name: "Michael Wilson",
    email: "michael.wilson@sunculture.io",
  },
];

export default function DelegationForm({ userId }: DelegationFormProps) {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    delegateId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Load delegates for this user
    setDelegates(mockDelegates[userId] || []);
  }, [userId]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.delegateId || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedUser = mockUsers.find(
      (user) => user.id === formData.delegateId,
    );
    if (!selectedUser) return;

    const newDelegate: Delegate = {
      id: formData.delegateId,
      name: selectedUser.name,
      email: selectedUser.email,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    setDelegates([...delegates, newDelegate]);
    setShowAddForm(false);
    setFormData({ delegateId: "", startDate: "", endDate: "" });
  };

  const handleRemoveDelegate = (id: string) => {
    setDelegates(delegates.filter((delegate) => delegate.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">My Delegate</h3>
              {!showAddForm && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary"
                >
                  + Add Delegate
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Authorize another user to create, submit and approve expense
              records on your behalf.
            </p>

            {delegates.length > 0 ? (
              <div className="space-y-4">
                {delegates.map((delegate) => (
                  <div
                    key={delegate.id}
                    className="flex items-center justify-between p-4 border rounded-md bg-muted/30"
                  >
                    <div>
                      <p className="font-medium">{delegate.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {delegate.email}
                      </p>
                      <p className="text-xs mt-1">
                        {new Date(delegate.startDate).toLocaleDateString()} to{" "}
                        {new Date(delegate.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDelegate(delegate.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !showAddForm && (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No delegates assigned</p>
                </div>
              )
            )}

            {showAddForm && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 border p-4 rounded-md"
              >
                <div className="space-y-2">
                  <Label htmlFor="delegateId">Select User *</Label>
                  <Select
                    value={formData.delegateId}
                    onValueChange={(value) =>
                      handleSelectChange("delegateId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    Save
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Button variant="outline" className="text-blue-600">
          View Previous Delegates
        </Button>
      </div>
    </div>
  );
}
