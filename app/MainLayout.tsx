"use client";

import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show layout with navbar on all other pages
  return <Layout>{children}</Layout>;
}
