import { generateAlias, inboxUrl, toInbox, type Mail } from "@temp-mail/core"

export type Stored = { alias: string; seen: number[] }

export async function readMailbox(): Promise<Stored> {
  const stored = (await chrome.storage.local.get(["alias", "seen"])) as Partial<Stored>

  if (stored.alias) {
    return { alias: stored.alias, seen: stored.seen ?? [] }
  }

  const alias = generateAlias()
  await chrome.storage.local.set({ alias, seen: [] })
  return { alias, seen: [] }
}

export async function setAlias(alias: string) {
  await chrome.storage.local.set({ alias, seen: [] })
}

export async function markSeen(ids: number[]) {
  await chrome.storage.local.set({ seen: ids })
}

export async function fetchInbox(alias: string): Promise<Mail[]> {
  const response = await fetch(inboxUrl(alias), { cache: "no-store" })
  if (!response.ok) throw new Error(`Mailbox unavailable (${response.status})`)
  return toInbox(await response.json())
}
