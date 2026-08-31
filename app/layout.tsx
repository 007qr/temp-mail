import type { Metadata } from "next"
import { Geist_Mono, Outfit, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({subsets:['latin'],variable:'--font-heading'});

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DropMails — Free Temporary Email Address",
    template: "%s | DropMails",
  },
  description:
    "Create a free disposable email address in one click. Receive messages instantly, no signup, no password, no inbox to clean up afterwards.",
  applicationName: "DropMails",
  keywords: [
    "temporary email",
    "disposable email",
    "temp mail",
    "throwaway email",
    "fake email generator",
    "anonymous email",
    "10 minute mail",
  ],
  authors: [{ name: "DropMails" }],
  creator: "DropMails",
  publisher: "DropMails",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "DropMails",
    locale: "en_US",
    url: SITE_URL,
    title: "DropMails — Free Temporary Email Address",
    description:
      "Create a free disposable email address in one click. Receive messages instantly, no signup, no password, no inbox to clean up afterwards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DropMails — Free Temporary Email Address",
    description:
      "Create a free disposable email address in one click. Receive messages instantly, no signup required.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, robotoHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
