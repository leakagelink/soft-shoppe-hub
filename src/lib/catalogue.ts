import headphones from '@/assets/headphones.jpg';
import lamp from '@/assets/lamp.jpg';
import tote from '@/assets/tote.jpg';
import bottle from '@/assets/bottle.jpg';
import organizer from '@/assets/organizer.jpg';
import notebooks from '@/assets/notebooks.jpg';

export const productImages: Record<string, string> = { headphones, lamp, tote, bottle, organizer, notebooks };
export type Product = { id: string; name: string; sku: string; category_id: string | null; description: string; price_paise: number; image_key: string; is_demo: boolean; status: string; fulfillment_model: string; created_at: string; photos?:string[]; family_key?:string|null; option_name?:string|null; available_quantity?:number; return_days?:number };
export const productPhoto=(product:Product)=>product.photos?.[0]??productImages[product.image_key];
export type Category = { id: string; name: string; image_key: string; active: boolean; sort_order: number };
export const money = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: paise % 100 ? 2 : 0 }).format(paise / 100);
export const shortCategory: Record<string,string> = { home: 'Home & Living', fashion: 'Fashion', gadgets: 'Gadgets', travel: 'Travel', personal: 'Personal Care', stationery: 'Stationery' };
export const pageHead = (title: string, description: string) => ({ meta: [{ title: `${title} · little things` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} · little things` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] });