import { useState } from 'react';
import { BadgeCheck, HandCoins, MapPin, RotateCcw } from 'lucide-react';
import { useShoppingLanguage } from '@/components/shopping-language';
import { Button } from '@/components/ui/button';

export function TrustBadges({ returnDays }: { returnDays: number }) {
  const { t } = useShoppingLanguage();
  const items: Array<[typeof HandCoins, string]> = [
    [HandCoins, t('COD available', 'COD उपलब्ध')],
    [RotateCcw, returnDays > 0 ? t(`${returnDays}-day easy return`, `${returnDays} दिन आसान रिटर्न`) : t('Return policy applies', 'रिटर्न नीति लागू')],
    [BadgeCheck, t('Quality checked', 'गुणवत्ता जाँची गई')],
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(([Icon, label]) => (
        <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-center">
          <Icon size={18} className="text-brand" />
          <span className="text-[11px] font-medium leading-4">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function PinDeliveryCheck() {
  const { t } = useShoppingLanguage();
  const [pin, setPin] = useState('');
  const [result, setResult] = useState('');
  const check = () => {
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setResult(t('Please enter a valid 6-digit PIN code.', 'कृपया सही 6-अंकों का PIN कोड डालें।'));
      return;
    }
    const zone = Number(pin[0]);
    const days = zone <= 4 ? '3–5' : '4–7';
    setResult(t(`Indicative delivery to ${pin}: ${days} days. Final availability is verified at checkout.`, `${pin} पर अनुमानित डिलीवरी: ${days} दिन। असली उपलब्धता चेकआउट पर जाँची जाएगी।`));
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-semibold"><MapPin size={15} className="text-brand" />{t('Delivery estimate', 'डिलीवरी का अंदाज़ा')}</p>
      <div className="mt-3 flex gap-2">
        <input
          aria-label="PIN code"
          className="store-input min-w-0"
          placeholder={t('Enter PIN code', 'PIN कोड डालें')}
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setResult(''); }}
        />
        <Button type="button" variant="outline" className="h-11 rounded-full" onClick={check}>{t('Check', 'जाँचें')}</Button>
      </div>
      {result && <p className="mt-3 text-xs leading-5 text-muted-foreground">{result}</p>}
    </div>
  );
}
