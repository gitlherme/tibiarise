"use client";
import { MenuIcon, XCircleIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import Link from "next/link";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "../language-selector/language-selector";

export const MobileHeader = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer direction="left" open={isOpen}>
      <div className="flex items-center bg-black p-4 justify-between">
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          <MenuIcon className="text-white" />
        </DrawerTrigger>
        <Link href="/" className="block text-secondary text-white">
          <span className="block text-3xl font-black">Tibia Rise</span>
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
          <Link href="/" className="block text-secondary text-black">
            <span className="block text-3xl font-black text-black">
              Tibia Rise
            </span>
          </Link>
        </div>
        <ul className="flex flex-col my-4 gap-4 w-full">
          <ul className="flex flex-row my-4 md:my-0 gap-4 md:gap-8 text-secondary">
            <li>
              <Link
                href={`/${locale}`}
                className="hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.search")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/world`}
                className="hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.experienceByWorld")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/compare-characters`}
                className="hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.compareCharacters")}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/support`}
                className="hover:text-blue-300"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.contribute")}
              </Link>
            </li>
          </ul>
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
