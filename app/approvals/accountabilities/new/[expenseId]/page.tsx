"use client";

import { useState, useEffect } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseType, ExpenseStatus } from "@/Models/expense";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type OriginalExpense = {
  id: string;
  title: string;
  description: string;
  type: ExpenseType;
  status: ExpenseStatus;
  amount: number;
  items: any[];
};

// Mock function to get the original expense
const getOriginalExpense = (id: string): OriginalExpense => {
  return {
    id,
    title: "Field visit to Nakuru",
    description:
      "This is for the upcoming field visit to meet potential customers in Nakuru region.",
    type: ExpenseType.ADVANCE,
    status: ExpenseStatus.PAID,
    amount: 15000,
    items: [
      {
        id: "item-001",
        description: "Transportation to Nakuru",
        amount: 5000,
        category: "TRAVEL",
        date: "2023-06-10",
      },
      {
        id: "item-002",
        description: "Accommodation in Nakuru",
        amount: 7000,
        category: "ACCOMMODATION",
        date: "2023-06-11",
      },
      {
        id: "item-003",
        description: "Meals during stay",
        amount: 3000,
        category: "MEALS",
        date: "2023-06-12",
      },
    ],
  };
};

export default function NewAccountabilityPage({
  params,
}: {
  params: { expenseId: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [originalExpense, setOriginalExpense] =
    useState<OriginalExpense | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const expense = getOriginalExpense(params.expenseId);
    setOriginalExpense(expense);
  }, [params.expenseId]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log("Submitting accountability:", data);
      console.log("Original expense ID:", params.expenseId);
      console.log("Total amount:", data.totalAmount);
      console.log("Number of expense items:", data.items.length);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Accountability submitted successfully!");
      // Redirect to expenses list
      router.push("/expenses");
    } catch (error) {
      console.error("Error submitting accountability:", error);
      alert("Failed to submit accountability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!originalExpense) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    title: `${originalExpense.title} - Accountability`,
    description: originalExpense.description,
    // We don't copy items directly as the user needs to enter actual expenses
    // but we could pre-populate with the same structure if needed
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Expenses
        </Button>

        <h1 className="text-2xl font-bold mb-2">Submit Accountability</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Submit accountability for advance: {originalExpense.id}
        </p>
      </div>

      <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="font-medium text-blue-800 mb-2">
          Original Advance Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Amount:</span>
            <span className="ml-2 font-medium">
              {originalExpense.amount.toLocaleString()} KES
            </span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className="ml-2 font-medium">{originalExpense.status}</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 font-medium">{originalExpense.type}</span>
          </div>
        </div>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialData={initialData}
        expenseType={ExpenseType.ACCOUNTABILITY}
        isAccountability={true}
        originalExpenseId={params.expenseId}
      />
    </div>
  );
}
