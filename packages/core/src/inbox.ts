import { parseMail, type Mail } from "./mail"

export const INBOX_ENDPOINT = "https://temp-mail.ayp.workers.dev/api/inbox"

export type RawMail = {
  id: number
  sender: string
  subject: string
  body: string
  received_at: number
}

export function inboxUrl(alias: string) {
  return `${INBOX_ENDPOINT}/${encodeURIComponent(alias)}`
}

export function toInbox(raw: RawMail[]): Mail[] {
  return raw.map(parseMail).sort((a, b) => b.receivedAt - a.receivedAt)
}

export class InboxError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Seconds the server asked us to wait, from Retry-After. Null when it did not say. */
    readonly retryAfter: number | null = null,
  ) {
    super(message)
    this.name = "InboxError"
  }
}

function retryAfterSeconds(response: Response) {
  const header = response.headers.get("retry-after")
  if (!header) return null

  // Retry-After is either a delay in seconds or an HTTP date.
  const seconds = Number(header)
  if (Number.isFinite(seconds)) return Math.max(0, seconds)

  const date = Date.parse(header)
  return Number.isNaN(date) ? null : Math.max(0, Math.round((date - Date.now()) / 1000))
}

export async function fetchInbox(alias: string): Promise<Mail[]> {
  const response = await fetch(inboxUrl(alias), { cache: "no-store" })

  if (!response.ok) {
    throw new InboxError(
      response.status,
      response.status === 429 ? "Too many requests" : `Mailbox unavailable (${response.status})`,
      retryAfterSeconds(response),
    )
  }

  return toInbox(await response.json())
}
