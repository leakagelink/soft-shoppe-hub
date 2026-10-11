# Nanhaa — Google Play readiness (evidence-based, 11 Oct 2026)

Not a compliance claim. Status: Verified / Failed / Unverified.

## Commerce
- Verified: checkout is COD-only and server-authoritative (`quote_cod_order` + `place_cod_order`): price, stock, coupon, tax, shipping and payable computed in the database; requires active, COD-enabled delivery rule.
- Verified: bag page (`quoteCart`) is a preview only (`stage: 'bag-preview'`); it never enables purchase. Final total is confirmed at checkout.
- Verified: admin Shipping tab imports validated PIN rules (CSV, 6-digit PIN, fee/days/COD checks). One owner-approved default rule exists: all India, free shipping, 3–7 days, COD on.
- Verified (integration test on live DB, test data removed): correct total, stock deduction, duplicate submit -> one order, concurrent last-item -> one order, sold-out / unknown / COD-disabled PIN refused.
- Unverified: stock of 10 per product is a placeholder — owner must confirm real stock.

## Account deletion
- Verified: in-app (Privacy page) and public `/delete-account` (no sign-in).
- Verified: deletes cart, wishlist, addresses, support tickets, stock alerts, notifications, profile data; active obligations -> saved `awaiting_obligations` request, completed after settlement.
- Verified: no customer files in storage (only staff product photos).
- Retained anonymized: orders, refunds, fulfillments. Retention period (proposed 8 years) — owner/accountant must confirm.

## Domain & legal
- Verified: https://nanhaa.store returns 200 for /, /privacy-policy, /delete-account, /contact, /terms.
- Unverified: hello@nanhaa.store mailbox actually receives mail.
- Unconfirmed (do not invent): legal business name, grievance officer name. Seller address on file: D 89, Ashoka Garden, Mayur Vihar, Bhopal 462023. Not GST registered — receipts only.

## Android
- Architecture: Capacitor shell loading https://nanhaa.store (app needs SSR + server functions; a bundled static app is impossible). Local `android-shell/index.html` = offline page. TWA is an alternative once Play signing SHA-256 is available for assetlinks.
- Verified in config: appId `store.nanhaa.app`, compile/target SDK 36, INTERNET permission only, WebView debugging off, signing via untracked `keystore.properties`.
- Not run: Android release build and device test — no Java/Android SDK in this workspace. No AAB exists until built on the owner's PC (see ANDROID_RELEASE.md).

## Build/tests
- Tests: 43 passed, 1 skipped (needs privileged DB role).
- Lint: 2308 errors, all auto-fixable formatting; not changed.

## Must resolve before submission
1. Real stock per product.
2. Legal business name + grievance officer name.
3. Confirm hello@nanhaa.store mailbox works.
4. Confirm retention period and policy promises (7-day return/refund, 3–7 day delivery, 48h reply).
5. Build signed AAB on PC, test on a real Android device.
6. Fill Data Safety form + store listing in Play Console.
