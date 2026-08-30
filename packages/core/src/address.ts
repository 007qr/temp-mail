export const DOMAIN = "007qr.dev"

export function generateAlias() {
  const bytes = crypto.getRandomValues(new Uint8Array(5))
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("")
}

export function toAddress(alias: string) {
  return `${alias}+temp@${DOMAIN}`
}

export function sanitizeAlias(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32)
}
