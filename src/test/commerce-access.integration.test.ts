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
 it('rejects an unknown coupon using authoritative prices',async()=>{const products=await client().from('products').select('id').eq('status','active').limit(1);const p=products.data?.[0];if(!p)throw new Error('Test requires one active catalogue product');const r=await client().rpc('preview_coupon',{_code:'NONEXISTENT_SECURITY_TEST_7A8C9',_items:[{productId:p.id,quantity:1}]});expect(r.error).toBeNull();expect(r.data).toEqual({valid:false,discount:0})});
});