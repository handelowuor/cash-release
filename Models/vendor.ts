export interface Vendor {
  id: string;
  name: string;
  payeeNumber: string;
  nationalIdPin: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data for vendors
export const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "Acme Supplies Ltd",
    payeeNumber: "254712345678",
    nationalIdPin: "A123456789X",
    isActive: true,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "v2",
    name: "TechPro Solutions",
    payeeNumber: "254723456789",
    nationalIdPin: "B234567890Y",
    isActive: true,
    createdAt: "2023-02-10T10:15:00Z",
    updatedAt: "2023-02-10T10:15:00Z",
  },
  {
    id: "v3",
    name: "Global Logistics Kenya",
    payeeNumber: "254734567890",
    nationalIdPin: "C345678901Z",
    isActive: true,
    createdAt: "2023-03-05T14:45:00Z",
    updatedAt: "2023-03-05T14:45:00Z",
  },
  {
    id: "v4",
    name: "Nairobi Office Supplies",
    payeeNumber: "254745678901",
    nationalIdPin: "D456789012A",
    isActive: true,
    createdAt: "2023-04-20T09:00:00Z",
    updatedAt: "2023-04-20T09:00:00Z",
  },
  {
    id: "v5",
    name: "East Africa Traders",
    payeeNumber: "254756789012",
    nationalIdPin: "E567890123B",
    isActive: true,
    createdAt: "2023-05-12T11:30:00Z",
    updatedAt: "2023-05-12T11:30:00Z",
  },
];
