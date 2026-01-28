"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface SettingsViewProps {
  initialShowProfitOnHome: boolean;
  onToggle: (currentState: boolean) => Promise<boolean>;
}

export function SettingsView({
  initialShowProfitOnHome,
  onToggle,
}: SettingsViewProps) {
  const [showProfitOnHome, setShowProfitOnHome] = useState(
    initialShowProfitOnHome,
  );
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Dashboard.SettingsPage");

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = await onToggle(showProfitOnHome);
      setShowProfitOnHome(newState);
    } catch (error) {
      console.error("Failed to toggle setting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-heading text-foreground">
        {t("title") || "Settings"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t("privacy.title") || "Privacy Settings"}
          </CardTitle>
          <CardDescription>
            {t("privacy.description") ||
              "Manage how your data is displayed publicly."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="show-profit" className="font-medium text-base">
                {t("profitVisibility.label") || "Show Profits on Homepage"}
              </Label>
              <span className="text-sm text-muted-foreground">
                {t("profitVisibility.description") ||
                  "Allow your recent hunt profits to appear in the live ticker on the homepage."}
              </span>
            </div>
            <Switch
              id="show-profit"
              checked={showProfitOnHome}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
