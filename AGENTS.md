<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Keep storefront pages as top-level TanStack routes with shared shopping chrome in the root; this preserves crawlable public catalogue URLs.
- Catalogue data comes from Cloud through server functions, with bundled images keyed by catalogue records; no fallback mock catalogue is substituted on read failure.
- Customer private records use owner-scoped RLS and staff roles live in a separate protected table; this prevents customer data leakage and privilege escalation.
- COD final amounts and order creation use database-authoritative shipping, tax, coupon and stock checks; online payments remain disabled and collection requires staff evidence.
- Guest preview state stays in memory while signed-in cart and wishlist records use Cloud; this avoids presenting transient guest state as durable storage.
- Dehydrate the per-request Query cache through Router SSR hooks and hydrate it before client rendering; catalogue markup must match across server and browser.
- Reserve stock and capture verified payments in database transactions with locked order rows; never split inventory and payment state changes across independent requests.
- Payment-linked reservations require provider reconciliation before release; a timeout alone cannot safely release stock while an external payment may still succeed.
- Staff mutations validate inputs and database roles; audit triggers and controlled RPCs record operational changes without granting customer status-write access.
- Uploaded product media lives in a private bucket; the public catalogue authorizes paths before server-only signing, and catalogue queries refresh before URL expiry. Only catalogue staff may create or remove media.
- Supplier tasks are allocated transactionally with COD orders and advanced by controlled staff RPCs; never submit external supplier orders without a tested adapter.
- Customer account deletion scrubs personal records and deactivates Auth only after active commerce obligations are resolved; financial order history remains anonymized.
- Order PDFs are owner-authorized receipts until seller tax registration and invoice requirements are verified; never label unverified documents as GST tax invoices.

- Supplier operational reporting derives task counts from authorized staff data and labels its sample window; it does not imply revenue or profit.
- Shopping motion uses a shared progressive-enhancement observer and CSS transitions; content remains visible without JavaScript and reduced-motion preferences disable effects.
- The shared sticky bag derives its item count and indicative subtotal from the existing cart; checkout remains authoritative and mobile placement clears bottom navigation.
- Size/colour options are independently purchasable product SKUs grouped by family; cart, order snapshots and existing transaction locks continue using product IDs so stock and refunds remain SKU-specific.
- Restock subscriptions are owner-scoped and database transitions create one in-app notification per subscription; no email or WhatsApp delivery is implied.
- Public support contact settings are writable only by owner/admin roles; unset contact numbers never generate fabricated WhatsApp links.
- Delivery serviceability comes only from owner-imported, validated PIN rules; checkout quotes require an active COD-enabled rule, so no rule means no orders.
- Account deletion blocked by active obligations is recorded as a deletion request and completed after settlement, so retention is never indefinite.
- Android packaging is a Capacitor project (android/) loading the live HTTPS site with a local offline page as webDir, because the build emits no static index.html and pages need SSR/server functions.
