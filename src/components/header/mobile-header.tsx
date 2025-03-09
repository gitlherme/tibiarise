"use client";
import { MenuIcon, XCircleIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import Link from "next/link";
import { useState } from "react";
import { getCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "../language-selector/language-selector";
import { DiscordLogo } from "@phosphor-icons/react";
import Image from "next/image";

export const MobileHeader = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer direction="left" open={isOpen}>
      <div className="flex items-center bg-tprimary p-4 justify-between">
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          <MenuIcon className="text-white" />
        </DrawerTrigger>
        <Link href="/" className="block text-white">
          <Image src="/logo.svg" width={200} height={120} alt="Tibia Rise" />
        </Link>
        <div>
          <LanguageSelector />
        </div>
      </div>
      <DrawerContent className="h-full rounded-none flex items-center text-center px-4 py-20">
        <XCircleIcon
          size={32}
          className="self-end"
          onClick={() => setIsOpen(false)}
        />

        <div className="flex justify-center items-center w-full my-8">
          <Link href="/" className="block  text-black">
            <Image
              src="/logo-dark.svg"
              width={200}
              height={120}
              alt="Tibia Rise"
            />
          </Link>
        </div>
        <div className="flex flex-col items-center my-4 gap-4 w-full">
          <ul className="flex flex-col my-4 md:my-0 gap-4 md:gap-8 text-black">
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
              className="text-black hover:text-blue-600"
              href="https://discord.gg/BAZDE29Eyf"
            >
              <DiscordLogo size={32} />
            </Link>
          </span>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
