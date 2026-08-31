import { ImageResponse } from "next/og"

import { DOMAIN } from "@temp-mail/core"

export const alt = "DropMails — a free temporary email address"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          color: "#fafafa",
          fontFamily: "sans-serif",
          padding: "0 96px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.03em" }}>
          A mailbox that forgets you
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#a1a1aa" }}>
          Free temporary email — no signup, no password
        </div>
        <div
          style={{
            marginTop: 56,
            padding: "20px 40px",
            borderRadius: 20,
            background: "#18181b",
            border: "1px solid #27272a",
            fontSize: 36,
            color: "#e4e4e7",
          }}
        >
          {`yourname@${DOMAIN}`}
        </div>
      </div>
    ),
    size,
  )
}
