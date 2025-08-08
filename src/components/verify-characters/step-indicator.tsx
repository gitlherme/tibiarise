"use client";

import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export const StepIndicator = ({
  verificationState,
}: {
  verificationState: { currentStep: number };
}) => {
  const t = useTranslations("Dashboard.VerifyCharacterPage");
  return (
    <div className="flex justify-between mb-8">
      <div className="flex flex-col items-center">
        <Badge
          variant={verificationState.currentStep >= 0 ? "default" : "outline"}
          className="mb-2"
        >
          1
        </Badge>
        <span className="text-xs text-muted-foreground">
          {t("stepsLabels.firstStep")}
        </span>
      </div>
      <div className="grow mx-2 flex items-center">
        <Separator
          className={`h-0.5 ${
            verificationState.currentStep >= 1 ? "bg-primary" : "bg-border"
          }`}
        />
      </div>
      <div className="flex flex-col items-center">
        <Badge
          variant={verificationState.currentStep >= 1 ? "default" : "outline"}
          className="mb-2"
        >
          2
        </Badge>
        <span className="text-xs text-muted-foreground">
          {t("stepsLabels.secondStep")}
        </span>
      </div>
      <div className="grow mx-2 flex items-center">
        <Separator
          className={`h-0.5 ${
            verificationState.currentStep >= 2 ? "bg-primary" : "bg-border"
          }`}
        />
      </div>
      <div className="flex flex-col items-center">
        <Badge
          variant={verificationState.currentStep >= 2 ? "default" : "outline"}
          className="mb-2"
        >
          3
        </Badge>
        <span className="text-xs text-muted-foreground">
          {t("stepsLabels.thirdStep")}
        </span>
      </div>
    </div>
  );
};
