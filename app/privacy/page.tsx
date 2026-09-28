import type { Metadata } from "next"
import Link from "next/link"

import { DOMAIN } from "@temp-mail/core"
import { ExtensionLink } from "@/components/extension-link"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const UPDATED = "September 27, 2026"
const CONTACT = `ayush@007qr.dev`

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data on ${DOMAIN} and in the DropMails browser extension: what is collected, how long it is kept, and who it is shared with.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    url: `${SITE_URL}/privacy`,
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `What ${SITE_NAME} collects, how long it is kept, and who it is shared with.`,
  },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 text-[15px] leading-relaxed">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          &larr; {DOMAIN}
        </Link>
        <ExtensionLink className="-mr-2.5" />
      </div>

      <h1 className="font-heading mt-8 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground mt-2 text-sm">Last updated: {UPDATED}</p>

      <p className="mt-8">
        This policy covers the {SITE_NAME} website at {DOMAIN} and the {SITE_NAME} browser
        extension. Both are operated by the same individual developer. They share one purpose:
        giving you a disposable email address and showing you the messages it receives, so you can
        sign up for things without handing over a personal inbox.
      </p>
      <p>
        There are no accounts, no passwords, no analytics, no cookies, no advertising and no
        tracking of any kind. The sections below describe exactly what does happen.
      </p>

      <Section title="The short version">
        <ul className="list-disc space-y-2 pl-5">
          <li>We store the messages sent to your disposable address so we can show them to you.</li>
          <li>Those messages are permanently deleted 7 days after they arrive.</li>
          <li>
            Your mailbox name is stored on your own device. We never ask for your name, your real
            email address or any other detail about you.
          </li>
          <li>We do not sell, rent or transfer your data to anyone.</li>
          <li>
            A disposable mailbox is <strong>not private</strong>. Anyone who knows or guesses the
            name can read it.
          </li>
        </ul>
      </Section>

      <Section title="Mailboxes are public by design">
        <p>
          A {SITE_NAME} mailbox is protected by nothing but its name. There is no password and no
          login, which is what makes it instant to use, and it means{" "}
          <strong>
            any person who knows or guesses your mailbox name can read every message in it
          </strong>
          . Short or predictable names are especially easy to guess.
        </p>
        <p>
          Treat every message that arrives as public. Do not use {SITE_NAME} for password resets,
          banking, medical or government correspondence, work or confidential material, or anything
          else you would mind a stranger reading. Use a real mailbox for those.
        </p>
      </Section>

      <Section title="What we collect">
        <p className="font-medium">Messages sent to your disposable address</p>
        <p>
          When an email arrives at an address ending in @{DOMAIN}, we store the mailbox name it was
          sent to, the sender address, the subject line, the full message content and the time it
          arrived. This is the service: we cannot show you your mail without holding it. Anything a
          sender chooses to put in a message is stored along with it, so what ends up in our
          database is determined by whoever writes to you, not by us.
        </p>

        <p className="mt-4 font-medium">Your mailbox name</p>
        <p>
          The website keeps your mailbox name in the page address. The extension saves a single
          value on your device using the browser storage API: the name of your current mailbox, for
          example <code className="font-mono text-[13px]">k3p9w2xq</code>. That is what lets the
          same inbox be waiting the next time you open it, instead of a new one each time. The name
          is sent to our server each time we fetch your mail, because it is how the server knows
          which mailbox to return. Nothing else is stored on your device, and no other storage is
          used.
        </p>

        <p className="mt-4 font-medium">IP address, for abuse protection only</p>
        <p>
          Our server limits how many times a single internet connection can request mail each
          minute, which stops the service being scraped or overwhelmed. Doing that requires
          recognising your connection, so your IP address is passed to our hosting provider&rsquo;s
          rate limiter as it happens. We do not write your IP address into our database and we do
          not use it to build a profile of you or link it to a mailbox.
        </p>

        <p className="mt-4 font-medium">Standard server logs</p>
        <p>
          Our hosting provider records ordinary request logs for reliability, security and
          debugging, in the way any web server does. We use these only to keep the service running
          and to investigate abuse.
        </p>
      </Section>

      <Section title="What we do not collect">
        <p>
          We never ask for and never collect your name, your real email address, your phone number,
          your location, payment details or any account credentials. We do not use cookies, we do
          not run analytics or advertising scripts, and we do not fingerprint your device.
        </p>
        <p>
          The extension in particular does not collect your browsing history, the addresses of pages
          you visit, the contents of pages you visit, anything you type, or any data from any form.
          It registers one right-click menu item, &ldquo;Fill with temp address&rdquo;, which appears
          only on editable fields. When you choose it, the extension writes your disposable address
          into the field you right-clicked, in that tab only, at that moment only. It reads nothing
          back from the page, runs no code when pages load, and contacts no website other than our
          own mail server.
        </p>
      </Section>

      <Section title="How your data is used">
        <p>
          Stored messages are used for exactly one thing: displaying them back to you in the inbox
          you opened. Your mailbox name is used to route and retrieve the right mail. IP addresses
          and server logs are used only to rate limit, secure, debug and keep the service available.
        </p>
        <p>
          We do not use any of it for advertising or personalised advertising, we do not use it to
          assess creditworthiness or for lending purposes, and we do not use it to build profiles of
          users. No human at {SITE_NAME} reads your messages as a matter of course; we would access
          message content only where necessary to investigate abuse or a security problem, or where
          the law requires it.
        </p>
      </Section>

      <Section title="Who your data is shared with">
        <p>
          We do not sell, rent, trade or transfer your data to any third party for their own
          purposes, and we do not share it with data brokers, advertising networks or information
          resellers.
        </p>
        <p>
          One infrastructure provider processes data on our behalf, because the service runs on
          them:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Cloudflare, Inc.</strong> &mdash; receives the incoming email for @{DOMAIN},
            hosts our server and database, applies the rate limiting described above, and keeps the
            request logs. See the{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4"
            >
              Cloudflare Privacy Policy
            </a>
            .
          </li>
        </ul>
        <p>
          Beyond that, we may disclose information if we are legally required to, or where it is
          necessary to protect the service against fraud, abuse, spam or security threats.
        </p>
      </Section>

      <Section title="How long we keep things">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Messages: 7 days.</strong> An automated job runs every hour and permanently
            deletes every message older than 168 hours from our database. This happens whether or
            not you ever opened them.
          </li>
          <li>
            <strong>In the inbox view: the 50 most recent messages</strong> for a mailbox are shown.
          </li>
          <li>
            <strong>Your mailbox name:</strong> kept on your own device until you change it, clear
            your browser data, or uninstall the extension. Removing the extension removes it.
          </li>
          <li>
            <strong>Rate limiting data:</strong> transient, and expires within minutes.
          </li>
          <li>
            <strong>Server logs:</strong> kept briefly by our hosting provider under their retention
            schedule, then discarded.
          </li>
        </ul>
      </Section>

      <Section title="Your choices">
        <p>
          You can switch to a different mailbox at any time by typing a new name, which immediately
          stops you using the old one. You can clear the stored mailbox name by uninstalling the
          extension or clearing your browser data. Every message deletes itself within 7 days
          without you doing anything.
        </p>
        <p>
          If you want a specific mailbox or message deleted sooner, email us at{" "}
          <a href={`mailto:${CONTACT}`} className="underline underline-offset-4">
            {CONTACT}
          </a>{" "}
          with the mailbox name and we will remove it. Because mailboxes are not tied to any
          identity, we cannot verify who owns one, and anyone can ask for any mailbox to be cleared.
        </p>
      </Section>

      <Section title="Security">
        <p>
          All traffic between your browser and our server uses HTTPS. Message content is rendered
          inside a sandboxed frame with no access to the extension or to your browser, and remote
          scripts in email are not executed. The extension ships all of its code in the package and
          downloads no code at runtime.
        </p>
        <p>
          That said, please re-read &ldquo;Mailboxes are public by design&rdquo; above. The main
          risk to your data here is not interception; it is that a disposable mailbox has no lock on
          it.
        </p>
      </Section>

      <Section title="Children">
        <p>
          {SITE_NAME} is not directed at children under 13, and we do not knowingly collect personal
          information from them.
        </p>
      </Section>

      <Section title="Chrome Web Store Limited Use disclosure">
        <p>
          Our collection and use of information received from the {SITE_NAME} extension adheres to
          the{" "}
          <a
            href="https://developer.chrome.com/docs/webstore/program-policies/limited-use"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4"
          >
            Chrome Web Store User Data Policy
          </a>
          , including the Limited Use requirements. Specifically:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            We limit our use of the data to providing and improving the extension&rsquo;s single
            purpose, which is providing disposable email addresses and displaying the messages they
            receive.
          </li>
          <li>
            We do not transfer the data to third parties, except as necessary to provide or improve
            that single purpose, to comply with applicable law, or to protect against malware, spam,
            phishing, fraud or abuse.
          </li>
          <li>
            We do not use or transfer the data for serving advertisements, including personalised or
            retargeted advertising.
          </li>
          <li>
            We do not sell the data, and we do not transfer it to data brokers or other information
            resellers.
          </li>
          <li>
            We do not use or transfer the data to determine creditworthiness or for lending
            purposes.
          </li>
          <li>
            We do not allow humans to read the data, except with your explicit consent for specific
            messages, where necessary for security purposes such as investigating abuse, where the
            data has been aggregated and anonymised, or to comply with applicable law.
          </li>
        </ul>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If our data practices change, we will update this page and move the date at the top. The
          current version is always available at{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            {DOMAIN}/privacy
          </Link>
          .
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy, or about data in a particular mailbox, can go to{" "}
          <a href={`mailto:${CONTACT}`} className="underline underline-offset-4">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </main>
  )
}
