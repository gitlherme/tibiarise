import {
  useAddProfitEntry,
  useProfitHistory,
} from "@/queries/profit-manager.queries";
import { useGetUserCharacters } from "@/queries/user-data.query";
import { extractSessionData } from "@/utils/profit-manager/hunt-analyser";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";
import { Textarea } from "../ui/textarea";

interface HuntEntry {
  huntName: string;
  huntSession: string;
  preyCardsUsed: string;
  boostsValue: string;
}

interface AddProfitEntryParams {
  character?: string;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export const AddProfitEntry = ({
  character,
  setIsDialogOpen,
}: AddProfitEntryParams) => {
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const session = useSession();
  const { refetch: refetchHistory } = useProfitHistory(character || "");
  const { data: characters } = useGetUserCharacters(
    session.data?.user?.email || ""
  );
  const [form, setForm] = useState<HuntEntry>({
    huntName: "",
    huntSession: "",
    preyCardsUsed: "",
    boostsValue: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProfitEntryMutation = useAddProfitEntry();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!character) {
      alert("Please select a character."); // Simple validation
      return;
    }

    const extractedSessionData = extractSessionData(form.huntSession);

    await addProfitEntryMutation.mutate(
      {
        boostsValue: form.boostsValue,
        huntDate: extractedSessionData?.date.toISOString() || "",
        huntName: form.huntName,
        preyCardsUsed: form.preyCardsUsed,
        profit: extractedSessionData?.grossProfit || "0",
        world: characters?.find((char) => char.id === character)?.world || "",
        characterId: character,
      },
      {
        onSuccess: () => {
          refetchHistory();
          setForm({
            huntName: "",
            huntSession: "",
            preyCardsUsed: "",
            boostsValue: "",
          });
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error adding profit entry:", error);
          alert("Failed to add profit entry. Please try again.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="huntName" className="text-sm font-medium">
          {t("form.add.huntName")}
        </Label>
        <Input
          id="huntName"
          type="text"
          name="huntName"
          placeholder={t("form.add.huntNamePlaceholder")}
          value={form.huntName}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="huntSession" className="text-sm font-medium">
          {t("form.add.huntSession")}
        </Label>
        <Textarea
          id="huntSession"
          name="huntSession"
          placeholder={t("form.add.huntSessionPlaceholder")}
          value={form.huntSession}
          onChange={handleChange}
          required
          className="mt-1 resize-none max-h-[300px]"
        />
      </div>

      <div>
        <Label htmlFor="preysCardsUsed" className="text-sm font-medium">
          {t("form.add.preyCards")}
        </Label>
        <Input
          id="preyCardsUsed"
          type="number"
          name="preyCardsUsed"
          value={form.preyCardsUsed}
          onChange={handleChange}
          placeholder={t("form.add.preyCardsPlaceholder")}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="boostsValue" className="text-sm font-medium">
          {t("form.add.boostValue")}
        </Label>
        <Input
          id="boostsValue"
          type="number"
          name="boostsValue"
          placeholder={t("form.add.boostValuePlaceholder")}
          value={form.boostsValue}
          onChange={handleChange}
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full py-2">
        {t("form.add.submit")}
      </Button>
    </form>
  );
};
