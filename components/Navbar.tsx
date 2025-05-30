"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search } from "lucide-react";

export default function Navbar() {
  const [activePath, setActivePath] = useState<string[]>(["Dashboard"]);

  // Listen for custom events from sidebar selection
  useEffect(() => {
    const handleNavChange = (event: CustomEvent) => {
      if (event.detail && event.detail.path) {
        setActivePath(event.detail.path);
      }
    };

    window.addEventListener(
      "sidebarNavChange" as any,
      handleNavChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "sidebarNavChange" as any,
        handleNavChange as EventListener,
      );
    };
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {activePath.map((item, index) => (
              <BreadcrumbItem key={index}>
                {index < activePath.length - 1 ? (
                  <>
                    <span className="text-muted-foreground">{item}</span>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search expenses, users, budgets..."
          className="pl-8 w-[280px] h-9 bg-background"
        />
      </div>
    </header>
  );
}
