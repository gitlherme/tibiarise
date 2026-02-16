"use client";
import { Link } from "@/i18n/routing";
import { DiscordLogo } from "@phosphor-icons/react";
import { getCookie } from "cookies-next/client";
import { MenuIcon, XCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { LanguageSelector } from "../language-selector/language-selector";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { SwitchTheme } from "../utils/switch-theme";

export const MobileHeader = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between bg-background/95 backdrop-blur-md border-b border-border/40 p-4 sticky top-0 z-50">
        <DrawerTrigger
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 hover:bg-accent rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MenuIcon className="text-foreground w-6 h-6" />
        </DrawerTrigger>
        <Link
          href="/"
          className="block text-foreground absolute left-1/2 transform -translate-x-1/2"
        >
          <Image
            src="/logo-dark.svg"
            alt="Tibia Rise Logo"
            width={120}
            height={80}
            className="block dark:hidden"
          />

          <Image
            src="/logo.svg"
            alt="Tibia Rise Logo"
            width={120}
            height={80}
            className="hidden dark:block"
          />
        </Link>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
      <DrawerContent className="h-full rounded-none flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold text-lg tracking-tight pl-2">
            Menu
          </span>
          <XCircleIcon
            size={28}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground cursor-pointer transition-colors"
            onClick={() => setIsOpen(false)}
          />
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="flex justify-center mb-8">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image
                src="/logo-dark.svg"
                alt="Tibia Rise Logo"
                width={180}
                height={100}
                className="block dark:hidden"
              />
              <Image
                src="/logo.svg"
                alt="Tibia Rise Logo"
                width={180}
                height={100}
                className="hidden dark:block"
              />
            </Link>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href={`/`}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-md text-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {t("nav.search")}
            </Link>
            <Link
              href={`/world`}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-md text-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {t("nav.experienceByWorld")}
            </Link>
            <Link
              href={`/tools`}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-md text-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {t("nav.tools")}
            </Link>
            <Link
              href={`/support`}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-md text-lg font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              {t("nav.contribute")}
            </Link>
          </nav>

          <div className="mt-8 px-4">
            <Link
              className="flex items-center gap-3 text-sidebar-foreground/80 hover:text-primary transition-colors font-medium"
              href="https://discord.gg/BAZDE29Eyf"
              target="_blank"
            >
              <DiscordLogo size={24} />
              <span>Join our Discord</span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SwitchTheme />
            </div>
            <LanguageSelector />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
