import { inboxUrl, toInbox } from "@temp-mail/core"

export async function GET(_request: Request, { params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params
  const response = await fetch(inboxUrl(alias), { cache: "no-store" })

  if (!response.ok) {
    return Response.json({ error: "Unable to reach mailbox" }, { status: response.status })
  }

  return Response.json(toInbox(await response.json()), {
    headers: { "cache-control": "no-store" },
  })
}
