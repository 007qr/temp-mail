import * as React from "react"
import { createRoot } from "react-dom/client"
import { ArrowLeft, ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react"
import type { Mail } from "@temp-mail/core"

import "./globals.css"

import { AddressBar } from "@/components/address-bar"
import { IconAction } from "@/components/icon-action"
import { MailBody } from "@/components/mail-body"
import { MailList } from "@/components/mail-list"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fullTimeLabel } from "@/lib/format"
import { useMailbox } from "@/lib/use-mailbox"
import { cn } from "@/lib/utils"

function Popup() {
  const { alias, address, mails, error, refreshing, changeAlias, refresh } = useMailbox()
  const [reading, setReading] = React.useState<Mail | null>(null)

  return (
    <TooltipProvider>
    <div className="flex h-[600px] w-[420px] flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-1 px-2">
        {reading ? (
          <>
            <IconAction label="Back to inbox" onClick={() => setReading(null)}>
              <ArrowLeft />
            </IconAction>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{reading.subject}</span>
          </>
        ) : (
          alias && <AddressBar key={alias} alias={alias} address={address} onChange={changeAlias} />
        )}

        {!reading && (
          <IconAction label="Refresh inbox" onClick={refresh} disabled={refreshing}>
            <ArrowsClockwise className={cn(refreshing && "animate-spin")} />
          </IconAction>
        )}
        <IconAction
          label="Open in tab"
          onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("tab.html") })}
        >
          <ArrowSquareOut />
        </IconAction>
      </header>

      <Separator />

      {error && (
        <div className="px-4 py-2 text-xs text-destructive">{error}</div>
      )}

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {reading ? (
          <div className="flex flex-col">
            <div className="px-4 py-3">
              <div className="text-sm font-medium">{reading.name}</div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{reading.address}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {fullTimeLabel(reading.receivedAt)}
              </div>
            </div>
            <Separator />
            <MailBody mail={reading} />
          </div>
        ) : (
          <MailList mails={mails} selectedId={null} onSelect={setReading} />
        )}
      </div>
    </div>
    </TooltipProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
