import { Inbox } from "@/components/inbox"

export default async function Page({ params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params
  return <Inbox alias={alias} />
}
