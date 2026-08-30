"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Copy, Shuffle } from "@phosphor-icons/react"

import { DOMAIN, generateAlias, sanitizeAlias, toAddress } from "@temp-mail/core"
import { IconAction } from "@/components/icon-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AddressPicker({ initialAlias }: { initialAlias: string }) {
  const router = useRouter()
  const [alias, setAlias] = React.useState(initialAlias)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  function open() {
    if (alias) router.push(`/inbox/${alias}`)
  }

  async function copy() {
    if (!alias) return
    await navigator.clipboard.writeText(toAddress(alias))
    setCopied(true)
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        A mailbox that forgets you
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground text-balance">
        Pick a name or take the one we rolled for you, then read whatever lands.
      </p>

      <div className="mt-10 w-full rounded-2xl bg-card p-2 ring-1 ring-foreground/10">
        <div className="flex items-center gap-1 rounded-xl bg-muted/60 py-2 pr-2 pl-3 ring-1 ring-transparent transition-shadow focus-within:ring-ring/50">
          <div className="flex min-w-0 flex-1 items-center overflow-x-auto font-mono text-sm">
            <Input
              value={alias}
              onChange={(event) => setAlias(sanitizeAlias(event.target.value))}
              onKeyDown={(event) => event.key === "Enter" && open()}
              style={{ width: `calc(${Math.max(alias.length, 1)}ch + 2px)` }}
              spellCheck={false}
              autoComplete="off"
              aria-label="Mailbox name"
              className="h-7 rounded-md border-0 px-0 font-mono text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
            />
            <span className="shrink-0 text-primary">+temp</span>
            <span className="shrink-0 text-muted-foreground">@{DOMAIN}</span>
          </div>

          <IconAction label="New address" onClick={() => setAlias(generateAlias())}>
            <Shuffle />
          </IconAction>
          <IconAction
            label={copied ? "Copied" : "Copy address"}
            onClick={copy}
            disabled={!alias}
          >
            {copied ? <Check className="text-primary" weight="bold" /> : <Copy />}
          </IconAction>
        </div>
      </div>

      <Button size="lg" className="mt-4 h-11 w-full text-sm" disabled={!alias} onClick={open}>
        Open inbox
        <ArrowRight data-icon="inline-end" weight="bold" />
      </Button>
    </div>
  )
}
