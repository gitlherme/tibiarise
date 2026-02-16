"use client";

import {
  addDrop,
  deleteDrop,
  toggleDropSold,
  updateDrop,
} from "@/app/actions/party.actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useInvalidatePartyData,
  usePartyDrops,
  useSearchItems,
} from "@/queries/party.queries";
import { format } from "date-fns";
import {
  CalendarIcon,
  GemIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface DropsTabProps {
  partyId: string;
  period?: string;
}

export function DropsTab({ partyId, period }: DropsTabProps) {
  const t = useTranslations("Dashboard.PartyTrackerPage");
  const { data: drops, isLoading } = usePartyDrops(partyId, period);
  const { invalidateAll } = useInvalidatePartyData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
  } | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [value, setValue] = useState("");
  const [sold, setSold] = useState(false);
  const [source, setSource] = useState("");
  const [currency, setCurrency] = useState<"GOLD" | "TIBIA_COIN">("GOLD");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDrop, setEditingDrop] = useState<{
    id: string;
    itemName: string;
    quantity: number;
    value: string;
    sold: boolean;
    source: string;
    currency: "GOLD" | "TIBIA_COIN";
    droppedAt: Date;
  } | null>(null);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [editDate, setEditDate] = useState<Date | undefined>(new Date());

  const { data: searchResults } = useSearchItems(itemSearch);

  const handleSelectItem = (item: { name: string }) => {
    setSelectedItem(item);
    setItemSearch(item.name);
    setShowSuggestions(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem && !itemSearch) return;

    setLoading(true);
    try {
      await addDrop(partyId, {
        itemName: selectedItem?.name || itemSearch,
        quantity: parseInt(quantity) || 1,
        value: parseInt(value.replace(/,/g, "")) || 0,
        sold,
        source,
        currency,
        droppedAt: date ? date.toISOString() : new Date().toISOString(),
      });
      toast.success(t("drops.addSuccess"));
      invalidateAll(partyId);
      setDialogOpen(false);
      setItemSearch("");
      setSelectedItem(null);
      setQuantity("1");
      setValue("");
      setSold(false);
      setSource("");
      setCurrency("GOLD");
      setDate(new Date());
    } catch {
      toast.error(t("drops.addError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dropId: string) => {
    try {
      await deleteDrop(dropId);
      toast.success(t("drops.deleteSuccess"));
      invalidateAll(partyId);
    } catch {
      toast.error(t("drops.deleteError"));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrop) return;

    setLoading(true);
    try {
      await updateDrop(editingDrop.id, {
        quantity: editingDrop.quantity,
        value: parseInt(editingDrop.value.replace(/,/g, "")) || 0,
        sold: editingDrop.sold,
        source: editingDrop.source,
        currency: editingDrop.currency,
        droppedAt: editDate ? editDate.toISOString() : undefined,
      });
      toast.success(t("drops.updateSuccess"));
      invalidateAll(partyId);
      setEditDialogOpen(false);
      setEditingDrop(null);
    } catch {
      toast.error(t("drops.updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (drop: any) => {
    setEditingDrop({
      id: drop.id,
      itemName: drop.itemName,
      quantity: drop.quantity,
      value: drop.value.toString(),
      sold: drop.sold,
      source: drop.source || "",
      currency: drop.currency || "GOLD",
      droppedAt: new Date(drop.droppedAt),
    });
    setEditDate(new Date(drop.droppedAt));
    setEditDialogOpen(true);
  };

  const handleToggleSold = async (dropId: string) => {
    try {
      await toggleDropSold(dropId);
      toast.success(t("drops.statusUpdated"));
      invalidateAll(partyId);
    } catch {
      toast.error(t("drops.statusUpdateError"));
    }
  };

  const formatGold = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-6 py-5 shadow-soft-primary hover:glow-primary transition-all duration-300">
              <PlusIcon size={18} className="mr-2" />
              {t("drops.addButton")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
            <DialogHeader className="mb-4 mt-4">
              <DialogTitle className="text-2xl font-heading font-bold">
                {t("drops.addTitle")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("drops.addDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2 relative">
                <Label>{t("drops.itemLabel")}</Label>
                <Input
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setSelectedItem(null);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t("drops.itemPlaceholder")}
                  className="bg-background/50 border-border/50 rounded-lg"
                  required
                />
                {showSuggestions &&
                  searchResults &&
                  searchResults.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          className="w-full text-left px-3 py-2 hover:bg-accent/50 text-sm transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("drops.quantityLabel")}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-background/50 border-border/50 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("drops.valueLabel")}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0"
                    className="bg-background/50 border-border/50 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("drops.currencyLabel")}</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="currency-gold"
                      value="GOLD"
                      checked={currency === "GOLD"}
                      onChange={() => setCurrency("GOLD")}
                      className="accent-primary"
                    />
                    <Label htmlFor="currency-gold" className="cursor-pointer">
                      Gold
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="currency-tc"
                      value="TIBIA_COIN"
                      checked={currency === "TIBIA_COIN"}
                      onChange={() => setCurrency("TIBIA_COIN")}
                      className="accent-primary"
                    />
                    <Label htmlFor="currency-tc" className="cursor-pointer">
                      Tibia Coin
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("drops.sourceLabel")}</Label>
                <div className="relative">
                  <MapPinIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder={t("drops.sourcePlaceholder")}
                    className="pl-10 bg-background/50 border-border/50 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sold"
                  checked={sold}
                  onCheckedChange={(checked) => setSold(checked as boolean)}
                />
                <Label htmlFor="sold" className="cursor-pointer">
                  {t("drops.sold")}
                </Label>
              </div>
              <div className="space-y-2">
                <Label>{t("drops.dateLabel")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="submit"
                disabled={loading || (!selectedItem && !itemSearch)}
                className="w-full rounded-xl py-5 shadow-soft-primary"
              >
                {loading ? t("drops.adding") : t("drops.addButton")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground p-6 sm:rounded-[2rem] shadow-soft border-border/50 backdrop-blur-xl">
            <DialogHeader className="mb-4 mt-4">
              <DialogTitle className="text-2xl font-heading font-bold">
                {t("drops.editTitle")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {t("drops.editDescription")}
              </DialogDescription>
            </DialogHeader>
            {editingDrop && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("drops.itemLabel")}</Label>
                  <Input
                    value={editingDrop.itemName}
                    disabled
                    className="bg-muted/50 border-border/50 rounded-lg opacity-70"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("drops.quantityLabel")}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editingDrop.quantity}
                      onChange={(e) =>
                        setEditingDrop({
                          ...editingDrop,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-background/50 border-border/50 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("drops.valueLabel")}</Label>
                    <Input
                      value={editingDrop.value}
                      onChange={(e) =>
                        setEditingDrop({
                          ...editingDrop,
                          value: e.target.value,
                        })
                      }
                      className="bg-background/50 border-border/50 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("drops.currencyLabel")}</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-currency-gold"
                        value="GOLD"
                        checked={editingDrop.currency === "GOLD"}
                        onChange={() =>
                          setEditingDrop({ ...editingDrop, currency: "GOLD" })
                        }
                        className="accent-primary"
                      />
                      <Label
                        htmlFor="edit-currency-gold"
                        className="cursor-pointer"
                      >
                        Gold
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-currency-tc"
                        value="TIBIA_COIN"
                        checked={editingDrop.currency === "TIBIA_COIN"}
                        onChange={() =>
                          setEditingDrop({
                            ...editingDrop,
                            currency: "TIBIA_COIN",
                          })
                        }
                        className="accent-primary"
                      />
                      <Label
                        htmlFor="edit-currency-tc"
                        className="cursor-pointer"
                      >
                        Tibia Coin
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("drops.sourceLabel")}</Label>
                  <div className="relative">
                    <MapPinIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      value={editingDrop.source}
                      onChange={(e) =>
                        setEditingDrop({
                          ...editingDrop,
                          source: e.target.value,
                        })
                      }
                      placeholder={t("drops.sourcePlaceholder")}
                      className="pl-10 bg-background/50 border-border/50 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-sold"
                    checked={editingDrop.sold}
                    onCheckedChange={(checked) =>
                      setEditingDrop({
                        ...editingDrop,
                        sold: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-sold" className="cursor-pointer">
                    {t("drops.sold")}
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>{t("drops.dateLabel")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                          !editDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? (
                          format(editDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        initialFocus
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-5 shadow-soft-primary"
                >
                  {loading ? t("drops.updating") : t("drops.updateButton")}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {!drops || drops.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 rounded-[2rem] bg-card/30 backdrop-blur-sm">
          <GemIcon className="h-10 w-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">{t("drops.noDrops")}</p>
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border/30 text-left">
                  <th className="p-4 font-medium text-muted-foreground">
                    {t("drops.table.item")}
                  </th>
                  <th className="p-4 font-medium text-muted-foreground text-right">
                    {t("drops.table.quantity")}
                  </th>
                  <th className="p-4 font-medium text-muted-foreground text-right">
                    {t("drops.table.value")}
                  </th>
                  <th className="p-4 font-medium text-muted-foreground text-right">
                    {t("drops.table.total")}
                  </th>
                  <th className="p-4 font-medium text-muted-foreground">
                    {t("drops.table.status")}
                  </th>
                  <th className="p-4 font-medium text-muted-foreground">
                    {t("drops.table.date")}
                  </th>
                  <th className="p-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {drops.map((d) => (
                  <tr
                    key={d.id}
                    className={`border-b border-border/30 hover:bg-accent/30 transition-colors ${
                      d.sold ? "opacity-60 bg-muted/10" : ""
                    }`}
                  >
                    <td className="p-4 font-medium">
                      <span className={d.sold ? "line-through" : ""}>
                        {d.itemName}
                      </span>
                      {d.source && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPinIcon size={10} className="mr-1" />
                          {d.source}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {d.quantity}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {formatGold(d.value)}
                      {d.currency === "TIBIA_COIN" ? " TC" : ""}
                    </td>
                    <td className="p-4 text-right text-success font-medium">
                      {(BigInt(d.quantity) * BigInt(d.value)).toLocaleString()}
                      {d.currency === "TIBIA_COIN" ? " TC" : ""}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleSold(d.id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          d.sold
                            ? "bg-success/20 text-success hover:bg-success/30"
                            : "bg-warning/20 text-warning hover:bg-warning/30"
                        }`}
                      >
                        {d.sold ? t("drops.sold") : t("drops.unsold")}
                      </button>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(d.droppedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(d)}
                        className="h-8 w-8 hover:text-primary"
                      >
                        <PencilIcon size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(d.id)}
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <Trash2Icon size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
