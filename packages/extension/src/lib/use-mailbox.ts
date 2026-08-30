import * as React from "react"
import { toAddress, type Mail } from "@temp-mail/core"

import { fetchInbox, readMailbox, setAlias as persistAlias } from "@/lib/mailbox"

export function useMailbox() {
  const [alias, setAliasState] = React.useState<string | null>(null)
  const [mails, setMails] = React.useState<Mail[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState(false)

  const load = React.useCallback(async (target: string) => {
    try {
      const next = await fetchInbox(target)
      setMails(next)
      setError(null)
    } catch (cause) {
      setMails([])
      setError(cause instanceof Error ? cause.message : "Something went wrong")
    }
  }, [])

  React.useEffect(() => {
    let active = true

    readMailbox().then(({ alias: stored }) => {
      if (!active) return
      setAliasState(stored)
      load(stored)
    })

    return () => {
      active = false
    }
  }, [load])

  React.useEffect(() => {
    if (!alias) return
    const timer = setInterval(() => load(alias), 15000)
    return () => clearInterval(timer)
  }, [alias, load])

  async function changeAlias(next: string) {
    setAliasState(next)
    setMails(null)
    await persistAlias(next)
    await load(next)
  }

  async function refresh() {
    if (!alias) return
    setRefreshing(true)
    await load(alias)
    setRefreshing(false)
  }

  return {
    alias,
    address: alias ? toAddress(alias) : "",
    mails,
    error,
    refreshing,
    changeAlias,
    refresh,
  }
}
