import {useShoppingLanguage} from '@/components/shopping-language';
import {createFileRoute,Link} from '@tanstack/react-router';
import {Heart,ArrowRight} from 'lucide-react';
import {useStore} from '@/components/store-context';
import {ProductCard} from '@/components/product-card';
import {Button} from '@/components/ui/button';
import {pageHead} from '@/lib/catalogue';
export const Route=createFileRoute('/wishlist')({head:()=>pageHead('Your wishlist','Keep the little things you love together in your personal wishlist.'),component:Wishlist});
function Wishlist(){const {t}=useShoppingLanguage();const store=useStore();const products=store.products.filter(p=>store.wishlist.includes(p.id));return <main className="store-container page-main"><h1 className="page-title">{t('Your little favourites','आपकी पसंद')}</h1><p className="mb-8 text-sm text-muted-foreground">Saved for another little look. {store.user?'Synced to your account.':'Sign in to save across devices.'}</p>{products.length?<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><Heart size={44}/><h2>{t('A little room for your favourites','आपकी विशलिस्ट खाली है')}</h2><p>{t('Something caught your eye? Save it here.','पसंद आया प्रोडक्ट यहाँ सेव करें।')}</p><Button asChild className="rounded-full"><Link to="/shop" search={{q:'',category:'all'}}>{t('Find your favourite ','अपनी पसंद खोजें ')}<ArrowRight/></Link></Button></div>}</main>}