import { useEffect, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ShoppingBag, X } from 'lucide-react';
import { useStore } from '@/components/store-context';
import { useShoppingLanguage } from '@/components/shopping-language';

const DISMISSED_KEY = 'nanhaa-bag-reminder-dismissed';

// One-time-per-session gentle reminder when a shopper leaves items in the bag.
export function BagReminder() {
  const store = useStore();
  const { t } = useShoppingLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISSED_KEY) === '1');
  }, []);

  const count = Object.values(store.cart).reduce((sum, q) => sum + q, 0);
  const show = !dismissed && count > 0 && pathname !== '/cart' && pathname !== '/checkout' && !pathname.startsWith('/admin');

  if (!show) return null;
  return (
    <div className="store-container">
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-brand/30 bg-accent px-4 py-3 text-sm">
        <ShoppingBag size={17} className="shrink-0 text-brand" />
        <p className="min-w-0 flex-1 leading-5">
          {t('Your bag is waiting — try code ', 'आपका बैग इंतज़ार कर रहा है — कोड ')}
          <strong>WELCOME10</strong>
          {t(' for a little discount.', ' से छूट पाएँ।')}
        </p>
        <Link to="/cart" className="shrink-0 font-semibold text-brand underline underline-offset-4">{t('View bag', 'बैग देखें')}</Link>
        <button
          type="button"
          aria-label={t('Dismiss reminder', 'रिमाइंडर हटाएँ')}
          className="shrink-0 text-muted-foreground"
          onClick={() => { sessionStorage.setItem(DISMISSED_KEY, '1'); setDismissed(true); }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
