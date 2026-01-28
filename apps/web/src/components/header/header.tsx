"use client";

import { useTranslations } from "next-intl";

import { Ribbon } from "../ribbon/ribbon";
import { LanguageSelector } from "../language-selector/language-selector";
import Image from "next/image";
import { Button } from "../ui/button";
import { signInGoogleAction } from "@/app/actions/auth.action";
import { useSession } from "next-auth/react";
import { ProfileActions } from "./profile-actions";
import { Link } from "@/i18n/routing";
import { SwitchTheme } from "../utils/switch-theme";

export const Header = () => {
  const { data: session } = useSession();
  const t = useTranslations("Header");
  const tRibbon = useTranslations("Ribbon");
  return (
    <div suppressHydrationWarning>
      <Ribbon enabled>
        {tRibbon.rich("message", {
          highlight: (chunks) => <b>{chunks}</b>,
          compare: (chunks) => (
            <Link href={`/experience-simulator`} className="underline">
              {chunks}
            </Link>
          ),
        })}
      </Ribbon>
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-center md:justify-between container mx-auto py-6 px-12 items-center">
          <Link href={`/`} className="block text-foreground">
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

          <div className="flex flex-col md:flex-row items-center md:gap-12">
            <ul className="flex flex-row my-4 md:my-0 gap-4 md:gap-8 text-foreground">
              <li>
                <Link
                  href={`/`}
                  className="hover:text-primary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/world`}
                  className="hover:text-primary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.experienceByWorld")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/tools`}
                  className="hover:text-primary hover:font-semibold hover:transition-all hover:ease-in flex gap-2"
                >
                  {t("nav.tools")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/support`}
                  className="hover:text-primary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.contribute")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            {session ? (
              <ProfileActions />
            ) : (
              <Button onClick={signInGoogleAction}>Login</Button>
            )}

            <div className="flex items-center gap-2">
              <LanguageSelector />
              <SwitchTheme />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
