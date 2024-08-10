'use client';

import { useGetCharacterData } from "@/queries/character-data.query";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";


export const CharacterInformation = () => {
  const { data } = useGetCharacterData();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="grid gap-1">
          <div className="flex gap-8">
            <CardTitle>{data?.characterInfo.name}</CardTitle>
            <Badge>Top 10 MS de Yubra</Badge>
          </div>
          <CardDescription>{data?.characterInfo.vocation}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Level</div>
          <div className="text-4xl font-bold">{data?.characterInfo.level}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">XP</div>
          <div className="text-4xl font-bold"></div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">Online Time</div>
          <div className="text-4xl font-bold"></div>
        </div>
      </CardContent>
    </Card>
  );
};
