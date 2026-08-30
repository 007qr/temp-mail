# Chrome Web Store listing

Category: Productivity / Workflow & Planning
Language: English (United States)

## Short description (132 char max)

Disposable email addresses on 007qr.dev. Drop one into any signup form from the right-click menu, then read what lands.

## Detailed description

Temp Mail gives you a throwaway email address and shows you the messages it receives.

Open the toolbar popup and you get an address ending in +temp@007qr.dev. Keep the one
it generates, or type your own prefix. The address is remembered between sessions, so
the same inbox is waiting the next time you open the popup.

To use it, right-click any email field on a signup form and choose "Fill with temp
address". The address drops straight into the field.

Messages arrive in the popup within seconds. Open one to read it, or use the expanded
tab view for a wider two-pane layout.

No account. No password. No tracking.

## Single purpose

Temp Mail provides disposable email addresses on the 007qr.dev domain and displays the
messages those addresses receive, so that users can sign up for services without
exposing a personal inbox.

## Permission justifications

### storage
Stores one value via chrome.storage.local: the name of the user's current disposable
mailbox. This is what keeps the same mailbox available the next time the popup is
opened. Nothing else is stored and nothing is sent anywhere.

### contextMenus
Adds one item, "Fill with temp address", to the right-click menu on editable fields.
This is the primary way users insert a disposable address into a signup form.

### activeTab
When the user clicks our context menu item on an editable field, activeTab grants
temporary access to that single tab so the disposable address can be inserted into the
field. Access is granted only by that explicit user action, applies only to that tab,
and ends immediately. The extension holds no standing access to any website.

### scripting
Used together with activeTab to run one short function in the active tab at the moment
the user clicks "Fill with temp address". The function sets the value of the focused
input and dispatches input and change events so the page's form registers the value.
No script is injected at any other time and no script is injected on page load.

### Host permission (https://temp-mail.ayp.workers.dev/*)
This is the extension's own backend. It is contacted to fetch the messages delivered to
the user's disposable mailbox. It is the only network destination the extension
contacts.

### Remote code
The extension does not execute remote code. All JavaScript is bundled in the package.
Message bodies fetched from the mailbox are email HTML, which is displayed inside a
sandboxed iframe that has a null origin and no access to extension APIs. That content is
inserted with innerHTML, which does not execute script elements. No code is fetched,
evaluated, or run from any remote source.

## Data usage disclosures

Collected: none.
The extension does not collect, transmit, or sell user data. The mailbox name is the
only value stored, and it is stored locally on the device. Messages are fetched for
display and are not retained by the extension.
