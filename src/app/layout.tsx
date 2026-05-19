import type { Metadata, Viewport } from "next";
import { Work_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ConditionalHeader } from "@/utils/conditional-header";

import "../styles/globals.css";
import "../styles/includes.css";
import "../styles/animations.css";

const work_sans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maileo",
  description: "Internal mailing console",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: "/favicons/logo.png",
        sizes: "834x408",
      },
      { rel: "icon", type: "image/svg+xml", url: "/favicons/logo.svg" },
      { rel: "icon", type: "image/x-icon", url: "/favicons/favicon.ico" },
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        url: "/favicons/favicon.ico",
      },
    ],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${work_sans.variable} antialiased`}
      >
        <TooltipProvider delayDuration={150}>
          <Toaster />
          <ConditionalHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
