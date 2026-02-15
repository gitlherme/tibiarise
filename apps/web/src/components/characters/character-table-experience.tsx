"use client";
import moment from "moment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCharacterData } from "@/queries/character-data.queries";
import { formatNumberToLocale } from "@/utils/format-number";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ExperienceTable = () => {
  const t = useTranslations("CharacterPage");
  const { data, isLoading } = useGetCharacterData();
  const characterTable = data?.experienceTable;

  if (isLoading) {
    return <Skeleton className="w-[100%] h-[300px] mt-12" />;
  }

  if (characterTable?.length === 1) {
    return (
      <div className="mt-12 text-center">
        <span>{t("experienceTable.noExperience")}</span>
      </div>
    );
  }

  return (
    <Card className="mt-8 border-border/50 bg-card/60 backdrop-blur-sm shadow-soft overflow-hidden">
      <CardHeader>
        <CardTitle className="font-heading text-xl">
          {t("experienceTable.title", { defaultMessage: "Experience History" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b-border/50">
              <TableHead className="font-bold text-muted-foreground">
                {t("experienceTable.headers.date")}
              </TableHead>
              <TableHead className="font-bold text-muted-foreground">
                {t("experienceTable.headers.xpGain")}
              </TableHead>
              <TableHead className="font-bold text-muted-foreground">
                {t("experienceTable.headers.level")}
              </TableHead>
              <TableHead className="font-bold text-muted-foreground text-right">
                {t("experienceTable.headers.totalExperience")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {characterTable?.map((day, index) => (
              <TableRow
                key={day.date}
                className="hover:bg-muted/30 transition-colors border-b-border/50 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {moment(day.date).subtract(1, "day").format("DD/MM/YYYY")}
                </TableCell>
                <TableCell
                  className={
                    Math.sign(day.experience) === 1
                      ? "text-emerald-500 font-bold"
                      : Math.sign(day.experience) === -1
                        ? "text-red-500 font-bold"
                        : "text-muted-foreground"
                  }
                >
                  {Math.sign(day.experience) === 1
                    ? `+${formatNumberToLocale(day.experience)}`
                    : Math.sign(day.experience) === 0
                      ? formatNumberToLocale(day.experience)
                      : `${formatNumberToLocale(day.experience)}`}
                </TableCell>
                <TableCell className="font-medium">{day.level}</TableCell>
                <TableCell className="font-mono text-right text-muted-foreground group-hover:text-foreground transition-colors">
                  {formatNumberToLocale(day.totalExperience)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
