"use client";
import { Link } from "@/i18n/routing";
import { PlayerExperienceByWorld } from "@/models/experience-by-world.model";
import { useGetExperienceByWorld } from "@/queries/experience-by-world.queries";
import { formatNumberToLocale } from "@/utils/format-number";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Loader2, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DataTable } from "../general/data-table";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const ExperienceByWorldTable = () => {
  const t = useTranslations("ExperienceByWorldPage");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data, isLoading } = useGetExperienceByWorld();

  const columns: ColumnDef<PlayerExperienceByWorld>[] = [
    {
      accessorKey: "rank",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "characterName",
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
      cell: ({ row }) => {
        return (
          <Link
            href={`/character/${row.original.characterName}`}
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            {row.original.characterName}
          </Link>
        );
      },
    },
    {
      accessorKey: "vocation",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.vocation")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span>{row.original.vocation}</span>;
      },
    },
    {
      accessorKey: "experienceGained",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("table.headers.xpGain")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={
            Math.sign(row.original.experienceGained) === 1
              ? "text-success font-mono"
              : Math.sign(row.original.experienceGained) === -1
                ? "text-destructive font-mono"
                : "font-mono"
          }
        >
          {Math.sign(row.original.experienceGained) === 1
            ? `+${formatNumberToLocale(row.original.experienceGained)}`
            : Math.sign(row.original.experienceGained) === 0
              ? formatNumberToLocale(row.original.experienceGained)
              : `${formatNumberToLocale(row.original.experienceGained)}`}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.topGainers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-20">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (!data?.topGainers || data.topGainers.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-20">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <SearchX className="w-12 h-12 text-muted-foreground/30" />
          <div className="space-y-2">
            <p className="font-medium text-foreground">No results found</p>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a world and time period above, then click Search to see the
              top experience gainers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-card/40 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label htmlFor="vocation" className="text-muted-foreground ml-1">
              Filter by Vocation
            </Label>
            <Select
              value={
                (table.getColumn("vocation")?.getFilterValue() as string) ||
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("vocation")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="bg-background/50 border-border/50 h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue placeholder="Select vocation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vocations</SelectItem>
                <SelectItem value="Knight">Knight</SelectItem>
                <SelectItem value="Paladin">Paladin</SelectItem>
                <SelectItem value="Sorcerer">Sorcerer</SelectItem>
                <SelectItem value="Druid">Druid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground font-medium px-2">
            Showing {table.getFilteredRowModel().rows.length} characters
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md shadow-soft overflow-hidden">
          <div className="p-1">
            <DataTable table={table} />
          </div>
        </div>
      </div>
    </div>
  );
};
