import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

import { SiteHeader } from "@/components/catalog/site-header";

import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: {
    default: "E-mall",
    template: "%s · E-mall",
  },
  description: "Marketplace E-mall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
