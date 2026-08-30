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
  return `${INBOX_ENDPOINT}/${encodeURIComponent(`${alias}+temp`)}`
}

export function toInbox(raw: RawMail[]): Mail[] {
  return raw.map(parseMail).sort((a, b) => b.receivedAt - a.receivedAt)
}
