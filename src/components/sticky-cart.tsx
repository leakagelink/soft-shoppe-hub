import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from './store-context';
import { money } from '@/lib/catalogue';
import { stickyCartSummary } from '@/lib/sticky-cart';

export function StickyCart() {
  const {cart, products} = useStore();
  const path = useRouterState({select: state => state.location.pathname});
  const {count, subtotal} = stickyCartSummary(cart, products);
  if (!count || ['/cart', '/checkout', '/admin'].includes(path)) return null;
  return <>
    <div className="sticky-bag-spacer" aria-hidden="true" />
    <aside className="sticky-bag" aria-label="Shopping bag summary">
      <div className="sticky-bag-icon"><ShoppingBag size={21}/><span key={count}>{count}</span></div>
      <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
        <p className="text-xs text-muted-foreground">{count} {count === 1 ? 'item' : 'items'} in your bag</p>
        <p className="text-sm font-semibold">{money(subtotal)} <span className="text-xs font-normal text-muted-foreground">subtotal</span></p>
      </div>
      <Button asChild className="shrink-0"><Link to="/cart">View bag <ArrowRight size={16}/></Link></Button>
    </aside>
  </>;
}