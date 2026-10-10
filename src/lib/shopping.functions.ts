import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
export const setRestockAlert=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({productId:z.string().min(1).max(100),enabled:z.boolean()}).parse(input)).handler(async({data,context})=>{
 const db=context.supabase;const p=await db.from('products').select('id,is_demo').eq('id',data.productId).eq('status','active').single();
 if(p.error||p.data.is_demo)throw new Error('Stock alerts are unavailable for this product.');
 if(data.enabled){const a=await db.rpc('shopping_availability');if(a.error)throw new Error('Availability could not be verified.');if(a.data.some(p=>p.product_id===data.productId&&p.available_quantity>0))throw new Error('This product is already available.');}
 const removed=await db.from('restock_subscriptions').delete().eq('user_id',context.userId).eq('product_id',data.productId);if(removed.error)throw new Error('Stock alert could not be updated.');
 if(data.enabled){const saved=await db.from('restock_subscriptions').insert({user_id:context.userId,product_id:data.productId});if(saved.error)throw new Error('Stock alert could not be saved.');}return {ok:true};
});
export const getRestockAlerts=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const r=await context.supabase.from('restock_subscriptions').select('product_id,notified_at').eq('user_id',context.userId);if(r.error)throw new Error('Stock alerts could not be loaded.');return r.data;});