import Link from "next/link";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="py-8 flex gap-1 flex-col items-center justify-center text-center border-t-2 text-black mt-12">
      <span className="block">
        {t("madeWith")}{" "}
        <Link
          href="https://github.com/gitlherme"
          target="_blank"
          className="font-bold "
        >
          gitlherme
        </Link>
      </span>

      <span className="block">
        <Link
          className="text-black hover:text-blue-600"
          href="mailto:contact@tibiarise.app"
        >
          contact@tibiarise.app
        </Link>
      </span>

      <span className="block">
        <Link
          className="text-black hover:text-blue-600"
          href="https://discord.gg/BAZDE29Eyf"
        >
          {t("discord")}
        </Link>
      </span>

      <span className="text-xs">
        {t.rich("tibia", {
          tibia: (chunks) => (
            <Link
              href="https://tibia.com"
              target="_blank"
              className="font-bold"
            >
              {chunks}
            </Link>
          ),
          cip: (chunks) => (
            <Link
              href="https://www.cipsoft.com/en/"
              target="_blank"
              className="font-bold"
            >
              {chunks}
            </Link>
          ),
        })}
      </span>

      <span className="text-xs">
        {t.rich("thanks", {
          data: (chunks) => (
            <Link
              href="https://tibiadata.com/"
              target="_blank"
              className="font-bold"
            >
              {chunks}
            </Link>
          ),
        })}
      </span>
    </footer>
  );
};
