import * as React from "react"

import type { Mail } from "@temp-mail/core"

const DESIGNED = /<(table|img|style|font)\b|style="[^"]*(background|font-family)/i

export function MailBody({ mail }: { mail: Mail }) {
  const frame = React.useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = React.useState(200)
  const designed = Boolean(mail.html && DESIGNED.test(mail.html))

  React.useEffect(() => {
    if (!designed) return

    function onMessage(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow) return
      if (event.data?.type === "height") setHeight(Math.ceil(event.data.height))
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [designed])

  if (!designed) {
    return (
      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
        {mail.text || "This message has no readable content."}
      </div>
    )
  }

  return (
    <div className="w-full max-w-full bg-white">
      <iframe
        ref={frame}
        src="sandbox.html"
        title={mail.subject}
        style={{ height }}
        className="block w-full"
        onLoad={() =>
          frame.current?.contentWindow?.postMessage({ type: "render", html: mail.html }, "*")
        }
      />
    </div>
  )
}
