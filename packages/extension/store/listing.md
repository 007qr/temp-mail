# Chrome Web Store listing

Category: Productivity / Workflow & Planning
Language: English (United States)

## Short description (132 char max)

Disposable email addresses on dropmails.org. Drop one into any signup form from the right-click menu, then read what lands.

## Detailed description

DropMails gives you a throwaway email address and shows you the messages it receives.

Open the toolbar popup and you get an address ending in @dropmails.org. Keep the one
it generates, or type your own prefix. The address is remembered between sessions, so
the same inbox is waiting the next time you open the popup.

To use it, right-click any email field on a signup form and choose "Fill with temp
address". The address drops straight into the field.

Messages arrive in the popup within seconds. Open one to read it, or use the expanded
tab view for a wider two-pane layout.

No account. No password. No tracking.

## Single purpose

DropMails provides disposable email addresses on the dropmails.org domain and displays the
messages those addresses receive, so that users can sign up for services without
exposing a personal inbox.

## Permission justifications

### storage

DropMails stores exactly one value via chrome.storage.local: the alias of the user's
current disposable mailbox (for example "k3p9w2xq"). This is what keeps the same inbox
available the next time the popup is opened, instead of generating a new address on
every click. It is written when the user first opens the popup and whenever they edit
the address, and it is read when the popup, the tab view, or the context menu action
needs to know which mailbox to use. Nothing else is stored, the value never leaves the
device, and no other storage area is used.

### contextMenus

The extension registers a single context menu item, "Fill with temp address", with
contexts: ["editable"], so it appears only when the user right-clicks a text input,
textarea, or contenteditable field. Choosing it inserts the user's disposable address
into that field. This is the extension's primary workflow — getting a throwaway address
into a signup form without copying and pasting — and a context menu item is the only way
to offer it from the page itself. No other menu items are added.

### activeTab

activeTab is what grants access to the page when the user clicks the "Fill with temp
address" context menu item. Chrome grants activeTab on that explicit user gesture; the
extension then has access to that single tab, only for that action, and the access ends
immediately afterwards. This is what lets the extension avoid requesting standing host
permissions for every website, which it neither declares nor wants. Without activeTab
the scripting call described below could not run.

### scripting

Used together with activeTab to run one function at one moment. When the user clicks
"Fill with temp address", chrome.scripting.executeScript injects a short function into
the tab, and the specific frame, that was right-clicked. That function sets the value of
the focused input, textarea, or contenteditable element to the user's disposable address
and dispatches input and change events so the page's form registers the value. No script
is injected on page load, none is injected into tabs the user has not acted on, and the
manifest declares no content scripts.

### Host permission (https://temp-mail.ayp.workers.dev/*)

This is the extension's own backend and the only network destination it contacts. The
popup and the tab view fetch the messages delivered to the user's disposable mailbox
from https://temp-mail.ayp.workers.dev/api/inbox/<alias>. The host permission is what
allows that cross-origin request from the extension's own pages. Only the mailbox alias
is sent; no user identifiers, browsing history, or page content are transmitted. No
other host is contacted.

### Remote code

The extension does not execute remote code. All JavaScript is bundled in the package.
Message bodies fetched from the mailbox are email HTML, which is displayed inside a
sandboxed iframe with a null origin and no access to extension APIs. That content is
inserted with innerHTML, which does not execute script elements. No code is fetched,
evaluated, or run from any remote source.

## Data usage disclosures

Collected: none.
The extension does not collect, transmit, or sell user data. The mailbox name is the
only value stored, and it is stored locally on the device. Messages are fetched for
display and are not retained by the extension.
