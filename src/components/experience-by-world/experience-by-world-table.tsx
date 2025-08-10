"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { useGetExperienceByWorld } from "@/queries/experience-by-world.queries";
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { PlayerExperienceByWorld } from "@/models/experience-by-world.model";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { DataTable } from "../general/data-table";


export const ExperienceByWorldTable = () => {
  const t = useTranslations("ExperienceByWorldPage");
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data } = useGetExperienceByWorld();

  const columns: ColumnDef<PlayerExperienceByWorld>[] = [
    {
      accessorKey: "rank",
      header: () => {
        return (
          <span>Rank</span>
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
          <Link href={`/character/${row.original.characterName}`} className="hover:text-primary">
            {row.original.characterName}
          </Link>
        )
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


  ]

  const table = useReactTable({
      data: data?.topGainers || [],
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
          pageSize: 50,
        },
      },
    });

  return (
    data?.topGainers && (
      <DataTable table={table} />
    )
  );
};
