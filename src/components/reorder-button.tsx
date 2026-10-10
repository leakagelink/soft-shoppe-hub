import {useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from './ui/button';
import {useStore,catalogueOptions} from './store-context';
import {useShoppingLanguage} from './shopping-language';
import {reorderPlan} from '@/lib/shopping-rules';
export function ReorderButton({items}:{items:{product_id:string;quantity:number}[]}){
 const store=useStore();const cache=useQueryClient();const {t}=useShoppingLanguage();const [busy,setBusy]=useState(false);
 return <Button variant="outline" disabled={busy} onClick={async()=>{setBusy(true);try{const catalogue=await cache.fetchQuery({...catalogueOptions,staleTime:0});const plan=reorderPlan(items,catalogue.products,store.cart);for(const [id,q] of Object.entries(plan.quantities))store.setQuantity(id,q);if(!Object.keys(plan.quantities).length)toast.info(t('These products are currently unavailable.','ये प्रोडक्ट अभी उपलब्ध नहीं हैं।'));else toast.success(t('Available items added at current prices.','उपलब्ध सामान मौजूदा कीमतों पर बैग में जुड़ गया।'));if(plan.skipped.length&&Object.keys(plan.quantities).length)toast.info(t('Some quantities are unavailable; only available stock was added.','कुछ मात्रा उपलब्ध नहीं है; केवल उपलब्ध स्टॉक जोड़ा गया।'));}catch{toast.error(t('Availability could not be checked. Please try again.','स्टॉक चेक नहीं हुआ। दोबारा कोशिश करें।'));}finally{setBusy(false)}}}><RotateCcw/>{t(busy?'Checking stock…':'Order again',busy?'स्टॉक चेक हो रहा है…':'दोबारा ऑर्डर करें')}</Button>;
}