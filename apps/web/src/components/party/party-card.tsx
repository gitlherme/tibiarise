"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { Party } from "@/queries/party.queries";
import { Crown, Users2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

interface PartyCardProps {
  party: Party;
}

export function PartyCard({ party }: PartyCardProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");

  return (
    <div className="group relative rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-soft">
      {/* Public badge */}
      {party.isPublic && (
        <span className="absolute top-4 right-4 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
          {t("publicBadge")}
        </span>
      )}

      <div className="space-y-4">
        {/* Party name */}
        <div>
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
            {party.name}
          </h3>
          {party.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {party.description}
            </p>
          )}
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users2Icon size={16} />
          <span>{t("memberCount", { count: party.members.length })}</span>
        </div>

        {/* Member avatars */}
        <div className="flex -space-x-2">
          {party.members.slice(0, 5).map((member) => (
            <div
              key={member.id}
              className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-background text-xs font-medium"
              title={member.character.name}
            >
              {member.isLeader && (
                <Crown
                  size={10}
                  className="absolute -top-1 -right-1 text-yellow-500"
                />
              )}
              {member.character.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {party.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-background text-xs font-medium text-muted-foreground">
              +{party.members.length - 5}
            </div>
          )}
        </div>

        {/* Actions */}
        <Link href={`/dashboard/party/${party.id}`}>
          <Button
            variant="outline"
            className="w-full rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors mt-2"
          >
            {t("buttons.viewParty")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
