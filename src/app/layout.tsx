import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/header";
import Providers from "@/components/utils/providers";
import { Footer } from "@/components/footer/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";

const DMSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={DMSans.className}>
        <Providers>
          <div className="flex flex-col justify-between min-h-screen">
            <Header />
            <main className="container mx-auto">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics
        gaId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)}
      />
    </html>
  );
}
