import { crx } from "@crxjs/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

import manifest from "./manifest.config.ts"

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rollupOptions: {
      input: {
        tab: fileURLToPath(new URL("./tab.html", import.meta.url)),
        sandbox: fileURLToPath(new URL("./sandbox.html", import.meta.url)),
      },
    },
  },
})
