"use client";

import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";

export const ProfileActions = () => {
  return (
    <Link href="/dashboard/characters">
      <Button>Go to Dashboard</Button>
    </Link>
  );
};
