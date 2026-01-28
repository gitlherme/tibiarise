"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export interface Character {
  id: string;
  name: string;
  world: string;
  vocation?: string | null;
  level: number;
  experience: string;
  streak: number;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
  verified?: boolean | null;
  verifiedAt?: string | null;
}

interface CharacterGridProps {
  characters: Character[];
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 border-dashed">
        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold">No Characters Found</h3>
        <p className="text-muted-foreground mb-4">
          You haven&apos;t added any characters yet.
        </p>
        <Link
          href="/dashboard/characters/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          Add Your First Character
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character) => (
        <Link
          key={character.id}
          href={`/dashboard/characters/${character.name}`}
          className="block group"
        >
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                {character.name}
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {character.world}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                {character.vocation || "Unknown Vocation"} • Level{" "}
                {character.level}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Streak: {character.streak} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Skull className="h-3 w-3" />
                  <span>View Stats</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
