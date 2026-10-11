# Store readiness and activation

Nanhaa (https://nanhaa.store) — COD-only storefront. Live selling requires configured delivery PIN codes; online payments, GST invoices and supplier automation are not enabled.

## Current COD release
- All new checkout orders use COD only. The database validates sale approval, product-specific tax, shipping, coupon, stock and final total; duplicate submission keys return the same order. Sample products remain blocked.
- Private product photo upload and galleries are implemented; catalogue-authorized paths receive expiring signed links. Public storage download policies are removed.
- Supplier tasks are allocated with orders, with staff acknowledgement, failure evidence, retry scheduling and manual dispatch/tracking. No external supplier automation is claimed without a tested supplier adapter.
- COD collection requires a delivered order, exact amount and staff reference. Approved full-order cancellations restock own inventory. Full-order returns create refund records after collection; refund transfers are manual and require owner/admin evidence. Returned stock is not automatically made sellable.
- Customers can download owner-authorized PDF order receipts, not verified GST invoices. Account deletion blocks unresolved commerce obligations, anonymizes retained financial records and deactivates the login.
- Latest verification: 24 tests passed; 1 isolated-database COD transaction suite skipped because its privileged test connection is unavailable. Anonymous COD/refund/deletion access was denied; public desktop and narrow-screen COD checkout showed no runtime errors or overflow. Basic backend scan and production dependency scan reported no issues. These do not establish complete end-to-end security.
- Remaining checks: signed-in customer/staff workflows, cross-customer access, upload/receipt/deletion end-to-end and stock concurrency require an isolated authorized test environment. Verified seller tax/legal details are required for GST invoices; supplier specifications are required for external automation.
- Online gateway credentials are not needed for COD activation. Verified non-demo products, stock, shipping/tax rules, staff roles and operating policies are still required.

## Earlier baseline (historical; superseded above)
- Public catalogue, categories, product pages, debounced discovery, price sorting and filters.
- Preview cart with authoritative server subtotal and database-validated coupon preview; final payable/payment states remain blocked.
- Email/password, Google sign-in and confirmation/recovery flows.
- Customer-private profile, cart, wishlist, saved addresses, orders and support requests.
- Staff catalogue/category/supplier/mapping/shipping/coupon create/edit forms, inventory adjustments and stock history, audit history, request review and support status changes. Access uses separate protected staff roles and database authorization.
- Transactional own-stock reservations, approved manual supplier allocation, per-item fulfillments, locked/idempotent captured-payment recording and safe unpaid release checks.
- Raw-body Razorpay HMAC webhook verification; endpoint returns 503 until the webhook secret is configured. Only captured events are handled.
- Customer-private order details and shipment tracking; eligible cancellation/return requests and account-deletion requests. Approval records a staff decision, not a refund or completed deletion.
- PIN serviceability lookup and product-specific tax/return configuration with integrity constraints.

## Earlier baseline gaps (historical; superseded above)
- Gateway order creation, final checkout/coupon transaction, failed/pending payment reconciliation, refunds, expiry reconciliation and concurrent-stock end-to-end tests. Reservation currently does not apply coupons: do not activate checkout using a discounted preview quote.
- Product image uploads/galleries, variant-aware carts, full banners/collections/content management, supplier API adapters/synchronization/retry queues, failure handling and cost/performance accounting.
- Return execution, invoices, automatic account deletion and complete privacy retention automation. Storage upload setup attempted but public buckets are blocked; no image-upload integration is claimed.
- Production sitemap/canonical URLs/structured data, consent analytics and offline handling.

## External activation requirements
1. Approve the brand and replace demonstration catalogue descriptions, photography and prices with verified seller content.
2. Supply legal seller/business/grievance disclosures and final shipping, privacy, cancellation and return policies.
3. Configure shipping serviceability and charges and have product-specific GST/invoice treatment reviewed by an Indian tax professional.
4. Select and obtain approval for Razorpay or Cashfree; store provider keys securely through Lovable Cloud secrets. No credentials are committed or requested in ordinary chat.
5. Complete and verify provider-specific server order creation, final amount/coupon calculation and all payment/refund/reconciliation states before enabling payment. The existing capture-only webhook is not a complete gateway integration. Required secrets when implementing Razorpay are RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET; add through the secure secrets tool only.
6. Approve suppliers and configure manual queues before testing any live adapter.
7. Assign staff roles through a trusted administrative process; never from customer metadata or signup. No default staff role is seeded.

## Verification
Run `bunx vitest run`: 18 tests passed across cart/address rules, HMAC signature verification, routing and seven live anonymous-access/coupon checks. Public browser checks confirmed unconfigured PIN blocking, disabled payments, staff/order sign-in requirements, a 503 unconfigured webhook response, no narrow-screen checkout overflow and no observed runtime errors. Builds were checked successfully.

Authenticated customer/staff and cross-customer tests remain unverified: the requesting user has no matching signed-in test account. Sign in in the preview before those checks. Actual paid-order creation, duplicate webhook database fixtures, multi-shipment races, stock concurrency and recovery verification remain launch gates; a passing HMAC unit test is not a successful payment test. All schema is managed through checked-in migrations.

## Backup/recovery
Before live launch, confirm the Cloud backup/restore capability and retention in project settings, schedule appropriate exports, and rehearse restoration in an isolated environment. Preserve migration history, do not restore customer/payment records into an exposed development environment, and reconcile gateway transactions after recovery. Backup availability and restore testing have not been verified.