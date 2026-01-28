"use client";

import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export const ProfileActions = () => {
  const t = useTranslations("Header");
  return (
    <Link href="/dashboard/characters">
      <Button>{t("goToDashboard")}</Button>
    </Link>
  );
};
