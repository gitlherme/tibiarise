import { Inter } from "next/font/google";
import "../../globals.css";
import Providers from "@/components/utils/providers";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar/sidebar";

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
    <html lang={locale}>
      <head>
        <link rel="shortcut icon" href="/icon.svg" type="image/x-icon" />
      </head>
      <body className={fontSans.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="grid grid-cols-12 min-h-screen">
              <div className="col-span-2 hidden md:block">
                <Sidebar />
              </div>
              <main className="col-span-10">{children}</main>
              <Toaster />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
