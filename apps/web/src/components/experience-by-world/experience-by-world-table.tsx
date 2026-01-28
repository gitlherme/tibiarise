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
import { ArrowUpDown } from "lucide-react";
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
  const { data } = useGetExperienceByWorld();

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
            className="hover:text-primary"
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
              ? "text-green-500"
              : Math.sign(row.original.experienceGained) === -1
              ? "text-red-500"
              : ""
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

  return (
    <div>
      {data?.topGainers && (
        <>
          <div className="flex flex-col max-w-[200px] gap-4">
            <Label htmlFor="vocation">Filter by Vocation</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Select vocation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Knight">Knight</SelectItem>
                <SelectItem value="Paladin">Paladin</SelectItem>
                <SelectItem value="Sorcerer">Sorcerer</SelectItem>
                <SelectItem value="Druid">Druid</SelectItem>
                <SelectItem value="Monk">Monk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DataTable table={table} />
        </>
      )}
    </div>
  );
};
