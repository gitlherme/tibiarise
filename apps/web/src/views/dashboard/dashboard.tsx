"use client";

import {
  Character,
  CharacterGrid,
} from "@/components/dashboard/character-grid";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface DashboardViewProps {
  characters: Character[];
}

export const DashboardView = ({ characters }: DashboardViewProps) => {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <DashboardHeader
          heading="Dashboard"
          text="Manage all your Tibia characters in one place."
        />
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/characters/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Character
            </Button>
          </Link>
        </div>
      </div>

      <CharacterGrid characters={characters} />
    </div>
  );
};
