"use client";

import { CreatePartyDialog } from "@/components/party/create-party-dialog";
import { PartyCard } from "@/components/party/party-card";
import { useUserParties } from "@/queries/party.queries";
import { ShieldIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const PartyListView = () => {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const { data: parties, isLoading } = useUserParties();

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CreatePartyDialog />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : !parties || parties.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-24 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <ShieldIcon className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("noPartiesTitle")}</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            {t("noPartiesDescription")}
          </p>
          <CreatePartyDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {parties.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      )}
    </div>
  );
};
