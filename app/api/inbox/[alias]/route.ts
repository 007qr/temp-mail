import { parseMail, type Mail } from "@/lib/mail"

export async function GET(_request: Request, { params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params
  const response = await fetch(
    `https://temp-mail.ayp.workers.dev/api/inbox/${encodeURIComponent(`${alias}+temp`)}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    return Response.json({ error: "Unable to reach mailbox" }, { status: response.status })
  }

  const raw = await response.json()
  const mails: Mail[] = raw.map(parseMail)
  mails.sort((a, b) => b.receivedAt - a.receivedAt)

  return Response.json(mails, { headers: { "cache-control": "no-store" } })
}
