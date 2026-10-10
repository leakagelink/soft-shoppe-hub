# Premium India-first commerce V1

## Design direction
Translate the supplied mobile collage into real shopping screens: off-white backgrounds, soft pastel product photography, charcoal buttons, rounded tiles, compact product information and mobile bottom navigation. Extend the same visual language to tablet and desktop, without embedding the reference image.

## Implementation phases
1. **Customer storefront:** home, category discovery, searchable/filterable catalogue, product detail and variants, wishlist, cart, checkout, account, orders and support. Use clearly labelled development catalogue content until verified products are supplied; no fabricated reviews or delivery claims.
2. **Cloud and customer accounts:** enable Lovable Cloud, create migrations and customer profiles with saved addresses/preferences, email and Google sign-in, recovery and deletion workflows. Separate public catalogue data from customer-private and staff-only records.
3. **Secure commerce:** server-calculated cart quotes, coupon validation, serviceability configuration, transactional orders and stock reservations. Build an Indian payment-gateway boundary with explicit setup-required states until merchant credentials are supplied; never simulate paid orders.
4. **Hybrid fulfillment:** own-stock movements, approved suppliers and product mappings, per-source fulfillment records, manual supplier queues, shipments and retryable tasks. No live supplier requests without configured, tested adapters.
5. **Admin operations:** protected role-specific catalogue, categories, suppliers, orders, promotions, returns and support; database-backed metrics with accurate labels and audited changes.
6. **Verification and launch preparation:** test pricing, coupons, authorization, stock concurrency and webhook idempotency; exercise shopping flows on desktop and narrow mobile screens, add page metadata and document setup, backups and external activation requirements.

## Technical approach
- Preserve TanStack Start, React, Tailwind v4 and the existing routing/test setup.
- Use shared semantic design tokens and reusable shopping controls.
- Use Lovable Cloud PostgreSQL, explicit grants and row-level policies; roles live separately from profiles.
- Put app operations in authenticated server functions and gateway webhooks in signature-verified public server handlers.
- Keep supplier costs and payment secrets strictly server-only. Customers cannot mutate order/payment statuses.
- Seed any development catalogue through migrations and visibly identify it as demonstration content.

## External launch requirements
- Real brand/business disclosures, product catalogue, approved prices/specifications, images and policies.
- Indian payment-provider merchant approval and credentials; shipping serviceability, charges and tracking configuration.
- Approved suppliers and their fulfillment/return agreements.
- Tax treatment verified by an Indian tax professional, plus current legal and Google Play policy review.

These requirements can block live activation, not the safe shopping interface or internal management workflows. Each phase will be verified before its completion is reported; the finished store will not be described as production-ready while these remain unresolved.