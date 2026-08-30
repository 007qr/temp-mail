import { toAddress } from "@temp-mail/core"

import { fetchInbox, readMailbox } from "@/lib/mailbox"

const ALARM = "poll"
const MENU = "fill-temp-address"

function fillFocusedField(address: string) {
  const element = document.activeElement

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const prototype =
      element instanceof HTMLInputElement
        ? HTMLInputElement.prototype
        : HTMLTextAreaElement.prototype

    Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, address)
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    return
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    element.textContent = address
    element.dispatchEvent(new Event("input", { bubbles: true }))
  }
}

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

  await chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
      ...(info.frameId === undefined ? {} : { frameIds: [info.frameId] }),
    },
    func: fillFocusedField,
    args: [toAddress(alias)],
  })
})

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "refresh") refreshBadge()
})
