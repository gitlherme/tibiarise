import { Sidebar } from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/utils/providers/providers";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Tibia Rise",
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>,
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
        <link rel="shortcut icon" href="/icon.svg" type="image/x-icon" />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased text-foreground bg-background`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="flex gap-8 min-h-screen">
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
