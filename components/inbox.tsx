"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowsClockwise,
  Check,
  Copy,
  Envelope,
  EnvelopeOpen,
} from "@phosphor-icons/react"

import { DOMAIN, sanitizeAlias, toAddress, type Mail } from "@temp-mail/core"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconAction } from "@/components/icon-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

function timeLabel(value: number) {
  const date = new Date(value)
  const today = new Date().toDateString() === date.toDateString()
  return date.toLocaleString(undefined,
    today
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric" }
  )
}

function fullTimeLabel(value: number) {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const DESIGNED = /<(table|img|style|font)\b|style="[^"]*(background|font-family)/i

function Body({ mail }: { mail: Mail }) {
  const channel = React.useId()
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.channel === channel && typeof event.data.height === "number") {
        setHeight(Math.ceil(event.data.height))
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [channel])

  if (!mail.html || !DESIGNED.test(mail.html)) {
    return (
      <div className="overflow-hidden text-[15px] leading-relaxed break-words whitespace-pre-wrap">
        {mail.text || "This message has no readable content."}
      </div>
    )
  }

  const page = `<!doctype html><meta charset="utf-8"><base target="_blank"><style>
    html{color-scheme:light;overflow:hidden}
    body{margin:0;padding:24px;background:#fff;color:#1c1917;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.65;overflow-wrap:anywhere;overflow-x:hidden}
    *{max-width:100%}
    img{height:auto}
    a{color:#1d4ed8}
    table{table-layout:fixed;width:100%}
    @media (max-width:640px){body{padding:16px}}
  </style>${mail.html}<script>
    const send = () => parent.postMessage({ channel: ${JSON.stringify(channel)}, height: document.documentElement.scrollHeight }, "*")
    new ResizeObserver(send).observe(document.body)
    addEventListener("load", send)
    send()
  <\/script>`

  return (
    <div className="w-full max-w-full overflow-hidden bg-white">
      <iframe
        sandbox="allow-scripts"
        title={mail.subject}
        srcDoc={page}
        style={{ height: height || 200 }}
        className="block w-full"
      />
    </div>
  )
}

export function Inbox({ alias }: { alias: string }) {
  const router = useRouter()
  const address = toAddress(alias)
  const [draft, setDraft] = React.useState(alias)
  const [mails, setMails] = React.useState<Mail[] | null>(null)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [reading, setReading] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/inbox/${encodeURIComponent(alias)}`)
      setMails(response.ok ? await response.json() : [])
    } catch {
      setMails([])
    }
  }, [alias])

  React.useEffect(() => {
    const timer = setInterval(load, 10000)
    queueMicrotask(load)
    return () => clearInterval(timer)
  }, [load])

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const selected = mails?.find((mail) => mail.id === selectedId) ?? mails?.[0] ?? null

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  function commitAlias() {
    if (draft && draft !== alias) router.push(`/inbox/${draft}`)
  }

  async function copy() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
  }

  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center bg-background px-4">
        {reading && (
          <div className="flex min-w-0 flex-1 items-center gap-3 md:hidden">
            <IconAction label="Back to inbox" onClick={() => setReading(false)}>
              <ArrowLeft />
            </IconAction>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {selected?.subject}
            </span>
          </div>
        )}

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3",
            reading && "hidden md:flex"
          )}
        >
          <IconAction
            label="Back to generator"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft />
          </IconAction>

          <div className="flex min-w-0 items-center overflow-hidden font-mono text-sm">
            <Input
              value={draft}
              onChange={(event) => setDraft(sanitizeAlias(event.target.value))}
              onBlur={commitAlias}
              onKeyDown={(event) => event.key === "Enter" && commitAlias()}
              style={{ width: `calc(${Math.max(draft.length, 1)}ch + 2px)` }}
              spellCheck={false}
              autoComplete="off"
              aria-label="Mailbox name"
              title="Edit mailbox name"
              className="h-7 max-w-full rounded-md border-0 px-0 font-mono text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
            />
            <span className="shrink-0 text-primary">+temp</span>
            <span className="shrink-0 truncate text-muted-foreground">@{DOMAIN}</span>
          </div>

          <IconAction label={copied ? "Copied" : "Copy address"} onClick={copy}>
            {copied ? <Check className="text-primary" weight="bold" /> : <Copy />}
          </IconAction>

          <IconAction
            label="Refresh inbox"
            className="ml-auto md:hidden"
            onClick={refresh}
            disabled={refreshing}
          >
            <ArrowsClockwise className={cn(refreshing && "animate-spin")} />
          </IconAction>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden md:inline-flex"
            onClick={refresh}
            disabled={refreshing}
          >
            <ArrowsClockwise className={cn(refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <Separator />

      <div className="flex flex-1">
        <aside
          className={cn(
            "sticky top-14 h-[calc(100svh-3.5rem)] w-full shrink-0 flex-col border-border md:flex md:w-[340px] md:border-r",
            reading ? "hidden" : "flex"
          )}
        >
          <div className="flex h-11 shrink-0 items-center justify-between px-4 text-xs font-medium text-muted-foreground">
            <span>Inbox</span>
            <span>{mails?.length ?? 0}</span>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-0.5 px-2 pb-3">
              {mails === null &&
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3.5 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}

              {mails?.length === 0 && (
                <div className="mt-16 flex flex-col items-center gap-2 px-6 text-center">
                  <Envelope className="size-7 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Nothing yet</p>
                  <p className="text-xs text-muted-foreground">
                    Mail sent to this address shows up here within seconds.
                  </p>
                </div>
              )}

              {mails?.map((mail) => (
                <button
                  key={mail.id}
                  onClick={() => {
                    setSelectedId(mail.id)
                    setReading(true)
                  }}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors",
                    mail.id === selected?.id
                      ? "bg-muted"
                      : "hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {mail.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {timeLabel(mail.receivedAt)}
                    </span>
                  </div>
                  <span className="truncate text-[13px]">{mail.subject}</span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {mail.preview}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 flex-col md:flex",
            reading ? "flex" : "hidden"
          )}
        >
          {selected ? (
            <>
              <div className="flex shrink-0 items-start gap-3 px-4 py-4 md:px-6 md:py-5">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs font-medium uppercase">
                    {selected.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h1 className="font-heading text-lg leading-tight font-semibold text-balance">
                    {selected.subject}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{selected.name}</span>
                    <span className="truncate">{selected.address}</span>
                    <span>·</span>
                    <span>{fullTimeLabel(selected.receivedAt)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="w-full max-w-full flex-1">
                <Body key={selected.id} mail={selected} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <EnvelopeOpen className="size-9 text-muted-foreground/40" />
              <p className="text-sm font-medium">No message selected</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Pick a message from the list to read it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
