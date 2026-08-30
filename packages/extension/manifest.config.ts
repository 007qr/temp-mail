import { defineManifest } from "@crxjs/vite-plugin"

export default defineManifest({
  manifest_version: 3,
  name: "Temp Mail",
  version: "0.0.1",
  description: "Disposable inboxes on 007qr.dev, one click from any signup form.",
  icons: { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" },
  action: {
    default_popup: "index.html",
    default_title: "Temp Mail",
    default_icon: { "16": "icons/16.png", "48": "icons/48.png", "128": "icons/128.png" },
  },
  background: { service_worker: "src/background.ts", type: "module" },
  permissions: ["storage", "alarms", "contextMenus", "clipboardWrite"],
  host_permissions: ["https://temp-mail.ayp.workers.dev/*"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/content.ts"],
      run_at: "document_idle",
      all_frames: true,
    },
  ],
  sandbox: { pages: ["sandbox.html"] },
  web_accessible_resources: [
    { resources: ["sandbox.html", "tab.html"], matches: ["<all_urls>"] },
  ],
})
