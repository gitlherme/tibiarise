import { Inter } from "next/font/google";
import "../../globals.css";
import { Header } from "@/components/header/header";
import Providers from "@/components/utils/providers/providers";
import { Footer } from "@/components/footer/footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { MobileHeader } from "@/components/header/mobile-header";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const cookiesStore = await cookies();

  const localeCookieExists = cookiesStore.get("NEXT_LOCALE");
  if (!localeCookieExists) {
    cookiesStore.set("NEXT_LOCALE", locale);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
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

        <link rel="shortcut icon" href="/icon.svg" type="image/x-icon" />
      </head>
      <body className={`${fontSans.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex flex-col">
              <div className="hidden lg:block">
                <Header />
              </div>
              <div className="block lg:hidden">
                <MobileHeader />
              </div>
              <main className="min-h-[68vh] md:px-12">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics
        gaId={String(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)}
      />
    </html>
  );
}
