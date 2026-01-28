"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Image src="/error.jpg" alt="Error" width={400} height={400} />
      <h1 className="font-bold text-3xl">Oops! An error occurred.</h1>
      <p>Sorry about that! We&apos;ll fix it as soon as possible.</p>
      <Link passHref href="/">
        <Button variant="outline">Go back home</Button>
      </Link>
    </div>
  );
}
