"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  Users2Icon,
  SwordIcon,
  BadgeDollarSign,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSession();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg">
            <Image
              src="/logo-dark.svg"
              alt="Tibia Rise Logo"
              width={200}
              height={120}
            />
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <ChevronLeftIcon size={18} />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <nav className="space-y-1">
            <NavItem
              icon={HomeIcon}
              title="Dashboard"
              href="/en/dashboard"
              active={pathname === "/dashboard"}
              collapsed={collapsed}
            />
            <NavItem
              icon={SwordIcon}
              title="Characters"
              href="/en/dashboard/characters"
              active={pathname.startsWith("/characters")}
              collapsed={collapsed}
            />
            <NavItem
              icon={BadgeDollarSign}
              title="Profit Manager"
              href="/en/dashboard/profit-manager"
              active={pathname.startsWith("/profit-manager")}
              collapsed={collapsed}
            />
          </nav>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {user.data?.user?.image ? (
                <Avatar>
                  <AvatarImage
                    src={user.data.user.image}
                    alt={user.data.user.name || "User Avatar"}
                    className="rounded-full"
                  />
                  <AvatarFallback>
                    {user.data.user.name
                      ? user.data.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Users2Icon size={16} className="text-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.data?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.data?.user?.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users2Icon size={16} className="text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}

function NavItem({ icon: Icon, title, href, active, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
        collapsed ? "justify-center" : ""
      )}
    >
      <Icon size={18} />
      {!collapsed && <span>{title}</span>}
    </Link>
  );
}
