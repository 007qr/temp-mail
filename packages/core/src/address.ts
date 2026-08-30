export const DOMAIN = "dropmails.org"

export function generateAlias() {
  const bytes = crypto.getRandomValues(new Uint8Array(5))
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("")
}

export function toAddress(alias: string) {
  return `${alias}@${DOMAIN}`
}

export function sanitizeAlias(input: string) {
  return input
    .toLowerCase()
    .split("@")[0]
    .split("+")[0]
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32)
}
