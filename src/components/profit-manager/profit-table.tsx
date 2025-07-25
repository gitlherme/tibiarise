import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCookiesNext } from "cookies-next/client";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  useDeleteProfitEntry,
  useProfitHistory,
} from "@/queries/profit-manager.queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export const ProfitTable = ({ character }: { character: string }) => {
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const { data: history, refetch: refetchHistory } =
    useProfitHistory(character);
  const locale = useCookiesNext().getCookie("NEXT_LOCALE") || "en-US";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);

  const deleteEntryProfitMutation = useDeleteProfitEntry();
  const DeleteDialog = () => {
    const handleDelete = async () => {
      const response = await deleteEntryProfitMutation.mutateAsync(
        String(entryId)
      );
      if (response.success) {
        refetchHistory();
        setDeleteDialogOpen(false);
      }
    };
    return (
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">
              {t("table.deleteModal.title")}
            </DialogTitle>
            <DialogDescription>
              {t("table.deleteModal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("table.deleteModal.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="ml-2"
            >
              {t("table.deleteModal.confirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-border bg-card">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.name")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.date")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.grossProfit")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.tibiaCoinValue")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.preyCardValue")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.boostValue")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.netProfit")}
            </TableHead>
            <TableHead className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {history?.map((entry, idx) => (
            <TableRow key={idx} className="hover:bg-accent/50">
              <TableCell className="py-3 px-4 text-foreground">
                {entry.huntName}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                {new Date(entry.huntDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                {Number(entry.profit).toLocaleString(locale)}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                {Number(entry.tibiaCoinValue).toLocaleString(locale)}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                {Number(entry.preyCardsUsed).toLocaleString(locale)}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                {Number(entry.boostsValue).toLocaleString(locale)}
              </TableCell>
              <TableCell
                className={cn(
                  "py-3 px-4 font-bold",
                  Number(entry.netProfit) < 0
                    ? "text-red-500"
                    : "text-green-500"
                )}
              >
                {Number(entry.netProfit).toLocaleString(locale)}
              </TableCell>
              <TableCell className="py-3 px-4 text-foreground">
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    setEntryId(entry.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2Icon width={20} aria-label="Delete" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteDialog />
    </>
  );
};
