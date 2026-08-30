import * as React from "react"
import { Check, Copy, Shuffle } from "@phosphor-icons/react"
import { DOMAIN, generateAlias, sanitizeAlias } from "@temp-mail/core"

import { IconAction } from "@/components/icon-action"
import { Input } from "@/components/ui/input"

export function AddressBar({
  alias,
  address,
  onChange,
}: {
  alias: string
  address: string
  onChange: (alias: string) => void
}) {
  const [draft, setDraft] = React.useState(alias)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  function commit() {
    if (draft && draft !== alias) onChange(draft)
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <div className="flex min-w-0 flex-1 items-center overflow-hidden font-mono text-sm">
        <Input
          value={draft}
          onChange={(event) => setDraft(sanitizeAlias(event.target.value))}
          onBlur={commit}
          onKeyDown={(event) => event.key === "Enter" && commit()}
          style={{ width: `calc(${Math.max(draft.length, 1)}ch + 2px)` }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Mailbox name"
          className="h-7 max-w-full rounded-md border-0 px-0 font-mono text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
        <span className="shrink-0 truncate text-muted-foreground">@{DOMAIN}</span>
      </div>

      <IconAction label="New address" onClick={() => onChange(generateAlias())}>
        <Shuffle />
      </IconAction>
      <IconAction
        label={copied ? "Copied" : "Copy address"}
        onClick={async () => {
          await navigator.clipboard.writeText(address)
          setCopied(true)
        }}
      >
        {copied ? <Check className="text-primary" weight="bold" /> : <Copy />}
      </IconAction>
    </div>
  )
}
