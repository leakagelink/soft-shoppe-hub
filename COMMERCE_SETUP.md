# Store readiness and activation

The current implementation is a development storefront, not a complete production V1. The working catalogue is database-backed and all supplied demonstration products are labelled. The provisional brand name “little things”, generated photos, catalogue names and sample prices are creative placeholders requiring merchant approval.

## Implemented
- Public catalogue, categories, product pages, debounced discovery, price sorting and filters.
- Preview cart with authoritative server subtotal, coupon rejection and blocked final payable/payment states.
- Email/password, Google sign-in and confirmation/recovery flows.
- Customer-private profile, cart, wishlist, saved addresses, orders and support requests.
- Protected staff reads with separate staff role records, restricted product status/category visibility updates.
- Foundational supplier, supplier-product, inventory and variant schema with explicit grants/RLS.

## Not yet implemented
- Full transactional ordering, inventory reservations, payment signatures/webhooks/idempotency and concurrent-stock tests.
- Full admin create/edit/upload, audit history, promotions, cost accounting, fulfillment/sub-orders, returns/refunds and retry tasks.
- Order detail/tracking/invoices, automatic account deletion and complete privacy retention automation.
- Production sitemap/canonical URLs/structured data, consent analytics and offline handling.

## External activation requirements
1. Approve the brand and replace demonstration catalogue descriptions, photography and prices with verified seller content.
2. Supply legal seller/business/grievance disclosures and final shipping, privacy, cancellation and return policies.
3. Configure shipping serviceability and charges and have product-specific GST/invoice treatment reviewed by an Indian tax professional.
4. Select and obtain approval for Razorpay or Cashfree; store provider keys securely through Lovable Cloud secrets. No credentials are committed or requested in ordinary chat.
5. Implement provider-specific server order creation, raw-body signature verification and idempotent webhook processing before enabling payment.
6. Approve suppliers and configure manual queues before testing any live adapter.
7. Assign staff roles through a trusted administrative process; never from customer metadata or signup. No default staff role is seeded.

## Verification
Run `bunx vitest run` for the current critical rules. Additional payment, permissions, concurrency and recovery verification is required before launch. All schema is managed through checked-in migrations.

## Backup/recovery
Before live launch, confirm the Cloud backup/restore capability and retention in project settings, schedule appropriate exports, and rehearse restoration in an isolated environment. Preserve migration history, do not restore customer/payment records into an exposed development environment, and reconcile gateway transactions after recovery. Backup availability and restore testing have not been verified.