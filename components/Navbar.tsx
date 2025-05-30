"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, LogOut, Settings, User, Moon, Sun, Bell } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [activePath, setActivePath] = useState<string[]>(["Dashboard"]);
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // Here you would implement actual theme switching logic
  };

  const handleLogout = () => {
    logout();
    // We don't need to navigate here as logout() already handles navigation
  };

  return (
    <div className="sticky top-0 z-30 bg-background">
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

        {/* Centered Search */}
        <div className="fixed left-1/2 transform -translate-x-1/2 max-w-md w-full px-4 z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses, users, budgets..."
              className="pl-10 pr-4 h-9 w-full bg-background"
            />
          </div>
        </div>

        {/* Right side - Profile & Notifications */}
        <div className="fixed right-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=sunculture"
                    alt="User"
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
