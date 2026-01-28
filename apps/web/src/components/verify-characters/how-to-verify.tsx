import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const HowToVerify = () => {
  const t = useTranslations("Dashboard.VerifyCharacterPage");

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-lg">{t("howToVerify.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>{t("howToVerify.instructions.step1")}</li>
          <li>{t("howToVerify.instructions.step2")}</li>
          <li>{t("howToVerify.instructions.step3")}</li>
          <li>{t("howToVerify.instructions.step4")}</li>
          <li>{t("howToVerify.instructions.step5")}</li>
        </ol>
      </CardContent>
    </Card>
  );
};
