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
- Payment and final payable amounts remain disabled until shipping, tax and Indian gateway configuration are verified; never convert a client preview into a paid order.
- Guest preview state stays in memory while signed-in cart and wishlist records use Cloud; this avoids presenting transient guest state as durable storage.
