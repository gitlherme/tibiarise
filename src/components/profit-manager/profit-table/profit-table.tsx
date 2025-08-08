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
import { Button } from "../../ui/button";
import { useState } from "react";
import {
  ProfitEntry,
  useDeleteProfitEntry,
  useProfitHistory,
} from "@/queries/profit-manager.queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useTranslations } from "next-intl";
import { convertMinutesToHoursAndMinutes } from "@/utils/format-number";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, TrashIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export const ProfitTable = ({ character }: { character: string }) => {
  const t = useTranslations("Dashboard.ProfitManagerPage");
  const dtTranslations = useTranslations("DataTable");
  const { data: history, refetch: refetchHistory } =
    useProfitHistory(character);
  const locale = useCookiesNext().getCookie("NEXT_LOCALE") || "en-US";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

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
      cell: ({ row }) => new Date(row.original.huntDate).toLocaleDateString(),
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
              : "text-green-500"
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
    data: history || [],
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

  return (
    <>
      {/* <div className="flex items-center py-4">
        <Calendar
          mode="range"
          defaultMonth={new Date()}
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-lg border shadow-sm"
        />
      </div> */}
      <Table className="mt-8">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-0 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {dtTranslations("noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {dtTranslations("pagination.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {dtTranslations("pagination.next")}
        </Button>
      </div>
      <DeleteDialog />
    </>
  );
};
