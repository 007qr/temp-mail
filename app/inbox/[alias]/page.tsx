import { Inbox } from "@/components/inbox"
import { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function Page({ params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params
  return <Inbox key={alias} alias={alias} />
}
