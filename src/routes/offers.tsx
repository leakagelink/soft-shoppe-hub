import {createFileRoute,Link} from '@tanstack/react-router';
import {Sparkles,ArrowRight} from 'lucide-react';
import {pageHead} from '@/lib/catalogue';
import {Button} from '@/components/ui/button';
export const Route=createFileRoute('/offers')({head:()=>pageHead('The good finds','Explore collections and verified promotions from little things.'),component:Offers});
function Offers(){return <main className="store-container page-main"><h1 className="page-title">The good finds</h1><div className="empty-state"><Sparkles size={44}/><h2>Good things don’t need a countdown</h2><p>There are no active verified promotions right now. Discover our everyday collections instead.</p><Button asChild className="rounded-full"><Link to="/shop" search={{q:'',category:'all'}}>Explore the collections <ArrowRight/></Link></Button></div></main>}