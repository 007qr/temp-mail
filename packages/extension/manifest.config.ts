import { defineManifest } from "@crxjs/vite-plugin"

export default defineManifest({
  manifest_version: 3,
  name: "Temp Mail",
  version: "0.0.1",
  description: "Disposable inboxes on dropmails.org, one click from any signup form.",
  icons: { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" },
  action: {
    default_popup: "index.html",
    default_title: "Temp Mail",
    default_icon: { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" },
  },
  background: { service_worker: "src/background.ts", type: "module" },
  permissions: ["storage", "contextMenus", "activeTab", "scripting"],
  host_permissions: ["https://temp-mail.ayp.workers.dev/*"],
  sandbox: { pages: ["sandbox.html"] },
})
