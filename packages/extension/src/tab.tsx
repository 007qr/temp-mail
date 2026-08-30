import * as React from "react"
import { createRoot } from "react-dom/client"
import { ArrowsClockwise, EnvelopeOpen } from "@phosphor-icons/react"

import "./globals.css"

import { AddressBar } from "@/components/address-bar"
import { MailBody } from "@/components/mail-body"
import { MailList } from "@/components/mail-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fullTimeLabel } from "@/lib/format"
import { useMailbox } from "@/lib/use-mailbox"
import { cn } from "@/lib/utils"

function Tab() {
  const { alias, address, mails, error, refreshing, changeAlias, refresh } = useMailbox()
  const [selectedId, setSelectedId] = React.useState<number | null>(null)

  const selected = mails?.find((mail) => mail.id === selectedId) ?? mails?.[0] ?? null

  return (
    <TooltipProvider>
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 bg-background px-4">
        {alias && <AddressBar key={alias} alias={alias} address={address} onChange={changeAlias} />}

        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
          <ArrowsClockwise className={cn(refreshing && "animate-spin")} />
          Refresh
        </Button>
      </header>

      <Separator />

      <div className="flex flex-1">
        <aside className="sticky top-14 flex h-[calc(100svh-3.5rem)] w-[340px] shrink-0 flex-col border-r border-border">
          <div className="flex h-11 shrink-0 items-center justify-between px-4 text-xs font-medium text-muted-foreground">
            <span>Inbox</span>
            <span>{mails?.length ?? 0}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <MailList
              mails={mails}
              selectedId={selected?.id ?? null}
              onSelect={(mail) => setSelectedId(mail.id)}
            />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          {error && <div className="px-6 py-3 text-xs text-destructive">{error}</div>}

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

              <div className="w-full max-w-full flex-1">
                <MailBody key={selected.id} mail={selected} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <EnvelopeOpen className="size-9 text-muted-foreground/40" />
              <p className="text-sm font-medium">No message selected</p>
            </div>
          )}
        </section>
      </div>
    </div>
    </TooltipProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tab />
  </React.StrictMode>
)
