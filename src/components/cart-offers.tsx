import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Tag, Truck } from 'lucide-react';
import { useShoppingLanguage } from '@/components/shopping-language';
import { listActiveCoupons } from '@/lib/commerce.functions';
import { money } from '@/lib/catalogue';

// Indicative free-shipping threshold for the preview store; final shipping is decided at checkout.
export const FREE_SHIPPING_THRESHOLD_PAISE = 50000;

export function FreeShippingBar({ subtotal }: { subtotal: number | undefined }) {
  const { t } = useShoppingLanguage();
  if (subtotal === undefined) return null;
  const remaining = FREE_SHIPPING_THRESHOLD_PAISE - subtotal;
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_PAISE) * 100));
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Truck size={15} className="text-brand" />
        {remaining > 0
          ? t(`Add ${money(remaining)} more for free shipping`, `फ्री शिपिंग के लिए ${money(remaining)} और जोड़ें`)
          : t('You have unlocked free shipping!', 'आपको फ्री शिपिंग मिल गई!')}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{t('Indicative — final shipping is confirmed at checkout.', 'अनुमानित — असली शिपिंग चेकआउट पर तय होगी।')}</p>
    </div>
  );
}

export function CouponChips({ onApply }: { onApply: (code: string) => void }) {
  const { t } = useShoppingLanguage();
  const fetchCoupons = useServerFn(listActiveCoupons);
  const { data } = useQuery({ queryKey: ['active-coupons'], queryFn: () => fetchCoupons(), staleTime: 60000 });
  if (!data?.length) return null;
  return (
    <div className="mb-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Tag size={13} />{t('Available offers', 'उपलब्ध ऑफ़र')}</p>
      <div className="flex flex-wrap gap-2">
        {data.map((c) => (
          <button
            key={c.code}
            type="button"
            className="rounded-full border border-dashed border-brand px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-accent"
            onClick={() => onApply(c.code)}
          >
            {c.code} · {c.percent}% {t('off', 'छूट')}{c.min_subtotal_paise > 0 ? ` · ${t('min', 'न्यूनतम')} ${money(c.min_subtotal_paise)}` : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
