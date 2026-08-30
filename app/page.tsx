import { AddressPicker } from "@/components/address-picker"
import { generateAlias } from "@/lib/address"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6">
      <AddressPicker initialAlias={generateAlias()} />
    </main>
  )
}
