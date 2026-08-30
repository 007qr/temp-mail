import type { Mail } from "@temp-mail/core"

import { timeLabel } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function MailList({
  mails,
  selectedId,
  onSelect,
}: {
  mails: Mail[] | null
  selectedId: number | null
  onSelect: (mail: Mail) => void
}) {
  if (mails === null) {
    return (
      <div className="flex flex-col gap-0.5 px-2 pb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2 p-3">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (mails.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-2 px-6 text-center">
        <p className="text-sm font-medium">Nothing yet</p>
        <p className="text-xs text-muted-foreground">
          Mail sent to this address shows up here within a minute.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5 px-2 pb-3">
      {mails.map((mail) => (
        <button
          key={mail.id}
          onClick={() => onSelect(mail)}
          className={cn(
            "flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors",
            mail.id === selectedId ? "bg-muted" : "hover:bg-muted/60"
          )}
        >
          <div className="flex items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{mail.name}</span>
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
  )
}
