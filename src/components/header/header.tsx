"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Ribbon } from "../ribbon/ribbon";
import { LanguageSelector } from "../language-selector/language-selector";
import { getCookie } from "cookies-next/client";
import Image from "next/image";
import { Badge } from "../ui/badge";

export const Header = () => {
  const locale = getCookie("NEXT_LOCALE") || "en";
  const t = useTranslations("Header");
  const tRibbon = useTranslations("Ribbon");
  return (
    <>
      <Ribbon>
        {tRibbon.rich("message", {
          highlight: (chunks) => <b>{chunks}</b>,
          compare: (chunks) => (
            <Link
              href={`/${locale}/experience-simulator`}
              className="underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </Ribbon>
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-center md:justify-between container mx-auto py-6 items-center">
          <Link href={`/${locale}`} className="block text-primary">
            <Image
              src="/logo-dark.svg"
              alt="Tibia Rise Logo"
              width={200}
              height={120}
            />
          </Link>

          <div className="flex flex-col md:flex-row items-center md:gap-12">
            <ul className="flex flex-row my-4 md:my-0 gap-4 md:gap-8 text-primary">
              <li>
                <Link
                  href={`/${locale}`}
                  className="hover:text-tprimary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/world`}
                  className="hover:text-tprimary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.experienceByWorld")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/tools`}
                  className="hover:text-tprimary hover:font-semibold hover:transition-all hover:ease-in flex gap-2"
                >
                  {t("nav.tools")}
                  <Badge className="bg-tprimary">New</Badge>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/support`}
                  className="hover:text-tprimary hover:font-semibold hover:transition-all hover:ease-in"
                >
                  {t("nav.contribute")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </>
  );
};
