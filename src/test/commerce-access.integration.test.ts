import {describe,it,expect} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import type {Database} from '@/integrations/supabase/types';

const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_PUBLISHABLE_KEY'];
describe.skipIf(!url||!key)('Live anonymous commerce boundaries',()=>{
 let sharedClient:ReturnType<typeof createClient<Database>>|undefined;
 function client(){
   if(!url||!key)throw new Error('Cloud test configuration missing');
   sharedClient??=createClient<Database>(url,key,{
     auth:{persistSession:false},
     global:{fetch:(input,init)=>{const h=new Headers(init?.headers);h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h})}},
   });
   return sharedClient;
 }
 it('does not expose customer addresses',async()=>{const r=await client().from('addresses').select('id').limit(1);expect(r.error!==null||r.data?.length===0).toBe(true)});
 it('does not expose private supplier costs',async()=>{const r=await client().from('supplier_products').select('cost_paise').limit(1);expect(r.error!==null||r.data?.length===0).toBe(true)});
 it('does not expose customer orders',async()=>{const r=await client().from('orders').select('id').limit(1);expect(r.error!==null||r.data?.length===0).toBe(true)});
 it('denies anonymous stock adjustments',async()=>{const r=await client().rpc('adjust_inventory',{_product:'access-test-not-a-product',_delta:1,_reason:'integration access test'});expect(r.error).not.toBeNull()});
 it('denies direct anonymous order creation',async()=>{const r=await client().rpc('reserve_customer_order',{_user:'00000000-0000-0000-0000-000000000000',_address:'00000000-0000-0000-0000-000000000000',_key:'00000000-0000-0000-0000-000000000000',_items:[]});expect(r.error).not.toBeNull()});
 it('denies forged payment capture calls',async()=>{const r=await client().rpc('record_captured_payment',{_event:'access-test',_provider_order:'not-a-provider-order',_payment:'not-a-payment',_amount:1});expect(r.error).not.toBeNull()});
 it('quotes COD only and blocks demo products',async()=>{const products=await client().from('products').select('id').eq('status','active').eq('is_demo',true).limit(1);const p=products.data?.[0];if(!p)throw new Error('Demo catalogue fixture required');const r=await client().rpc('quote_cod_order',{_items:[{productId:p.id,quantity:1}],_pincode:'400001',_coupon:''});expect(r.error).toBeNull();expect(r.data).toMatchObject({paymentMethod:'COD',purchasingEnabled:false,payable:null});});
 it('denies anonymous COD order creation',async()=>{const r=await client().rpc('place_cod_order',{_address:{},_items:[],_coupon:'',_key:'00000000-0000-0000-0000-000000000000',_expected:0});expect(r.error).not.toBeNull()});
 it('denies anonymous COD collection',async()=>{const r=await client().rpc('collect_cod',{_order:'00000000-0000-0000-0000-000000000000',_amount:1,_reference:'forged'});expect(r.error).not.toBeNull()});
 it('denies anonymous refund completion',async()=>{const r=await client().rpc('complete_cod_refund',{_id:'00000000-0000-0000-0000-000000000000',_reference:'forged'});expect(r.error).not.toBeNull()});
 it('denies anonymous account deletion',async()=>{const r=await client().rpc('prepare_account_deletion');expect(r.error).not.toBeNull()});
 it('does not expose supplier tasks',async()=>{const r=await client().from('supplier_tasks').select('id').limit(1);expect(r.error!==null||r.data?.length===0).toBe(true)});
 it('does not expose private notifications',async()=>{const r=await client().from('notifications').select('id').limit(1);expect(r.error!==null||r.data?.length===0).toBe(true)});
 it('denies anonymous verified-review creation',async()=>{const r=await client().from('reviews').insert({user_id:'00000000-0000-0000-0000-000000000000',product_id:'forged',order_item_id:'00000000-0000-0000-0000-000000000000',rating:5,body:'Forged review'});expect(r.error).not.toBeNull()});
 it('does not expose scheduled or inactive campaigns',async()=>{const r=await client().from('campaigns').select('active,starts_at,ends_at');expect(r.error).toBeNull();const now=Date.now();expect(r.data?.every(c=>c.active&&Date.parse(c.starts_at)<=now&&Date.parse(c.ends_at)>now)).toBe(true)});
 it('rejects an unknown coupon using authoritative prices',async()=>{const products=await client().from('products').select('id').eq('status','active').limit(1);const p=products.data?.[0];if(!p)throw new Error('Test requires one active catalogue product');const r=await client().rpc('preview_coupon',{_code:'NONEXISTENT_SECURITY_TEST_7A8C9',_items:[{productId:p.id,quantity:1}]});expect(r.error).toBeNull();expect(r.data).toEqual({valid:false,discount:0})});
});