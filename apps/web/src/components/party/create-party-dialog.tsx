"use client";

import { createParty } from "@/app/actions/party.actions";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvalidatePartyData } from "@/queries/party.queries";
import { useGetUserCharacters } from "@/queries/user-data.query";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export function CreatePartyDialog() {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [loading, setLoading] = useState(false);
  const { invalidateParties } = useInvalidatePartyData();

  const { data: characters } = useGetUserCharacters(
    session.data?.user?.email || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !characterId) return;

    setLoading(true);
    try {
      await createParty({ name, description, characterId });
      toast.success(t("createSuccess"));
      invalidateParties();
      setOpen(false);
      setName("");
      setDescription("");
      setCharacterId("");
    } catch {
      toast.error(t("createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 py-5 shadow-soft-primary hover:glow-primary transition-all duration-300">
          <PlusIcon size={18} className="mr-2" />
          {t("buttons.createParty")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
        <DialogHeader className="mb-4 mt-4">
          <DialogTitle className="text-2xl font-heading font-bold">
            {t("form.create.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("form.create.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partyName">{t("form.create.nameLabel")}</Label>
            <Input
              id="partyName"
              placeholder={t("form.create.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border/50 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyDescription">
              {t("form.create.descriptionLabel")}
            </Label>
            <Input
              id="partyDescription"
              placeholder={t("form.create.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-border/50 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("form.create.characterLabel")}</Label>
            <Select value={characterId} onValueChange={setCharacterId}>
              <SelectTrigger className="bg-background/50 border-border/50 rounded-lg">
                <SelectValue
                  placeholder={t("form.create.characterPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {characters?.map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={loading || !name || !characterId}
            className="w-full rounded-xl py-5 shadow-soft-primary"
          >
            {loading ? t("form.create.loading") : t("buttons.createParty")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
