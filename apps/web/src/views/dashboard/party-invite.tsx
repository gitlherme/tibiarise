"use client";

import { acceptInvite } from "@/app/actions/party.actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserCharacters } from "@/queries/user-data.query";
import { Loader2Icon, ShieldIcon, Users2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PartyInviteViewProps {
  inviteCode: string;
  party: {
    id: string;
    name: string;
    description: string | null;
    members: { id: string }[];
  };
}

export const PartyInviteView = ({
  inviteCode,
  party,
}: PartyInviteViewProps) => {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [characterId, setCharacterId] = useState("");

  const { data: characters, isLoading: isLoadingCharacters } =
    useGetUserCharacters(session.data?.user?.email || "");

  const handleJoin = async () => {
    if (!characterId) return;
    setLoading(true);
    try {
      await acceptInvite(inviteCode, characterId);
      toast.success(t("invite.success"));
      router.push(`/dashboard/party/${party.id}`);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "Already a member of this party"
      ) {
        toast.error(t("invite.alreadyMember"));
      } else {
        toast.error(t("invite.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-card border border-border/50 rounded-[2rem] p-8 shadow-soft backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/5">
            <ShieldIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {t("invite.joinTitle", { partyName: party.name })}
          </h1>
          {party.description && (
            <p className="text-muted-foreground mb-4">{party.description}</p>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
            <Users2Icon size={12} />
            {t("memberCount", { count: party.members.length })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("invite.selectCharacter")}
            </label>
            <Select value={characterId} onValueChange={setCharacterId}>
              <SelectTrigger className="w-full h-12 rounded-xl bg-background/50 border-border/50">
                <SelectValue
                  placeholder={t("invite.selectCharacterPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCharacters ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : characters?.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    {t("invite.noCharacters")}
                  </div>
                ) : (
                  characters?.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name} ({char.level} {char.vocation})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full h-12 rounded-xl text-base font-medium shadow-soft-primary"
            onClick={handleJoin}
            disabled={loading || !characterId}
          >
            {loading ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("invite.joinButton")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
