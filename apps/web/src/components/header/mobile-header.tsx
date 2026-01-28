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
    <Drawer direction="left" open={isOpen}>
      <div className="flex items-center bg-primary p-4">
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          <MenuIcon className="text-white" />
        </DrawerTrigger>
        <Link href="/" className="block text-white mx-auto">
          <Image
            src="/logo-dark.svg"
            alt="Tibia Rise Logo"
            width={200}
            height={120}
            className="block dark:hidden"
          />

          <Image
            src="/logo.svg"
            alt="Tibia Rise Logo"
            width={200}
            height={120}
            className="hidden dark:block"
          />
        </Link>
      </div>
      <DrawerContent className="h-full rounded-none flex items-center text-center px-4 py-20">
        <XCircleIcon
          size={32}
          className="absolute right-0 top-0 m-2"
          onClick={() => setIsOpen(false)}
        />

        <div className="flex justify-center items-center w-full my-8">
          <Link href="/" className="block text-primary-foreground">
            <Image
              src="/logo-dark.svg"
              alt="Tibia Rise Logo"
              width={200}
              height={120}
              className="block dark:hidden"
            />

            <Image
              src="/logo.svg"
              alt="Tibia Rise Logo"
              width={200}
              height={120}
              className="hidden dark:block"
            />
          </Link>
        </div>
        <div className="flex flex-col items-center my-4 gap-4 w-full">
          <ul className="flex flex-col my-4 md:my-0 gap-4 md:gap-8 text-secondary-foreground dark:text-primary-foreground">
            <li>
              <Link href={`/${locale}`} onClick={() => setIsOpen(false)}>
                {t("nav.search")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/world`} onClick={() => setIsOpen(false)}>
                {t("nav.experienceByWorld")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/tools`} onClick={() => setIsOpen(false)}>
                {t("nav.tools")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/support`}
                onClick={() => setIsOpen(false)}
              >
                {t("nav.contribute")}
              </Link>
            </li>
          </ul>
          <span className="block mt-10">
            <Link
              className="text-secondary-foreground dark:text-primary-foreground hover:text-blue-600"
              href="https://discord.gg/BAZDE29Eyf"
            >
              <DiscordLogo size={32} />
            </Link>
          </span>

          <div className="flex gap-4 absolute right-0 bottom-0 p-4">
            <LanguageSelector />
            <SwitchTheme />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
