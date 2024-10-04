import { useTranslations } from "next-intl";
import { cookies } from "next/headers";
import Link from "next/link";
import { Ribbon } from "../ribbon/ribbon";
import { LanguageSelector } from "../language-selector/language-selector";

export const Header = () => {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
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
      <div className="bg-secondary-foreground mb-12">
        <div className="flex flex-col md:flex-row justify-center md:justify-between container mx-auto py-6 items-center">
          <Link href={`/${locale}`} className="block text-secondary">
            <span className="block text-3xl font-black">Tibia Rise</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center md:gap-12">
            <ul className="flex flex-row my-4 md:my-0 gap-4 md:gap-8 text-secondary">
              <li>
                <Link href={`/${locale}`} className="hover:text-blue-300">
                  {t("nav.search")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/world`} className="hover:text-blue-300">
                  {t("nav.experienceByWorld")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/compare-characters`}
                  className="hover:text-blue-300"
                >
                  {t("nav.compareCharacters")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/experience-simulator`}
                  className="hover:text-blue-300"
                >
                  {t("nav.experienceSimulator")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/support`}
                  className="hover:text-blue-300"
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
