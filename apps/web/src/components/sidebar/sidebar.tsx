"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import {
  BadgeDollarSign,
  ChevronLeftIcon,
  ChevronRightIcon,
  Settings,
  SwordIcon,
  Users2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { SwitchTheme } from "../utils/switch-theme";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSession();
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex flex-col border-r border-border/50 transition-all duration-300 min-h-screen h-full",
          "bg-sidebar",
          collapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logo-dark.svg"
                  alt="Tibia Rise Logo"
                  width={160}
                  height={100}
                  className="block dark:hidden transition-transform group-hover:scale-105"
                />
                <Image
                  src="/logo.svg"
                  alt="Tibia Rise Logo"
                  width={160}
                  height={100}
                  className="hidden dark:block transition-transform group-hover:scale-105"
                />
              </Link>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:bg-primary/10 hover:text-primary transition-colors",
                    collapsed && "mx-auto",
                  )}
                  onClick={() => setCollapsed(!collapsed)}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <ChevronRightIcon size={18} />
                  ) : (
                    <ChevronLeftIcon size={18} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {collapsed ? "Expandir" : "Recolher"}
              </TooltipContent>
            </Tooltip>
          </div>
          {!collapsed && (
            <div className="mt-3">
              <Link
                href="/"
                className="inline-flex items-center text-sm hover:text-primary text-muted-foreground transition-colors group"
              >
                <ChevronLeftIcon
                  size={14}
                  className="mr-1 transition-transform group-hover:-translate-x-0.5"
                />
                {t("backlink")}
              </Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="px-3 py-4">
            <nav className="space-y-1">
              <NavItem
                icon={SwordIcon}
                title={t("links.characters")}
                href="/dashboard/characters"
                active={pathname.includes("/characters")}
                collapsed={collapsed}
              />
              <NavItem
                icon={BadgeDollarSign}
                title={t("links.profitManager")}
                href="/dashboard/profit-manager"
                active={pathname.includes("/profit-manager")}
                collapsed={collapsed}
              />
              <NavItem
                icon={Settings}
                title={t("links.settings")}
                href="/dashboard/settings"
                active={pathname.includes("/settings")}
                collapsed={collapsed}
              />
            </nav>
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-primary/20">
                    {user.data?.user?.image ? (
                      <Avatar>
                        <AvatarImage
                          src={user.data.user.image}
                          alt={user.data.user.name || "User Avatar"}
                          className="rounded-full"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {user.data.user.name
                            ? user.data.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Users2Icon size={16} className="text-primary" />
                    )}
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-background" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.data?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.data?.user?.email}
                  </p>
                </div>
              </div>
              <SwitchTheme />
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-primary/20">
                      {user.data?.user?.image ? (
                        <Avatar>
                          <AvatarImage
                            src={user.data.user.image}
                            alt={user.data.user.name || "User Avatar"}
                            className="rounded-full"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {user.data.user.name
                              ? user.data.user.name.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Users2Icon size={16} className="text-primary" />
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-background" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user.data?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.data?.user?.email}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
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
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "relative overflow-hidden",
        active
          ? "bg-primary/10 text-primary nav-active-indicator"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        collapsed ? "justify-center px-2" : "",
      )}
    >
      <Icon
        size={18}
        className={cn("shrink-0 transition-colors", active && "text-primary")}
      />
      {!collapsed && <span>{title}</span>}

      {/* Subtle glow on active */}
      {active && (
        <span className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
