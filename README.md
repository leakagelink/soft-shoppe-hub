# Soft Shoppe Hub

# MASTER PROMPT — PREMIUM E-COMMERCE V1 | REFERENCE-DRIVEN UI/UX

## 1. PROJECT OBJECTIVE

Build a complete, modern, premium, mobile-first e-commerce platform for the Indian market. The platform must support both:

1. Own-brand products with inventory managed by the store.
2. Dropshipping products fulfilled by approved third-party suppliers.

I will provide a UI/UX reference image. Study the uploaded image carefully before implementing the interface.

**The uploaded image is the primary visual reference for the design direction.** Recreate its overall visual language, layout composition, spacing, card styling, product presentation, typography hierarchy, navigation patterns, pastel color palette, rounded surfaces, soft shadows, and premium shopping experience as closely as practical.

Do not merely insert the reference image into the website. Build real, responsive, interactive application screens based on the reference.

Use the reference to guide the design, but implement clean, original production code with consistent components and responsive layouts.

Do not stop after generating a homepage mockup. Build the complete V1 shopping experience and its admin operations.

## 2. DESIGN SYSTEM — FOLLOW THE REFERENCE

Create a distinctive, premium shopping interface with the following characteristics:

- Warm off-white backgrounds.
- Soft pastel accents: mint, blush pink, pale blue, lavender and subtle peach.
- Deep charcoal typography and high-contrast primary buttons.
- Large, rounded product cards with restrained shadows.
- High-quality product photography with clean backgrounds.
- Generous whitespace and carefully controlled spacing.
- Modern sans-serif typography.
- Clear visual hierarchy and compact, readable product information.
- Rounded category tiles, pill filters and elegant promotional cards.
- Smooth, subtle transitions and useful micro-interactions.
- Consistent iconography and bottom navigation on mobile.
- Premium editorial product layouts instead of a generic marketplace template.

Use the uploaded image as the source of truth for visual direction. Do not replace the design with a generic SaaS dashboard aesthetic.

Avoid excessive gradients, unnecessary glassmorphism, oversized headings, cluttered screens, inconsistent corner radii, excessive animation, and decorative elements that interfere with shopping.

The result must feel like a professionally designed consumer shopping brand, not an AI-generated template.

## 3. RESPONSIVE APPLICATION STRUCTURE

Build a responsive web storefront that works on mobile, tablet and desktop.

Prepare the application architecture so the same backend can later serve a dedicated Android application.

### A. Home Screen

Implement:

- Delivery location selector.
- Search bar with functional search.
- Notification entry point where notifications are supported.
- Horizontally scrollable category chips.
- Premium promotional hero carousel.
- Shop by category.
- Trending products.
- New arrivals.
- Best sellers.
- Deals and offers.
- Recommended products.
- Recently viewed products.
- Product collections and bundles.
- Wishlist actions.
- Product prices, discounts and ratings.
- Add-to-cart buttons.
- Product availability and delivery messaging.
- Footer with support, policies and business information.

Use real database-driven content when connected. Never present fake discounts or fabricated customer reviews as real.

### B. Categories

Build a visual category discovery screen with image-led tiles for categories such as:

- Home & Living
- Fashion & Accessories
- Mobile & Desk Accessories
- Kitchen
- Travel & Lifestyle
- Personal Care
- Stationery
- Other approved categories

Categories must be manageable from the admin panel.

Do not force all categories to be active at launch. The administrator must be able to enable, disable and reorder them.

### C. Search and Discovery

Implement:

- Search input with debounce.
- Search suggestions.
- Recent searches.
- Popular searches.
- Category and price filters.
- Sorting by price, popularity and newest.
- Availability filtering.
- Product result counts.
- Empty, loading and error states.
- Pagination or efficient incremental loading.

Search must query actual product data rather than display hardcoded suggestions only.

### D. Product Details

Build a premium product detail page with:

- High-quality product image gallery.
- Product name and SKU.
- Current price and valid discount information.
- Variant selection.
- Stock availability.
- Estimated delivery where supported by shipping data.
- Product description and specifications.
- Shipping, cancellation and return eligibility.
- Ratings and verified-purchase reviews.
- Quantity controls.
- Add to cart.
- Buy now.
- Wishlist.
- Related products.

Disable purchasing when a product is unavailable.

Never fabricate shipping guarantees, stock counts, ratings or product specifications.

### E. Cart

Implement:

- Cart items with product images.
- Selected variants.
- Quantity controls.
- Remove item and save-for-later actions.
- Stock revalidation.
- Coupon entry and validation.
- Item subtotal.
- Discounts.
- Shipping charges.
- Applicable taxes.
- Final payable amount.
- Clear checkout CTA.

All totals must be calculated and validated on the server. Never trust prices, discounts or totals submitted by the client.

### F. Checkout

Implement a complete checkout workflow:

1. Contact information.
2. Shipping address.
3. Delivery serviceability check.
4. Shipping method, when multiple methods are available.
5. Coupon validation.
6. Final order summary.
7. Payment method.
8. Payment processing.
9. Success, failure and pending states.

Support an approved Indian payment gateway such as Razorpay or Cashfree, subject to merchant approval and current provider requirements.

Support UPI, cards and other methods enabled by the payment provider. COD should be configurable and enabled only where operationally appropriate.

For online payments:

- Create payment orders securely on the server.
- Verify payment signatures and webhook events on the server.
- Use idempotency to prevent duplicate orders or charges.
- Handle pending, failed and duplicate webhook events.
- Never expose secret keys in frontend code.
- Never mark an order as paid merely because the client displays a success screen.

If payment credentials are not yet configured, build a clearly labelled sandbox/test integration or setup-required state. Do not simulate successful real payments.

### G. Orders and Tracking

Create an order history screen and order detail screen.

Use a consistent lifecycle, for example:

- Pending payment
- Confirmed
- Processing
- Awaiting supplier fulfillment
- Shipped
- Out for delivery
- Delivered
- Cancellation requested
- Cancelled
- Return requested
- Return in progress
- Refunded
- Failed

Only show states supported by the actual order and shipping data.

Include order ID, order items, payment status, delivery address, shipment tracking, invoice access where implemented, cancellation eligibility, return eligibility and support access.

Customers must not be able to change their own order status or payment status.

### H. Wishlist, Profile and Support

Implement:

- Customer profile.
- Saved addresses.
- Order history.
- Wishlist.
- Payment references or saved payment methods only through provider-supported secure mechanisms.
- Coupons and promotions.
- Notification preferences.
- Customer support tickets.
- Help centre and FAQs.
- Privacy settings.
- Account deletion workflow.
- Logout and session handling.

Allow guest shopping and guest checkout where practical. If accounts are created, implement account deletion according to applicable Google Play requirements.

## 4. HYBRID COMMERCE ENGINE

This project must support both own inventory and dropshipping without creating separate shopping experiences.

Every product must have an internal fulfillment model:

- OWN_INVENTORY
- DROPSHIP

For each dropshipping product, store the supplier association, supplier SKU, supplier cost, stock availability, dispatch SLA, shipping constraints, return rules and fulfillment configuration.

For own-inventory products, support stock quantity, stock reservations, inventory adjustments and stock movement history.

Implement:

- Supplier records.
- Supplier product mapping.
- Supplier-specific costs.
- Inventory synchronization.
- Order allocation.
- Fulfillment status tracking.
- Shipment tracking references.
- Supplier cancellation and failure handling.
- Retryable background tasks.
- Manual fulfillment fallback.
- Supplier performance reporting.

A single customer order may contain products fulfilled by different sources.

Use a parent order with individual order items and separate fulfillment records or sub-orders where required. Preserve one customer-facing order experience while tracking each shipment independently.

Do not assume that a supplier has an API. The initial version must support manually managed supplier orders, with integration adapters added when suppliers provide reliable APIs.

Do not automatically place live supplier orders until the relevant integration has been configured and tested.

## 5. ADMIN PANEL

Create a separate, protected admin application with a consistent but more operationally efficient interface.

### Dashboard

Show database-backed metrics:

- Orders and revenue.
- Gross sales.
- Discounts and refunds.
- Product costs.
- Shipping and payment costs.
- Estimated contribution margin.
- Low-stock products.
- Pending fulfillment.
- Delayed shipments.
- Return requests.
- Supplier performance.

Label metrics accurately. Do not call revenue profit. Clearly distinguish actual figures from estimates.

### Product Management

Allow authorized administrators to:

- Create and edit products.
- Upload product images.
- Manage categories and variants.
- Set SKUs and inventory sources.
- Configure selling prices and supplier costs.
- Set product status.
- Manage discounts and product visibility.
- Preview product pages.
- Bulk update products where appropriate.

### Supplier Management

Implement:

- Supplier details and contacts.
- Supplier product catalogue.
- Cost and availability records.
- Shipping and return configuration.
- Supplier approval status.
- Fulfillment queue.
- Tracking information.
- Failed fulfillment reports.
- Supplier performance history.

### Order Management

Implement:

- Order search and filters.
- Order details.
- Payment status.
- Shipment status.
- Supplier assignment.
- Cancellation and refund requests.
- Return handling.
- Customer support history.
- Internal notes and audit logs.

### Promotions and Content

Allow authorized staff to manage:

- Homepage banners.
- Product collections.
- Featured products.
- Coupons.
- Campaign dates.
- Promotional eligibility.
- Category order.
- Homepage sections.
- Basic store content and policy links.

### Access Control

Implement role-based permissions for owner/admin, operations staff, support staff and catalogue managers.

Do not allow ordinary customers to access administrative APIs or records.

Protect every sensitive operation on the backend, not just by hiding buttons in the interface.

## 6. BACKEND AND DATABASE

Use the existing connected project infrastructure where appropriate. If starting fresh, choose a maintainable architecture with PostgreSQL as the primary database.

If using Supabase, configure Auth, PostgreSQL, Row Level Security and secure server-side functions correctly.

Required entities should include:

- profiles
- products
- product_variants
- categories
- product_images
- inventory
- inventory_movements
- suppliers
- supplier_products
- carts
- cart_items
- addresses
- coupons
- orders
- order_items
- payments
- payment_webhook_events
- refunds
- fulfillments
- shipments
- returns
- reviews
- support_tickets
- notifications
- admin_roles
- audit_logs

Use appropriate foreign keys, unique constraints, indexes, timestamps and status constraints.

Use database transactions for order creation, stock reservation and other operations that require consistency.

Never store raw card data.

Store secrets in environment variables or the provider's secure secrets manager. Never commit production credentials to source control.

Implement schema migrations and document setup steps.

If a backend service is unavailable, build a clearly identified development mode. Do not silently substitute mock data for production database operations.

## 7. SECURITY AND RELIABILITY

Implement:

- Authentication and authorization.
- Server-side role validation.
- Input validation and sanitization.
- Rate limiting for sensitive endpoints.
- Secure session handling.
- Customer data isolation.
- Payment webhook signature verification.
- Idempotent order and payment processing.
- Inventory concurrency controls.
- Safe error handling.
- Audit logs for sensitive administrative changes.
- Image upload restrictions.
- Environment-specific configuration.
- Error monitoring hooks.
- Database backup and recovery documentation.

Never expose supplier costs, internal margins, private customer data or admin-only information to unauthorized clients.

Do not trust client-supplied prices, discounts, inventory values, payment states or permissions.

## 8. INDIA-SPECIFIC COMMERCE REQUIREMENTS

Build the platform for India-first operations.

Support:

- INR currency.
- Indian phone numbers.
- Indian address formats.
- PIN code validation and delivery serviceability.
- Configurable shipping charges.
- Configurable COD availability.
- Applicable tax and invoice fields.
- Clear delivery estimates.
- Clear return, cancellation and refund policies.
- Customer grievance and support contact details.
- Accurate seller and business disclosures.

Use configurable tax rules and have the final tax treatment verified by an Indian tax professional.

Do not hardcode one universal GST rate for every product.

Use a payment provider and shipping service only after credentials and merchant configuration are complete.

Review the current Google Play Developer Policies and applicable Indian e-commerce laws before launch.

## 9. DESIGN AND INTERACTION QUALITY

Every screen must follow the uploaded reference image's design language.

Create reusable components for:

- Product cards.
- Category tiles.
- Price and discount displays.
- Search inputs.
- Filter chips.
- Promotional banners.
- Cart rows.
- Address cards.
- Order status timelines.
- Dialogs and bottom sheets.
- Toasts and feedback messages.
- Loading skeletons.
- Empty states.
- Error states.
- Confirmation dialogs.

Use consistent design tokens for typography, spacing, colors, shadows, radii and icon sizes.

The interface must adapt to small Android screens, tablets and desktop browsers.

Ensure readable contrast, accessible labels, keyboard navigation on the web and touch targets appropriate for mobile.

Avoid horizontal overflow, clipped content, broken images and layouts that work only at one viewport size.

Implement real interactions for every visible primary button. Do not leave dead controls or placeholder navigation.

## 10. SEO, PERFORMANCE AND ANALYTICS

For the responsive web storefront, implement:

- Product and category metadata.
- Canonical URLs.
- Sitemap and robots configuration.
- Structured product data where appropriate.
- Optimized images and responsive image sizing.
- Lazy loading where appropriate.
- Pagination or incremental product loading.
- Search-friendly product URLs.
- Analytics events for product view, search, add to cart, checkout and purchase.

Do not collect unnecessary personal data. Configure analytics and consent according to applicable requirements.

## 11. TESTING AND ACCEPTANCE CRITERIA

Before considering V1 complete, verify:

1. A customer can browse products, search and filter.
2. Variants, stock availability and prices are correct.
3. Cart totals are calculated correctly.
4. Invalid or expired coupons are rejected.
5. A successful verified payment creates the correct paid order.
6. Failed and pending payments are handled safely.
7. Duplicate webhooks do not duplicate orders or charges.
8. Stock cannot be oversold through concurrent purchases.
9. Own-inventory orders and dropshipping orders follow their correct workflows.
10. A multi-supplier order can be tracked correctly.
11. Returns and refunds follow defined eligibility rules.
12. Customers cannot access other customers' private records.
13. Customers cannot access administrative endpoints.
14. Unauthorized staff cannot perform restricted operations.
15. Account deletion and privacy workflows function correctly.
16. Mobile layouts work on narrow screens.
17. Empty, loading, error and offline states are handled.
18. No major navigation or checkout buttons are non-functional.
19. Production builds contain no exposed secret keys.
20. Setup instructions and environment variables are documented.

Create automated tests for critical business logic, payment verification, access control and inventory concurrency wherever supported by the project.

## 12. IMPLEMENTATION RULES

Before changing the codebase:

- Inspect the existing project structure.
- Identify the existing framework, database and integrations.
- Preserve working functionality.
- Reuse existing components and infrastructure when appropriate.
- Avoid unnecessary rewrites.
- Create a clear implementation plan.

Then implement the project in phases:

Phase 1: Design system and customer storefront.

Phase 2: Database, authentication and secure backend.

Phase 3: Cart, checkout and payment integration.

Phase 4: Hybrid inventory and fulfillment.

Phase 5: Admin panel, analytics and support.

Phase 6: Security review, testing and production-readiness fixes.

After each phase, verify that the code compiles and the implemented workflows actually work.

Do not claim an integration is complete if it only has a UI placeholder.

Do not invent credentials, supplier APIs, payment confirmations or live shipment data.

If a required credential or external service is unavailable, implement the safe integration boundary and clearly document what is needed to activate it.

## FINAL INSTRUCTION

Start by analysing the uploaded reference image and the existing project.

First, establish the design system and complete the core customer shopping screens with a consistent visual language. Then build the underlying commerce functionality and admin operations.

Deliver a cohesive, production-oriented V1—not just a homepage, a collection of static screens or a generic e-commerce template.

Prioritize visual fidelity, functional shopping workflows, secure payments, inventory accuracy, maintainable architecture and realistic launch readiness.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://soft-shoppe-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b57419fe-b36b-44ed-af68-48c8581c0166).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
