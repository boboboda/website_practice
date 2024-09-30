import "@/styles/globals.css";
import Header from "../components/home/header";
import Footer from "@/components/home/footer";
import { siteConfig } from "@/config/site";

import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import AdFooter from "@/components/home/adFooter";
import { Metadata, Viewport } from "next";
import AppProvider from "@/components/channelTalkManager";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/siteIcon.ico",
    shortcut: "/siteIcon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="flex flex-col h-screen">
              <Header />
              <main className="items-center justify-center w-full xl:pt-16 flex-grow overflow-auto">
                {children}
                <Footer />
              </main>
              <AdFooter />
            </div>
          </Providers>
        </AppProvider>
      </body>
    </html>
  );
}
