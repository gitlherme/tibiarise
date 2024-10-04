import { useTranslations } from "next-intl";
import { cookies } from "next/headers";
import Link from "next/link";

export default function About() {
  const t = useTranslations("SupportPage");
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  return (
    <div className="text-center flex flex-col gap-8">
      <h1 className="font-black text-3xl text-blue-500">{t("title")}</h1>
      <div className="flex flex-col gap-4">
        <p>
          {t.rich("message1", {
            character: (chunks) => (
              <Link
                className="text-blue-500 font-bold"
                href={`/${locale}/character/Gui`}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>{t("message2")}</p>
        <p>
          {t.rich("message3", {
            discord: (chunks) => (
              <Link
                className="text-blue-500 font-bold"
                href={`https://discord.gg/BAZDE29Eyf`}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
