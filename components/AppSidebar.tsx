"use client";

import Image from "next/image";
import suncultureLogo from "@/assets/sunculture-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  LogOut,
  Settings2,
  Sparkles,
  LayoutDashboard,
  DollarSign,
  HandCoins,
  Users,
  type LucideIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Super Admin",
    email: "it.support@sunculture.io",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunculture",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My Expenses",
      url: "/expenses",
      icon: DollarSign,
    },
    {
      title: "Approvals",
      url: "/approvals",
      icon: BookOpen,
      items: [
        {
          title: "Expense Approval",
          url: "/approvals",
        },
        {
          title: "Accountabilities",
          url: "/approvals/accountabilities",
        },
        {
          title: "Budget Approval",
          url: "#",
        },
        {
          title: "All Advances",
          url: "#",
        },
        {
          title: "All Accountabilities",
          url: "#",
        },
        {
          title: "Staff Expenses",
          url: "#",
        },
        {
          title: "HOD Expenses",
          url: "#",
        },
        {
          title: "Assigned Expenses",
          url: "#",
        },
        {
          title: "Engineers Expenses",
          url: "#",
        },
        {
          title: "Staff Advances",
          url: "#",
        },
        {
          title: "HOD Advances",
          url: "#",
        },
        {
          title: "Assigned Advances",
          url: "#",
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: HandCoins,
      items: [
        {
          title: "Budgets",
          url: "/settings/budgets",
        },
        {
          title: "Budget Requests",
          url: "#",
        },
        {
          title: "Budget Checks",
          url: "#",
        },
        {
          title: "Process Payments",
          url: "#",
        },
        {
          title: "Pending Advances",
          url: "#",
        },
        {
          title: "Approved Advances",
          url: "#",
        },
        {
          title: "All Advances",
          url: "#",
        },
        {
          title: "All Expenses",
          url: "#",
        },
        {
          title: "Netsuite Advances",
          url: "#",
        },
        {
          title: "Netsuite Expenses",
          url: "#",
        },
        {
          title: "Customer Refunds",
          url: "#",
        },
        {
          title: "NetSuite Voucher Responses",
          url: "#",
        },
        {
          title: "Edit Advance",
          url: "#",
        },
        {
          title: "Suspense Posting",
          url: "#",
        },
        {
          title: "Bulk Suspense Posting",
          url: "#",
        },
        {
          title: "Rounding Off",
          url: "#",
        },
        {
          title: "Mpesa Payments",
          url: "#",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Add New User",
          url: "/users/new",
        },
        {
          title: "Assigned Department",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Manage Departments",
          url: "/settings/departments",
        },
        {
          title: "Manage Expense Categories",
          url: "/settings/expense-categories",
        },
        {
          title: "Add Exempt Expense",
          url: "#",
        },
      ],
    },
  ],
};

const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  // Function to update breadcrumbs when navigation item is clicked
  const updateBreadcrumbs = (mainItem: string, subItem?: string) => {
    const path = subItem ? [mainItem, subItem] : [mainItem];
    // Dispatch custom event for Navbar to listen to
    const event = new CustomEvent("sidebarNavChange", {
      detail: { path },
    });
    window.dispatchEvent(event);

    // Navigate to the corresponding page if available
    const routeMap: Record<string, string> = {
      Dashboard: "/dashboard",
      "My Expenses": "/expenses",
      Reimbursements: "/expenses/reimbursements",
      Approvals: "/approvals",
      "Expense Approval": "/approvals",
      Users: "/users",
      "All Users": "/users",
      "Add New User": "/users/new",
    };

    const targetPath =
      subItem && routeMap[subItem] ? routeMap[subItem] : routeMap[mainItem];
    if (targetPath && typeof window !== "undefined") {
      window.location.href = targetPath;
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pay Cash Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => updateBreadcrumbs(item.title)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.items && item.items.length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                {item.items && item.items.length > 0 && (
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={() =>
                            updateBreadcrumbs(item.title, subItem.title)
                          }
                        >
                          <a href={subItem.url}>
                            <span className="text-gray-500 text-xs">
                              {subItem.title}
                            </span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

const NavUser = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar collapsible="icon" {...props}>
    <SidebarHeader>
      <div className="flex items-center justify-center">
        <Image
          src={suncultureLogo}
          alt="Sunculture Logo"
          className="w-10 h-10 object-contain"
        />
      </div>
    </SidebarHeader>

    <SidebarContent>
      <NavMain items={data.navMain} />
    </SidebarContent>

    <SidebarFooter>
      <NavUser user={data.user} />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

export default AppSidebar;
