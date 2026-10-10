import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {addressSchema,cartSchema} from './commerce-rules';
import {createClient} from '@supabase/supabase-js';
import type {Database} from '@/integrations/supabase/types';

export const codQuoteSchema=z.object({subtotal:z.number(),discount:z.number(),tax:z.number(),shipping:z.number().nullable(),payable:z.number().nullable(),purchasingEnabled:z.boolean(),paymentMethod:z.literal('COD'),reason:z.string().nullable(),minDays:z.number().nullable(),maxDays:z.number().nullable()});
export const getCodQuote=createServerFn({method:'POST'}).inputValidator((input)=>z.object({items:cartSchema.min(1),pincode:z.string().regex(/^[1-9]\d{5}$/),coupon:z.string().trim().max(40).default('')}).parse(input)).handler(async({data})=>{
 const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_PUBLISHABLE_KEY'];if(!url||!key)throw new Error('Delivery quote unavailable');
 const db=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers);if(key.startsWith('sb_'))headers.delete('Authorization');headers.set('apikey',key);return fetch(input,{...init,headers})}}});
 const r=await db.rpc('quote_cod_order',{_items:data.items,_pincode:data.pincode,_coupon:data.coupon});if(r.error)throw new Error('Could not quote this order. Check product availability and coupon eligibility.');return codQuoteSchema.parse(r.data);
});
export const placeCodOrder=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input)=>z.object({address:addressSchema,items:cartSchema.min(1),coupon:z.string().trim().max(40),key:z.string().uuid(),expected:z.number().int().nonnegative(),paymentMethod:z.literal('COD')}).parse(input)).handler(async({data,context})=>{
 const r=await context.supabase.rpc('place_cod_order',{_address:data.address,_items:data.items,_coupon:data.coupon,_key:data.key,_expected:data.expected});if(r.error)throw new Error('Order could not be placed. Review prices, stock and delivery again before retrying.');return {id:r.data};
});
export const deleteCustomerAccount=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input)=>z.object({confirmation:z.literal('DELETE')}).parse(input)).handler(async({context})=>{
 const prepared=await context.supabase.rpc('prepare_account_deletion');if(prepared.error)throw new Error('Resolve active orders, COD collections, refunds or requests before deleting your account. Staff accounts require an administrator.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const result=await supabaseAdmin.auth.admin.deleteUser(context.userId,true);if(result.error)throw new Error('Account deletion could not finish. Your personal profile was cleared; please retry or contact support.');
 return {ok:true};
});