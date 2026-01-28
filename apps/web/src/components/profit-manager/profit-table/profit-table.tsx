import { DataTable } from "@/components/general/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ProfitEntry,
  useDeleteProfitEntry,
  useProfitHistory,
} from "@/queries/profit-manager.queries";
import { profitHistoryStore } from "@/stores/profit-history.store";
import { convertMinutesToHoursAndMinutes } from "@/utils/format-number";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCookiesNext } from "cookies-next/client";
import { useAtom } from "jotai";
import { ArrowUpDown, TrashIcon } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export const ProfitTable = ({ character }: { character: string }) => {
  const t = useTranslations("Dashboard.ProfitManagerPage");

  const { data: history, refetch: refetchHistory } =
    useProfitHistory(character);
  const locale = useCookiesNext().getCookie("NEXT_LOCALE") || "en-US";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Default to last 30 days
  const getLastMonth = () => {
    const now = new Date();
    const from = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 30,
    );
    return { from, to: now };
  };

  const getLastWeek = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return { from, to: now };
  };

  const getLastYear = () => {
    const now = new Date();
    const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return { from, to: now };
  };

  const baseDate = getLastMonth();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(baseDate);

  const [filteredTable, setFilteredTable] = useAtom(profitHistoryStore);

  useEffect(() => {
    setFilteredTable({
      history: history!.filter(
        (item) =>
          moment(item.huntDate).isSameOrAfter(dateRange?.from) &&
          moment(item.huntDate).isSameOrBefore(dateRange?.to),
      ),
    });
  }, [dateRange, history, setFilteredTable]);

  const deleteEntryProfitMutation = useDeleteProfitEntry();
  const DeleteDialog = () => {
    const handleDelete = async () => {
      const response = await deleteEntryProfitMutation.mutateAsync(
        String(entryId),
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
  const columns: ColumnDef<ProfitEntry>[] = [
    {
      accessorKey: "huntName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.original.huntName,
    },
    {
      accessorKey: "huntDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span>{moment(row.original.huntDate).utc().format("DD/MM/YYYY")}</span>
      ),
    },
    {
      accessorKey: "huntDuration",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.duration")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        convertMinutesToHoursAndMinutes(row.original.huntDuration),
    },
    {
      accessorKey: "profit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.grossProfit")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => Number(row.original.profit).toLocaleString(locale),
    },
    {
      accessorKey: "tibiaCoinValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.tibiaCoinValue")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        Number(row.original.tibiaCoinValue).toLocaleString(locale),
    },
    {
      accessorKey: "preyCardsUsed",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.preyCardValue")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        Number(row.original.preyCardsUsed).toLocaleString(locale),
    },
    {
      accessorKey: "boostsValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.boostValue")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        Number(row.original.boostsValue).toLocaleString(locale),
    },
    {
      accessorKey: "netProfit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.netProfit")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={cn(
            "font-bold",
            Number(row.original.netProfit) < 0
              ? "text-red-500"
              : "text-green-500",
          )}
        >
          {Number(row.original.netProfit).toLocaleString(locale)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("table.headers.actions"),
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setEntryId(row.original.id);
            setDeleteDialogOpen(true);
          }}
        >
          <TrashIcon />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredTable.history || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
      sorting: [{ id: "huntDate", desc: true }],
    },
  });

  const resetDateFields = () => {
    const fields =
      document.querySelectorAll<HTMLInputElement>('input[type="date"]');
    fields.forEach((field) => (field.value = ""));
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Quick filter buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const range = getLastWeek();
              setDateRange(range);
            }}
          >
            {t("buttons.lastWeek")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const range = getLastMonth();
              setDateRange(range);
            }}
          >
            {t("buttons.lastMonth")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const range = getLastYear();
              setDateRange(range);
            }}
          >
            {t("buttons.lastYear")}
          </Button>
        </div>

        {/* Date range inputs */}
        <div className="flex items-end gap-4">
          <div>
            <Label>{t("labels.startDateFilter")}</Label>
            <Input
              className="max-w-[300px]"
              type="date"
              value={
                dateRange?.from
                  ? moment(dateRange.from).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) => {
                const date = new Date(e.target.value);
                setDateRange({
                  from: date,
                  to: dateRange?.to,
                });
              }}
              max={moment().format("YYYY-MM-DD")}
            />
          </div>

          <div>
            <Label>{t("labels.endDateFilter")}</Label>
            <Input
              className="max-w-[300px]"
              type="date"
              value={
                dateRange?.to ? moment(dateRange.to).format("YYYY-MM-DD") : ""
              }
              onChange={(e) => {
                const date = new Date(e.target.value);
                setDateRange({
                  from: dateRange?.from,
                  to: date,
                });
              }}
              max={moment().format("YYYY-MM-DD")}
            />
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              setDateRange(baseDate);
            }}
          >
            {t("buttons.resetFilter")}
          </Button>
        </div>
      </div>
      <DataTable table={table} />
      <DeleteDialog />
    </>
  );
};
