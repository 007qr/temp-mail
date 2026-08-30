let lastEditable: HTMLElement | null = null

document.addEventListener(
  "contextmenu",
  (event) => {
    const target = event.target
    if (target instanceof HTMLElement) lastEditable = target
  },
  true
)

function fill(element: HTMLElement, value: string) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const prototype =
      element instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype
    Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value)
    element.dispatchEvent(new Event("input", { bubbles: true }))
    element.dispatchEvent(new Event("change", { bubbles: true }))
    return
  }

  if (element.isContentEditable) {
    element.textContent = value
    element.dispatchEvent(new Event("input", { bubbles: true }))
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "fill") return

  const target =
    lastEditable ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)

  if (target) {
    target.focus()
    fill(target, message.address)
  }
})
