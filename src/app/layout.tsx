"use client";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Header } from "@/components/header/header";

const DMSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={DMSans.className}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="container mx-auto">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
