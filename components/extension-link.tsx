import { GoogleChromeLogo } from "@phosphor-icons/react/ssr"

import { buttonVariants } from "@/components/ui/button"
import { EXTENSION_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export function ExtensionLink({ className }: { className?: string }) {
  return (
    <a
      href={EXTENSION_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Get the DropMails Chrome extension"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <GoogleChromeLogo data-icon="inline-start" />
      <span className="hidden sm:inline">Chrome extension</span>
    </a>
  )
}
