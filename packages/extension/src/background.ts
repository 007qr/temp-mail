import { toAddress } from "@temp-mail/core"

import { fetchInbox, readMailbox } from "@/lib/mailbox"

const ALARM = "poll"
const MENU = "fill-temp-address"

async function refreshBadge() {
  try {
    const { alias, seen } = await readMailbox()
    const mails = await fetchInbox(alias)
    const unread = mails.filter((mail) => !seen.includes(mail.id)).length

    await chrome.action.setBadgeText({ text: unread ? String(unread) : "" })
    await chrome.action.setBadgeBackgroundColor({ color: "#84cc16" })
  } catch {
    await chrome.action.setBadgeText({ text: "" })
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 1 })
  chrome.contextMenus.create({
    id: MENU,
    title: "Fill with temp address",
    contexts: ["editable"],
  })
  refreshBadge()
})

chrome.runtime.onStartup.addListener(refreshBadge)

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) refreshBadge()
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU || !tab?.id) return

  const { alias } = await readMailbox()
  chrome.tabs.sendMessage(
    tab.id,
    { type: "fill", address: toAddress(alias) },
    { frameId: info.frameId }
  )
})

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "refresh") refreshBadge()
})
