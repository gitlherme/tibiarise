"use client";

import { togglePublicProfile } from "@/app/actions/party.actions";
import { Button } from "@/components/ui/button";
import { useInvalidatePartyData } from "@/queries/party.queries";
import { GlobeIcon, LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface PartyVisibilityToggleProps {
  partyId: string;
  isPublic: boolean;
  slug: string | null;
}

export function PartyVisibilityToggle({
  partyId,
  isPublic,
  slug,
}: PartyVisibilityToggleProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const [loading, setLoading] = useState(false);
  const { invalidateAll } = useInvalidatePartyData();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await togglePublicProfile(partyId);
      invalidateAll(partyId);
      toast.success(
        isPublic ? t("visibility.madePrivate") : t("visibility.madePublic"),
      );
    } catch {
      toast.error(t("visibility.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isPublic && slug && (
        <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
          /party/{slug}
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className="rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary"
      >
        {isPublic ? (
          <>
            <GlobeIcon size={14} className="mr-2" />
            {t("visibility.public")}
          </>
        ) : (
          <>
            <LockIcon size={14} className="mr-2" />
            {t("visibility.private")}
          </>
        )}
      </Button>
    </div>
  );
}
