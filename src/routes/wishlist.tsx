import {createFileRoute,Link} from '@tanstack/react-router';
import {Heart,ArrowRight} from 'lucide-react';
import {useStore} from '@/components/store-context';
import {ProductCard} from '@/components/product-card';
import {Button} from '@/components/ui/button';
import {pageHead} from '@/lib/catalogue';
export const Route=createFileRoute('/wishlist')({head:()=>pageHead('Your wishlist','Keep the little things you love together in your personal wishlist.'),component:Wishlist});
function Wishlist(){const store=useStore();const products=store.products.filter(p=>store.wishlist.includes(p.id));return <main className="store-container page-main"><h1 className="page-title">Your little favourites</h1><p className="mb-8 text-sm text-muted-foreground">Saved for another little look. {store.user?'Synced to your account.':'Sign in to save across devices.'}</p>{products.length?<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><Heart size={44}/><h2>A little room for your favourites</h2><p>Something caught your eye? Save it here.</p><Button asChild className="rounded-full"><Link to="/shop" search={{q:'',category:'all'}}>Find your favourite <ArrowRight/></Link></Button></div>}</main>}