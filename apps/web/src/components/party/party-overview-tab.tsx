"use client";

import type { Party } from "@/queries/party.queries";
import { Crown, GlobeIcon, SwordsIcon, Users2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { InviteDialog } from "./invite-dialog";

interface PartyOverviewTabProps {
  party: Party;
  isOwner: boolean;
}

export function PartyOverviewTab({ party, isOwner }: PartyOverviewTabProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users2Icon size={16} />
            {t("overview.members")}
          </div>
          <p className="text-3xl font-bold">{party.members.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <GlobeIcon size={16} />
            {t("overview.status")}
          </div>
          <p className="text-3xl font-bold">
            {party.isPublic ? t("overview.public") : t("overview.private")}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <SwordsIcon size={16} />
            {t("overview.createdAt")}
          </div>
          <p className="text-lg font-bold">
            {new Date(party.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{t("overview.memberList")}</h3>
          {isOwner && (
            <InviteDialog partyId={party.id} partyName={party.name} />
          )}
        </div>
        <div className="space-y-3">
          {party.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-xl bg-background/30 border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-primary/20 text-sm font-medium">
                  {member.character.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.character.name}</p>
                    {member.isLeader && (
                      <Crown size={14} className="text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.character.vocation || "Unknown"} · Level{" "}
                    {member.character.level} · {member.character.world}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(member.joinedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
