import {Link} from '@tanstack/react-router';
import {useQuery} from '@tanstack/react-query';
import {useServerFn} from '@tanstack/react-start';
import {useState} from 'react';
import {Bell} from 'lucide-react';
import {toast} from 'sonner';
import {Button} from './ui/button';
import {useStore} from './store-context';
import {useShoppingLanguage} from './shopping-language';
import {getRestockAlerts,setRestockAlert} from '@/lib/shopping.functions';
export function RestockAlert({productId}:{productId:string}){
 const {user}=useStore();const {t}=useShoppingLanguage();const get=useServerFn(getRestockAlerts);const save=useServerFn(setRestockAlert);const [busy,setBusy]=useState(false);
 const query=useQuery({queryKey:['restock',user?.id],enabled:!!user,queryFn:()=>get()});const enabled=query.data?.some(a=>a.product_id===productId&&!a.notified_at)??false;
 if(!user)return <Button asChild variant="outline"><Link to="/auth"><Bell/>{t('Sign in for stock alerts','स्टॉक अलर्ट के लिए साइन इन करें')}</Link></Button>;
 return <Button variant="outline" disabled={busy||query.isLoading||!!query.error} onClick={async()=>{setBusy(true);try{await save({data:{productId,enabled:!enabled}});await query.refetch();toast.success(t(enabled?'Stock alert cancelled':'Stock alert saved',enabled?'स्टॉक अलर्ट हटाया गया':'स्टॉक अलर्ट सेव हुआ'));}catch(err){toast.error(err instanceof Error?err.message:'Stock alert unavailable')}finally{setBusy(false)}}}><Bell/>{t(enabled?'Cancel stock alert':'Notify me when available',enabled?'स्टॉक अलर्ट हटाएँ':'स्टॉक आने पर बताएँ')}</Button>;
}