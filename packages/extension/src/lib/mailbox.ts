import { generateAlias, inboxUrl, toInbox, type Mail } from "@temp-mail/core"

export async function readMailbox(): Promise<{ alias: string }> {
  const stored = (await chrome.storage.local.get("alias")) as { alias?: string }

  if (stored.alias) return { alias: stored.alias }

  const alias = generateAlias()
  await chrome.storage.local.set({ alias })
  return { alias }
}

export async function setAlias(alias: string) {
  await chrome.storage.local.set({ alias })
}

export async function fetchInbox(alias: string): Promise<Mail[]> {
  const response = await fetch(inboxUrl(alias), { cache: "no-store" })
  if (!response.ok) throw new Error(`Mailbox unavailable (${response.status})`)
  return toInbox(await response.json())
}
