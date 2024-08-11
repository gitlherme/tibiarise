"use client";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/header";
import Providers from "@/components/utils/providers";

const DMSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={DMSans.className}>
        <Providers>
          <Header />
          <main className="md:container mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
