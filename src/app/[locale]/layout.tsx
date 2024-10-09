import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header/header";
import Providers from "@/components/utils/providers";
import { Footer } from "@/components/footer/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { HotjarSnippet } from "@/components/utils/hotjar";
import { MobileHeader } from "@/components/header/mobile-header";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getCookie, setCookie } from "cookies-next";

const DMSans = DM_Sans({ subsets: ["latin"] });
const BricolageGrotesque = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const localeCookieExists = getCookie("NEXT_LOCALE");
  if (!localeCookieExists) {
    setCookie("NEXT_LOCALE", locale);
  }

  return (
    <html lang={locale}>
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
      <body className={BricolageGrotesque.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex flex-col">
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
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics
        gaId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)}
      />
      <HotjarSnippet />
    </html>
  );
}
