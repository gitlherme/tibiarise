import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/header";
import Providers from "@/components/utils/providers";
import { Footer } from "@/components/footer/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { HotjarSnippet } from "@/components/utils/hotjar";
import { Ribbon } from "@/components/ribbon/ribbon";
import Link from "next/link";
import { MobileHeader } from "@/components/header/mobile-header";

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
      <head>
        <meta name="title" content="Tibia Rise" />
        <meta
          name="description"
          content="Discover a new level of immersion in Tibia with TibiaRise."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tibiarise.app/" />
        <meta property="og:title" content="Tibia Rise" />
        <meta
          property="og:description"
          content="Discover a new level of immersion in Tibia with TibiaRise."
        />
        <meta property="og:image" content="https://i.imgur.com/MT1S4xX.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tibiarise.app/" />
        <meta property="twitter:title" content="Tibia Rise" />
        <meta
          property="twitter:description"
          content="Discover a new level of immersion in Tibia with TibiaRise."
        />
        <meta
          property="twitter:image"
          content="https://i.imgur.com/MT1S4xX.png"
        />

        <link
          rel="shortcut icon"
          href="/tibiarise-favicon.svg"
          type="image/x-icon"
        />
      </head>
      <body className={DMSans.className}>
        <Providers>
          <div className="flex flex-col">
            <Ribbon>
              <p>
                <span className="font-bold">✨ NEW FEATURE! ✨</span> - Use{" "}
                <Link href="/compare-characters" className="underline">
                  Compare characters
                </Link>{" "}
                to see who was better between two characters.
              </p>
            </Ribbon>
            <div className="hidden lg:block">
              <Header />
            </div>
            <div className="block lg:hidden">
              <MobileHeader />
            </div>
            <main className="container mx-auto min-h-[68vh]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics
        gaId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)}
      />
      <HotjarSnippet />
    </html>
  );
}
