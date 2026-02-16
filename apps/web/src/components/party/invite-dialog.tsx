"use client";

import { getInviteLink } from "@/app/actions/party.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface InviteDialogProps {
  partyId: string;
  partyName: string;
}

export function InviteDialog({ partyId, partyName }: InviteDialogProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !inviteLink) {
      setLoading(true);
      try {
        const result = await getInviteLink(partyId);
        const link = `${window.location.origin}/${locale}/dashboard/party/invite/${result.inviteCode}`;
        setInviteLink(link);
      } catch {
        toast.error(t("inviteError"));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success(t("inviteCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary"
        >
          <LinkIcon size={14} className="mr-2" />
          {t("buttons.invite")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
        <DialogHeader className="mb-4 mt-4">
          <DialogTitle className="text-2xl font-heading font-bold">
            {t("invite.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("invite.description", { name: partyName })}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="bg-background/50 border-border/50 rounded-lg text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="shrink-0 rounded-lg"
              >
                {copied ? (
                  <CheckIcon size={16} className="text-success" />
                ) : (
                  <CopyIcon size={16} />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("invite.instructions")}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
