import type { MetadataRoute } from "next"

import { SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Free Temporary Email Address`,
    short_name: SITE_NAME,
    description:
      "Create a free disposable email address in one click. Receive messages instantly, no signup, no password, no inbox to clean up afterwards.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a8943",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
