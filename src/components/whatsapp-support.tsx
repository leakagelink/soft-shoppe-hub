import {MessageCircle} from 'lucide-react';
import {useStore} from './store-context';
import {useShoppingLanguage} from './shopping-language';
import {Button} from './ui/button';
import {whatsappUrl} from '@/lib/shopping-rules';
export function WhatsAppSupport({message='Hello, I need help with little things.'}:{message?:string}){
 const {whatsappNumber}=useStore();const {t}=useShoppingLanguage();const url=whatsappUrl(whatsappNumber,message);if(!url)return null;
 return <Button asChild variant="outline"><a href={url} target="_blank" rel="noopener noreferrer"><MessageCircle/>{t('WhatsApp support','WhatsApp पर मदद')}</a></Button>;
}