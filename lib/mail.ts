export type Mail = {
  id: number
  name: string
  address: string
  subject: string
  receivedAt: number
  html: string | null
  text: string
  preview: string
}

type Part = {
  headers: Record<string, string>
  body: string
}

function splitHeaders(raw: string): Part {
  const match = raw.match(/\r?\n\r?\n/)
  if (!match || match.index === undefined) {
    return { headers: {}, body: raw }
  }

  const block = raw.slice(0, match.index).replace(/\r?\n[ \t]+/g, " ")
  const headers: Record<string, string> = {}

  for (const line of block.split(/\r?\n/)) {
    const at = line.indexOf(":")
    if (at === -1) continue
    const key = line.slice(0, at).trim().toLowerCase()
    if (key in headers) continue
    headers[key] = line.slice(at + 1).trim()
  }

  return { headers, body: raw.slice(match.index + match[0].length) }
}

function param(value: string, name: string) {
  const match = value.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"|${name}\\s*=\\s*([^;\\s]+)`, "i"))
  return match ? (match[1] ?? match[2]) : null
}

function decode(bytes: number[], charset: string) {
  try {
    return new TextDecoder(charset).decode(new Uint8Array(bytes))
  } catch {
    return new TextDecoder("utf-8").decode(new Uint8Array(bytes))
  }
}

function decodeQuotedPrintable(input: string, charset: string) {
  const bytes: number[] = []
  const text = input.replace(/=\r?\n/g, "")

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "=" && /^[0-9a-f]{2}$/i.test(text.slice(i + 1, i + 3))) {
      bytes.push(parseInt(text.slice(i + 1, i + 3), 16))
      i += 2
    } else {
      for (const byte of new TextEncoder().encode(text[i])) bytes.push(byte)
    }
  }

  return decode(bytes, charset)
}

function decodeBase64(input: string, charset: string) {
  try {
    const binary = atob(input.replace(/\s+/g, ""))
    const bytes: number[] = []
    for (let i = 0; i < binary.length; i++) bytes.push(binary.charCodeAt(i))
    return decode(bytes, charset)
  } catch {
    return ""
  }
}

function decodeBody(part: Part) {
  const charset = param(part.headers["content-type"] ?? "", "charset") ?? "utf-8"
  const encoding = (part.headers["content-transfer-encoding"] ?? "").toLowerCase()

  if (encoding === "quoted-printable") return decodeQuotedPrintable(part.body, charset)
  if (encoding === "base64") return decodeBase64(part.body, charset)
  return part.body
}

export function decodeWords(input: string) {
  return input.replace(/=\?([^?]+)\?([bq])\?([^?]*)\?=/gi, (_, charset: string, kind: string, data: string) =>
    kind.toLowerCase() === "b"
      ? decodeBase64(data, charset)
      : decodeQuotedPrintable(data.replace(/_/g, " "), charset)
  )
}

function collect(part: Part, out: { html: string | null; text: string | null }) {
  const type = (part.headers["content-type"] ?? "text/plain").toLowerCase()

  if (type.startsWith("multipart/")) {
    const boundary = param(part.headers["content-type"] ?? "", "boundary")
    if (!boundary) return

    const marker = `--${boundary}`
    const sections: string[] = []
    let current: string[] | null = null

    for (const line of part.body.split(/\r?\n/)) {
      const edge = line.trimEnd()
      if (edge === marker || edge === `${marker}--`) {
        if (current) sections.push(current.join("\r\n"))
        current = edge === marker ? [] : null
        continue
      }
      current?.push(line)
    }

    for (const section of sections) {
      if (section.trim()) collect(splitHeaders(section), out)
    }
    return
  }

  if (param(part.headers["content-disposition"] ?? "", "filename")) return

  if (type.startsWith("text/html") && !out.html) out.html = decodeBody(part)
  if (type.startsWith("text/plain") && !out.text) out.text = decodeBody(part)
}

function stripQuoted(input: string) {
  const kept: string[] = []
  let inHeaders = false

  for (const raw of input.split(/\r?\n/)) {
    const line = raw.trim()

    if (/^-{2,}\s*(forwarded message|original message)/i.test(line)) {
      inHeaders = true
      continue
    }

    if (inHeaders) {
      if (!line) {
        inHeaders = false
        continue
      }
      if (/^(from|to|cc|bcc|date|sent|subject|reply-to)\s*:/i.test(line)) continue
      inHeaders = false
    }

    if (line.startsWith(">")) continue
    if (/^on .+wrote:$/i.test(line)) continue

    kept.push(line)
  }

  return kept.join(" ")
}

export function htmlToText(html: string) {
  return html
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6]|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function toPreview(text: string) {
  return stripQuoted(text).replace(/\s+/g, " ").trim().slice(0, 140)
}

export function parseMail(raw: {
  id: number
  sender: string
  subject: string
  body: string
  received_at: number
}): Mail {
  const message = splitHeaders(raw.body ?? "")
  const out: { html: string | null; text: string | null } = { html: null, text: null }
  collect(message, out)

  const from = decodeWords(message.headers.from ?? "")
  const named = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>/)
  const text = out.text?.trim() || (out.html ? htmlToText(out.html) : "")

  return {
    id: raw.id,
    name: named?.[1]?.trim() || raw.sender.split("@")[0],
    address: named?.[2]?.trim() || raw.sender,
    subject: decodeWords(raw.subject ?? "") || "(no subject)",
    receivedAt: raw.received_at,
    html: out.html,
    text,
    preview: toPreview(text) || "(no content)",
  }
}
