import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { calculateSubtotal, cartSchema } from './commerce-rules';

export const getCatalogue = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('The catalogue is temporarily unavailable');
  const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }); } } });
  const [products, categories] = await Promise.all([db.from('products').select('*').eq('status','active').order('created_at'), db.from('categories').select('*').eq('active',true).order('sort_order')]);
  if (products.error || categories.error) throw new Error('The catalogue could not be loaded. Please try again.');
  const [reviews,campaigns]=await Promise.all([db.from('reviews').select('id,product_id,rating,body,created_at').order('created_at',{ascending:false}),db.from('campaigns').select('*').order('sort_order')]);
  if(reviews.error||campaigns.error)throw new Error('Store content could not be loaded');
  const images=await db.from('product_images').select('product_id,object_path').order('sort_order');
  if(images.error)throw new Error('Product photos could not be loaded');
  // Only paths authorized by the public catalogue query above may be signed.
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const signed=await supabaseAdmin.storage.from('product-images').createSignedUrls((images.data??[]).map(i=>i.object_path),3600);
  if((images.data??[]).length&&signed.error)throw new Error('Product photos are temporarily unavailable');
  const browserOrigin=process.env['VITE_SUPABASE_URL']??url;
  const photos=(images.data??[]).map((image,index)=>({productId:image.product_id,url:signed.data?.[index]?.signedUrl?.replace(url,browserOrigin)}));
  const [availability,contacts]=await Promise.all([db.rpc('shopping_availability'),db.from('store_contacts').select('whatsapp_number').eq('id','store').maybeSingle()]);
  if(availability.error||contacts.error)throw new Error('Shopping options could not be loaded.');
  return { products:(products.data??[]).map(p=>({...p,available_quantity:availability.data?.find(a=>a.product_id===p.id)?.available_quantity??0,photos:photos.filter(i=>i.productId===p.id&&i.url).map(i=>i.url).filter((u):u is string=>typeof u==='string')})), categories: categories.data ?? [],reviews:reviews.data??[],campaigns:campaigns.data??[],whatsappNumber:contacts.data?.whatsapp_number??'' };
});
export const quoteCart = createServerFn({ method: 'POST' }).inputValidator((input) => z.object({ items: cartSchema, coupon: z.string().trim().max(50).default('') }).parse(input)).handler(async ({ data }) => {
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Checkout is unavailable');
  const db = createClient<Database>(url,key,{ auth: { persistSession:false }, global: { fetch: (input,init) => { const headers = new Headers(init?.headers); if(key.startsWith('sb_')) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers}); } } });
  const {data: products,error} = await db.from('products').select('id,price_paise,is_demo').eq('status','active').in('id',data.items.map(i=>i.productId));
  if(error) throw new Error('Prices could not be verified');
  const subtotal = calculateSubtotal(data.items,products ?? []);
  let discount=0;let couponError:string|null=null;
  if(data.coupon){const result=await db.rpc('preview_coupon',{_code:data.coupon,_items:data.items});if(result.error)throw new Error('Coupon could not be verified');const parsed=z.object({valid:z.boolean(),discount:z.number().int().min(0)}).parse(result.data);discount=parsed.discount;if(!parsed.valid)couponError='This coupon is not valid or is no longer available.';}
  return { subtotal, discount, couponError, shipping: null, tax: null, payable: null, purchasingEnabled: false, reason: (products ?? []).some(p=>p.is_demo) ? 'Demonstration products cannot be purchased. No payment will be taken.' : 'Payment, shipping and tax configuration must be completed before orders can be accepted.' };
});
export const getStaffData = createServerFn({ method:'GET' }).middleware([requireSupabaseAuth]).handler(async ({context}) => {
  const {data: allowed,error} = await context.supabase.rpc('staff_has_role',{allowed:['owner','admin','operations','support','catalogue']});
  if(error || !allowed) throw new Error('You do not have permission to access store operations.');
  const [products,orders,suppliers,categories] = await Promise.all([context.supabase.from('products').select('*'),context.supabase.from('orders').select('*'),context.supabase.from('suppliers').select('*'),context.supabase.from('categories').select('*').order('sort_order')]);
  return {products:products.data ?? [],orders:orders.data ?? [],suppliers:suppliers.data ?? [],categories:categories.data ?? []};
});