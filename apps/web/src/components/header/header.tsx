"use client";

import { useTranslations } from "next-intl";

import { signInGoogleAction } from "@/app/actions/auth.action";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { LanguageSelector } from "../language-selector/language-selector";
import { Ribbon } from "../ribbon/ribbon";
import { Button } from "../ui/button";
import { SwitchTheme } from "../utils/switch-theme";
import { ProfileActions } from "./profile-actions";

export const Header = () => {
  const { data: session } = useSession();
  const t = useTranslations("Header");
  const tRibbon = useTranslations("Ribbon");
  return (
    <div
      suppressHydrationWarning
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-supports-[backdrop-filter]:bg-background/60"
    >
      <Ribbon enabled>
        {tRibbon.rich("message", {
          highlight: (chunks) => <b>{chunks}</b>,
          compare: (chunks) => (
            <Link
              href={`/experience-simulator`}
              className="underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
            >
              {chunks}
            </Link>
          ),
        })}
      </Ribbon>
      <div>
        <div className="flex flex-col md:flex-row justify-center md:justify-between container mx-auto py-4 px-6 md:px-12 items-center">
          <Link
            href={`/`}
            className="block text-foreground hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo-dark.svg"
              alt="Tibia Rise Logo"
              width={160}
              height={100}
              className="block dark:hidden"
            />

            <Image
              src="/logo.svg"
              alt="Tibia Rise Logo"
              width={160}
              height={100}
              className="hidden dark:block"
            />
          </Link>

          <div className="hidden md:flex flex-row items-center gap-8">
            <ul className="flex flex-row gap-8 text-sm font-medium text-foreground/80">
              <li>
                <Link
                  href={`/`}
                  className="hover:text-primary hover:text-glow-primary transition-all duration-300"
                >
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/world`}
                  className="hover:text-primary hover:text-glow-primary transition-all duration-300"
                >
                  {t("nav.experienceByWorld")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/tools`}
                  className="hover:text-primary hover:text-glow-primary transition-all duration-300 flex gap-2 items-center"
                >
                  {t("nav.tools")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/support`}
                  className="hover:text-primary hover:text-glow-primary transition-all duration-300"
                >
                  {t("nav.contribute")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            {session ? (
              <ProfileActions />
            ) : (
              <Button
                onClick={signInGoogleAction}
                variant="default"
                size="sm"
                className="shadow-soft-primary"
              >
                Login
              </Button>
            )}

            <div className="flex items-center gap-2 border-l border-border/50 pl-4 ml-2">
              <LanguageSelector />
              <SwitchTheme />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
