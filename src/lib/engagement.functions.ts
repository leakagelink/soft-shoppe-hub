import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
export const submitReview=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({productId:z.string().min(1),itemId:z.string().uuid(),rating:z.number().int().min(1).max(5),body:z.string().trim().min(5).max(2000)}).parse(input)).handler(async({data,context})=>{
 const result=await context.supabase.from('reviews').insert({product_id:data.productId,order_item_id:data.itemId,user_id:context.userId,rating:data.rating,body:data.body});if(result.error)throw new Error('Only a collected, delivered purchase can be reviewed once.');return {ok:true};
});
export const reviewPurchases=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({productId:z.string().min(1)}).parse(input)).handler(async({data,context})=>{
 const orders=await context.supabase.from('orders').select('id').eq('user_id',context.userId).eq('status','delivered').eq('payment_status','paid');if(orders.error)throw new Error('Purchases unavailable');
 if(!orders.data.length)return [];
 const items=await context.supabase.from('order_items').select('id,name').eq('product_id',data.productId).in('order_id',orders.data.map(o=>o.id));if(items.error)throw new Error('Purchases unavailable');return items.data;
});