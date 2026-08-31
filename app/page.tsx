import type { Metadata } from "next"

import { AddressPicker } from "@/components/address-picker"
import { DOMAIN, generateAlias } from "@temp-mail/core"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Free Temporary Email — Disposable Inbox, No Signup",
  description: `Generate a free @${DOMAIN} temporary email address instantly. Read incoming mail in a disposable inbox — no signup, no password, nothing to clean up.`,
  alternates: { canonical: "/" },
  openGraph: {
    url: SITE_URL,
    title: "Free Temporary Email — Disposable Inbox, No Signup",
    description: `Generate a free @${DOMAIN} temporary email address instantly. Read incoming mail in a disposable inbox — no signup, no password.`,
  },
}

// Search engines only see the empty picker, so the structured data is what tells
// them what this page actually offers.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: `Free temporary email addresses on ${DOMAIN}.`,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      url: SITE_URL,
      name: SITE_NAME,
      applicationCategory: "CommunicationApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description: `Generate a disposable @${DOMAIN} email address and read incoming mail without signing up.`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Instant disposable email address",
        "No signup or password required",
        "Live inbox for incoming messages",
        "Custom mailbox names",
      ],
    },
  ],
}

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AddressPicker initialAlias={generateAlias()} />
    </main>
  )
}
