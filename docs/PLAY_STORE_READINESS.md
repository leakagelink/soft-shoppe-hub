# Nanhaa — Google Play readiness audit (11 Oct 2026)

App: Nanhaa · Domain: https://nanhaa.store · Support: hello@nanhaa.store

## Verified
- Brand: storefront, footer, policies, README use "Nanhaa"; sample-store footer/notices removed; all 6 catalogue products are live (COD).
- Public pages exist: /privacy-policy, /delete-account (no sign-in required), /terms, /refund-policy, /shipping-policy, /contact.
- In-app deletion: account page calls `prepare_account_deletion` then soft-deletes the Auth user (anonymised).
- Deletion now removes: cart, wishlist, addresses, support tickets, deletion requests, stock alerts, notifications; clears profile name/phone/preferences; review text replaced; order requests anonymised.
- Retained (anonymised, user link removed): orders, order items, refunds, fulfilments — needed for accounting, tax and dispute records. Suggested retention: 8 years (Indian accounting record norms) — confirm with an accountant.
- Customer isolation: automated tests deny anonymous order creation, forged payment capture, COD collection, refunds, deletion, supplier task and notification reads; cross-customer test passes.
- Admin RPCs check roles from the protected staff-roles table. Trigger functions are no longer callable directly.
- Secrets: only publishable keys in `.env`; no service-role, payment or webhook secrets in source.
- Tests: 37 passed, 1 skipped (direct DB transaction test needs a DB URL not available in the sandbox).

## Failed / blocking
- No delivery PIN codes configured → checkout cannot complete any order yet.
- Deletion is refused while an order is active or a COD collection/refund is pending (intentional to settle the obligation; user sees a clear message).
- nanhaa.store domain and hello@nanhaa.store mailbox not verified live.

## Unverified / outside this project
- Android build (application ID, permissions, target API 36, signing): no Android project exists here; this is a web app. A wrapper (TWA/Capacitor) must be created and audited separately.
- Data Safety form: declare name, email, phone, address, order history, in-app support messages; no location, card or contacts; data not sold; encrypted in transit; deletion available.
- Seller details: legal name and grievance officer name not provided; pickup address Bhopal shown; not GST registered.
- Stock counts set to 10 per product as a placeholder — merchant must confirm.
- Policies (7-day returns, refund timing, delivery times) need merchant/legal review.
- Database linter warns that signed-in users can execute security-definer RPCs; each RPC checks auth/roles internally (reviewed), no issue found but not independently pen-tested.
