"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpenseType, ExpenseCategory, ExpenseItem } from "@/Models/expense";
import { Vendor, mockVendors } from "@/Models/vendor";
import {
  currencies,
  getUserRegionCurrency,
  calculateFinalAmount,
  formatCurrency,
} from "@/lib/currency";
import { X, Plus, FileText, Image, Trash2, Edit, UserPlus } from "lucide-react";

interface ExpenseFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
  expenseType: ExpenseType;
  isAccountability?: boolean;
  originalExpenseId?: string;
}

type AttachmentFile = File & {
  id?: string;
  preview?: string;
};

type ExpenseItemForm = {
  id: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
  attachments: AttachmentFile[];
  notes?: string;
  currency: string;
  exchangeRate: number;
};

export function ExpenseForm({
  onSubmit,
  isLoading = false,
  initialData,
  expenseType,
  isAccountability = false,
  originalExpenseId,
}: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  // Payment details
  const [payeeName, setPayeeName] = useState(initialData?.payeeName || "");
  const [payeeNumber, setPayeeNumber] = useState(
    initialData?.payeeNumber || "254",
  );
  const [nationalIdPin, setNationalIdPin] = useState(
    initialData?.nationalIdPin || "",
  );

  // Vendor selection
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [newVendor, setNewVendor] = useState<{
    name: string;
    payeeNumber: string;
    nationalIdPin: string;
  }>({ name: "", payeeNumber: "254", nationalIdPin: "" });

  // Multiple expense items
  const [items, setItems] = useState<ExpenseItemForm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(initialData ? true : false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global currency settings
  const [outputCurrency, setOutputCurrency] = useState("KES");
  const [outputExchangeRate, setOutputExchangeRate] = useState(1);

  // Initialize currency settings on client-side only
  useEffect(() => {
    const userCurrency = getUserRegionCurrency();
    setOutputCurrency(userCurrency.code);
    setOutputExchangeRate(userCurrency.exchangeRate);
  }, []);
  const [previewVisible, setPreviewVisible] = useState<string | null>(null);

  // Initialize form with data or defaults
  useEffect(() => {
    // Initialize with initial data if available or one empty item
    if (items.length === 0) {
      if (initialData?.items?.length > 0) {
        // Set global currency from first item if available
        if (initialData.items[0]?.currency) {
          setOutputCurrency(initialData.items[0].currency);
          const currency = currencies.find(
            (c) => c.code === initialData.items[0].currency,
          );
          if (currency) setOutputExchangeRate(currency.exchangeRate);
        }

        const formattedItems = initialData.items.map((item: any) => ({
          id: item.id || generateId(),
          description: item.description || "",
          amount: item.amount.toString(),
          category: item.category || ExpenseCategory.TRAVEL,
          date: new Date(item.date).toISOString().split("T")[0],
          attachments: item.attachments || [],
          notes: item.notes || "",
          currency: item.currency || outputCurrency,
          exchangeRate: item.exchangeRate || outputExchangeRate,
        }));
        setItems(formattedItems);
      } else {
        addNewItem();
      }
    }
  }, []);

  // Calculate total amount whenever items change or currencies/exchange rates change
  useEffect(() => {
    let sum = 0;
    items.forEach((item) => {
      const itemAmount = parseFloat(item.amount) || 0;
      // Convert each item's amount using its own exchange rate
      sum += calculateFinalAmount(itemAmount, item.exchangeRate);
    });

    // Set the total amount in the output currency
    setTotalAmount(sum);
  }, [items]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const addNewItem = () => {
    const newItem: ExpenseItemForm = {
      id: generateId(),
      description: "",
      amount: "",
      category: ExpenseCategory.TRAVEL,
      date: new Date().toISOString().split("T")[0],
      attachments: [],
      notes: "",
      currency: outputCurrency,
      exchangeRate: outputExchangeRate,
    };

    setItems([...items, newItem]);
    setError(null);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setError(null);
  };

  const updateItem = (id: string, field: keyof ExpenseItemForm, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    );
    setError(null);
  };

  const validateItems = () => {
    // Check for duplicate category and date combinations
    const combinations = new Set<string>();
    for (const item of items) {
      const combo = `${item.category}-${item.date}`;
      if (combinations.has(combo)) {
        setError(
          `Duplicate expense found: ${item.category.replace("_", " ")} on ${new Date(item.date).toLocaleDateString()}. Please use different categories or dates.`,
        );
        return false;
      }
      combinations.add(combo);
    }

    // Check for empty required fields
    for (const item of items) {
      if (!item.description || !item.amount || parseFloat(item.amount) <= 0) {
        setError("All expense items must have a description and valid amount.");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItems()) {
      return;
    }

    const formattedItems = items.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),
    }));

    onSubmit({
      title,
      description,
      payeeName,
      payeeNumber,
      nationalIdPin,
      items: formattedItems,
      type: expenseType,
      totalAmount: totalAmount,
      outputCurrency: outputCurrency,
      outputExchangeRate: outputExchangeRate,
      isEditing: isEditing,
      isAccountability: isAccountability,
      originalExpenseId: originalExpenseId,
      vendorId: selectedVendor || undefined,
    });
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vendorId = e.target.value;
    setSelectedVendor(vendorId);

    if (vendorId) {
      const vendor = vendors.find((v) => v.id === vendorId);
      if (vendor) {
        setPayeeName(vendor.name);
        setPayeeNumber(vendor.payeeNumber);
        setNationalIdPin(vendor.nationalIdPin);
      }
    }
  };

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.payeeNumber || !newVendor.nationalIdPin) {
      return;
    }

    const newVendorEntry: Vendor = {
      id: `v${vendors.length + 1}`,
      name: newVendor.name,
      payeeNumber: newVendor.payeeNumber,
      nationalIdPin: newVendor.nationalIdPin,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVendors([...vendors, newVendorEntry]);
    setSelectedVendor(newVendorEntry.id);
    setPayeeName(newVendorEntry.name);
    setPayeeNumber(newVendorEntry.payeeNumber);
    setNationalIdPin(newVendorEntry.nationalIdPin);
    setShowAddVendorForm(false);
    setNewVendor({ name: "", payeeNumber: "254", nationalIdPin: "" });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const attachmentFile = file as AttachmentFile;
        attachmentFile.id = generateId();

        // Create preview URLs for images and PDFs
        if (file.type.startsWith("image/")) {
          attachmentFile.preview = URL.createObjectURL(file);
        } else if (file.type === "application/pdf") {
          attachmentFile.preview = URL.createObjectURL(file);
        }

        return attachmentFile;
      });

      // Check if this is a replacement operation
      const replaceId = e.target.getAttribute("data-replace-id");
      const targetItemId = e.target.getAttribute("data-item-id") || itemId;

      if (replaceId) {
        // Replace the specific attachment
        setItems(
          items.map((item) => {
            if (item.id === targetItemId) {
              const updatedAttachments = item.attachments.map((att) =>
                att.id === replaceId ? newFiles[0] : att,
              );
              return { ...item, attachments: updatedAttachments };
            }
            return item;
          }),
        );

        // Reset the attributes
        e.target.removeAttribute("data-replace-id");
        e.target.removeAttribute("data-item-id");
      } else {
        // Add new attachments
        setItems(
          items.map((item) => {
            if (item.id === targetItemId) {
              return {
                ...item,
                attachments: [...item.attachments, ...newFiles],
              };
            }
            return item;
          }),
        );
      }

      // Clear the file input to allow uploading the same file again
      e.target.value = "";
    }
  };

  const removeAttachment = (itemId: string, attachmentId: string) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const updatedAttachments = item.attachments.filter(
            (att) => att.id !== attachmentId,
          );
          return { ...item, attachments: updatedAttachments };
        }
        return item;
      }),
    );
  };

  const handleOutputCurrencyChange = (currencyCode: string) => {
    // Update exchange rate based on selected currency
    const currency = currencies.find((c) => c.code === currencyCode);
    const newExchangeRate = currency ? currency.exchangeRate : 1;

    setOutputCurrency(currencyCode);
    setOutputExchangeRate(newExchangeRate);
  };

  const getFormTitle = () => {
    if (isAccountability) {
      return "Submit Expense Accountability";
    }

    switch (expenseType) {
      case ExpenseType.ADVANCE:
        return "Request Cash Advance";
      case ExpenseType.REIMBURSEMENT:
        return "Request Reimbursement";
      case ExpenseType.ACCOUNTABILITY:
        return "Submit Expense Accountability";
      case ExpenseType.PAYOUT:
        return "Request Payout";
      default:
        return "Submit Expense";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="w-4 h-4" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  const togglePreview = (fileId: string | null) => {
    setPreviewVisible(fileId === previewVisible ? null : fileId);
  };

  const replaceAttachment = (itemId: string, attachmentId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.id = `replace-${itemId}-${attachmentId}`;
      fileInputRef.current.setAttribute("data-replace-id", attachmentId);
      fileInputRef.current.setAttribute("data-item-id", itemId);
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          {getFormTitle()}
        </CardTitle>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
          <div className="text-xl font-bold bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-md">
            Total: {formatCurrency(totalAmount, outputCurrency)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief title for this expense"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4 border border-gray-200 rounded-md p-4">
            <h3 className="font-medium">Payment Details</h3>

            {expenseType === ExpenseType.PAYOUT && (
              <div className="space-y-2">
                <Label htmlFor="vendor">Select Vendor</Label>
                <div className="flex gap-2">
                  <select
                    id="vendor"
                    className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedVendor}
                    onChange={handleVendorChange}
                  >
                    <option value="">-- Select a vendor --</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddVendorForm(!showAddVendorForm)}
                    className="whitespace-nowrap"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {showAddVendorForm ? "Cancel" : "New Vendor"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Select an existing vendor or add a new one.
                </p>
              </div>
            )}

            {showAddVendorForm && expenseType === ExpenseType.PAYOUT && (
              <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 space-y-3">
                <h4 className="font-medium text-sm">Add New Vendor</h4>

                <div className="space-y-2">
                  <Label htmlFor="newVendorName">Vendor Name</Label>
                  <Input
                    id="newVendorName"
                    placeholder="Enter vendor name"
                    value={newVendor.name}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVendorPayeeNumber">Vendor Number</Label>
                  <Input
                    id="newVendorPayeeNumber"
                    placeholder="254"
                    value={newVendor.payeeNumber}
                    onChange={(e) =>
                      setNewVendor({
                        ...newVendor,
                        payeeNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newVendorNationalIdPin">Vendor ID/PIN</Label>
                  <Input
                    id="newVendorNationalIdPin"
                    placeholder="Enter National ID or PIN number"
                    value={newVendor.nationalIdPin}
                    onChange={(e) =>
                      setNewVendor({
                        ...newVendor,
                        nationalIdPin: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddVendor}
                  className="w-full"
                >
                  Add Vendor
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="payeeName">Payee Name</Label>
              <Input
                id="payeeName"
                placeholder="Enter the full name of the payee"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                required
                className={
                  selectedVendor && expenseType === ExpenseType.PAYOUT
                    ? "bg-gray-50"
                    : ""
                }
                readOnly={
                  selectedVendor !== "" && expenseType === ExpenseType.PAYOUT
                }
              />
              <p className="text-xs text-gray-500">
                Enter the full name of the payee.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payeeNumber">Payee Number</Label>
              <Input
                id="payeeNumber"
                placeholder="254"
                value={payeeNumber}
                onChange={(e) => setPayeeNumber(e.target.value)}
                required
                className={
                  selectedVendor && expenseType === ExpenseType.PAYOUT
                    ? "bg-gray-50"
                    : ""
                }
                readOnly={
                  selectedVendor !== "" && expenseType === ExpenseType.PAYOUT
                }
              />
              <p className="text-xs text-gray-500">
                Enter the payee's contact or reference number.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalIdPin">National ID / PIN No</Label>
              <Input
                id="nationalIdPin"
                placeholder="Enter National ID or PIN number"
                value={nationalIdPin}
                onChange={(e) => setNationalIdPin(e.target.value)}
                required
                className={
                  selectedVendor && expenseType === ExpenseType.PAYOUT
                    ? "bg-gray-50"
                    : ""
                }
                readOnly={
                  selectedVendor !== "" && expenseType === ExpenseType.PAYOUT
                }
              />
              <p className="text-xs text-gray-500">
                Enter the national ID for individuals or PIN for companies. Use
                "0" if unsure.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Expense Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewItem}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-${item.id}-description`}>
                    Description
                  </Label>
                  <Input
                    id={`item-${item.id}-description`}
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-category`}>Category</Label>
                    <select
                      id={`item-${item.id}-category`}
                      className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.category}
                      onChange={(e) =>
                        updateItem(item.id, "category", e.target.value)
                      }
                      required
                    >
                      {Object.values(ExpenseCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-date`}>Date</Label>
                    <Input
                      id={`item-${item.id}-date`}
                      type="date"
                      value={item.date}
                      onChange={(e) =>
                        updateItem(item.id, "date", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-amount`}>Amount</Label>
                    <Input
                      id={`item-${item.id}-amount`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-currency`}>Currency</Label>
                    <select
                      id={`item-${item.id}-currency`}
                      className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item.currency}
                      onChange={(e) =>
                        updateItem(item.id, "currency", e.target.value)
                      }
                      required
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-exchangeRate`}>
                      Exchange Rate
                    </Label>
                    <Input
                      id={`item-${item.id}-exchangeRate`}
                      type="number"
                      min="0.0001"
                      step="0.0001"
                      placeholder="Exchange Rate"
                      value={item.exchangeRate}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "exchangeRate",
                          parseFloat(e.target.value) || 1,
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-${item.id}-notes`}>
                      Notes (Optional)
                    </Label>
                    <Input
                      id={`item-${item.id}-notes`}
                      placeholder="Additional notes"
                      value={item.notes || ""}
                      onChange={(e) =>
                        updateItem(item.id, "notes", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="relative group border border-gray-200 rounded-md p-2 flex items-center gap-2 bg-gray-50"
                      >
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => togglePreview(file.id!)}
                        >
                          {getFileIcon(file.type)}
                          <span className="text-sm truncate max-w-[150px]">
                            {file.name}
                          </span>
                        </div>
                        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-5 w-5 p-0 rounded-full bg-white"
                            onClick={() => replaceAttachment(item.id, file.id!)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-5 w-5 p-0 rounded-full"
                            onClick={() => removeAttachment(item.id, file.id!)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {file.preview && previewVisible === file.id && (
                          <div
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-all cursor-pointer"
                            onClick={() => togglePreview(null)}
                          >
                            <div className="bg-white p-2 rounded-md max-w-3xl max-h-[80vh] overflow-auto relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePreview(null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  className="max-w-full h-auto"
                                />
                              ) : (
                                <iframe
                                  src={file.preview}
                                  title={file.name}
                                  className="w-full h-[70vh]"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`item-${item.id}-attachments`}
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileChange(e, item.id)}
                      ref={fileInputRef}
                      accept="image/*,application/pdf"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.id = `item-${item.id}-attachments`;
                          fileInputRef.current.click();
                        }
                      }}
                      className="text-xs flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Upload Files
                    </Button>
                    <p className="text-xs text-gray-500">
                      Upload receipts, invoices, or other supporting documents
                      (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
