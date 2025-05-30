"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseType } from "@/Models/expense";

export default function NewExpensePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [expenseType, setExpenseType] = useState<ExpenseType>(
    ExpenseType.REIMBURSEMENT,
  );

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      console.log("Submitting expense:", data);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Expense submitted successfully!");
      // Redirect to expenses list or dashboard
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Failed to submit expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">New Expense Request</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Submit a new expense request for approval
        </p>
      </div>

      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {Object.values(ExpenseType).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setExpenseType(type)}
              className={`px-4 py-2 text-sm font-medium ${
                expenseType === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              } border border-gray-200 dark:border-gray-600 ${type === ExpenseType.ADVANCE ? "rounded-l-lg" : ""} ${type === ExpenseType.PAYOUT ? "rounded-r-lg" : ""}`}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        expenseType={expenseType}
      />
    </div>
  );
}
