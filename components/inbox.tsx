"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowsClockwise,
  Check,
  Copy,
  Envelope,
  EnvelopeOpen,
} from "@phosphor-icons/react"

import type { Mail } from "@/lib/mail"
import { DOMAIN, toAddress } from "@/lib/address"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
        {mail.text || "This message has no readable content."}
      </div>
    )
  }

  const page = `<!doctype html><meta charset="utf-8"><base target="_blank"><style>
    html{color-scheme:light}
    body{margin:0;padding:24px;background:#fff;color:#1c1917;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.65;overflow-wrap:anywhere}
    img{max-width:100%;height:auto}
    a{color:#1d4ed8}
    table{max-width:100%}
  </style>${mail.html}<script>
    const send = () => parent.postMessage({ channel: ${JSON.stringify(channel)}, height: document.documentElement.scrollHeight }, "*")
    new ResizeObserver(send).observe(document.documentElement)
    addEventListener("load", send)
    send()
  <\/script>`

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
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
  const address = toAddress(alias)
  const [mails, setMails] = React.useState<Mail[] | null>(null)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
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

  async function copy() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
  }

  return (
    <div className="flex h-svh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/" />}
          aria-label="Back"
        >
          <ArrowLeft />
        </Button>

        <div className="min-w-0">
          <div className="truncate font-mono text-sm">
            <span>{alias}</span>
            <span className="text-primary">+temp</span>
            <span className="text-muted-foreground">@{DOMAIN}</span>
          </div>
        </div>

        <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy address">
          {copied ? <Check className="text-primary" weight="bold" /> : <Copy />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={refresh}
          disabled={refreshing}
        >
          <ArrowsClockwise className={cn(refreshing && "animate-spin")} />
          Refresh
        </Button>
      </header>

      <Separator />

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[340px] shrink-0 flex-col border-r border-border">
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
                  onClick={() => setSelectedId(mail.id)}
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

        <section className="flex min-w-0 flex-1 flex-col">
          {selected ? (
            <>
              <div className="flex shrink-0 items-start gap-3 px-6 py-5">
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

              <ScrollArea className="min-h-0 flex-1">
                <div className="max-w-3xl px-6 py-5">
                  <Body key={selected.id} mail={selected} />
                </div>
              </ScrollArea>
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
