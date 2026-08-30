import { generateAlias } from "@temp-mail/core"

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

export { fetchInbox } from "@temp-mail/core"
