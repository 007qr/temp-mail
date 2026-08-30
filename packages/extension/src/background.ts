import { toAddress } from "@temp-mail/core"

import { readMailbox } from "@/lib/mailbox"

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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU,
    title: "Fill with temp address",
    contexts: ["editable"],
  })
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
