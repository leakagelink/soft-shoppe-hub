// @vitest-environment node
import {describe,it,expect} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];const publicKey=process.env['SUPABASE_PUBLISHABLE_KEY'];
describe.skipIf(!url||!key||!publicKey)('Isolated COD customer and staff flows',()=>{
 it('prevents overselling, isolates customers, collects and refunds COD, and anonymizes deletion',async()=>{
  if(!url||!key||!publicKey)throw new Error('Test configuration unavailable');
  const admin=createClient(url,key,{auth:{persistSession:false}});const users:string[]=[];const orders:string[]=[];const product='test-'+randomUUID();const pin='999992';let shippingId:string|undefined;
  const required=<R extends {data:unknown;error:unknown}>(r:R):NonNullable<R['data']>=>{if(r.error)throw new Error('Fixture operation failed');return r.data as NonNullable<R['data']>};
  const clients=[];
  try{
   for(let i=0;i<3;i++){const password=randomUUID()+randomUUID();const email=`commerce-${randomUUID()}@example.invalid`;const created=required(await admin.auth.admin.createUser({email,password,email_confirm:true}));if(!created.user)throw new Error('Test account missing');users.push(created.user.id);const client=createClient(url,publicKey,{auth:{persistSession:false}});required(await client.auth.signInWithPassword({email,password}));clients.push(client)}
   const [a,b,staff]=clients;if(!a||!b||!staff)throw new Error('Clients unavailable');
   required(await admin.from('user_roles').insert({user_id:users[2],role:'admin'}));
   required(await admin.from('products').insert({id:product,name:'Isolated test',sku:product,price_paise:10000,image_key:'lamp',status:'active',is_demo:false,tax_bps:1800,tax_inclusive:false,return_days:7}));
   required(await admin.from('inventory').insert({product_id:product,quantity:1,reserved:0}));
   const existing=required(await admin.from('shipping_rules').select('*').eq('pincode',pin));if(existing.length)throw new Error('Reserved test PIN already exists');
   shippingId=required(await admin.from('shipping_rules').insert({pincode:pin,fee_paise:1000,min_days:2,max_days:5,active:true,cod_enabled:true}).select('id').single()).id;
   const address={name:'Isolated Test',phone:'9876543210',line1:'123 Test Street',city:'Test City',state:'Test State',pincode:pin};const items=[{productId:product,quantity:1}];const idempotency=randomUUID();
   expect(required(await a.rpc('quote_cod_order',{_items:items,_pincode:pin,_coupon:''}))).toMatchObject({paymentMethod:'COD',subtotal:10000,tax:1800,shipping:1000,payable:12800});
   const race=await Promise.all([a.rpc('place_cod_order',{_address:address,_items:items,_coupon:'',_key:idempotency,_expected:12800}),b.rpc('place_cod_order',{_address:address,_items:items,_coupon:'',_key:randomUUID(),_expected:12800})]);
   for(const r of race)if(r.data)orders.push(r.data);
   expect(race.filter(r=>!r.error)).toHaveLength(1);expect(race.filter(r=>r.error)).toHaveLength(1);
   const winningIndex=race[0]?.error?1:0;const winner=clients[winningIndex];const loser=clients[1-winningIndex];const id=orders[0];if(!winner||!loser||!id)throw new Error('Winning fixture missing');
   if(winningIndex===0)expect(required(await a.rpc('place_cod_order',{_address:address,_items:items,_coupon:'',_key:idempotency,_expected:12800}))).toBe(id);
   expect(required(await admin.from('inventory').select('quantity,reserved').eq('product_id',product).single())).toEqual({quantity:0,reserved:0});
   expect(required(await loser.from('orders').select('id').eq('id',id))).toEqual([]);
   expect((await loser.rpc('collect_cod',{_order:id,_amount:12800,_reference:'forged-reference'})).error).not.toBeNull();
   const fulfillment=required(await admin.from('fulfillments').select('id').eq('order_id',id).single());
   required(await staff.rpc('update_fulfillment',{_id:fulfillment.id,_status:'shipped',_carrier:'Test Carrier',_tracking:'TEST123',_url:''}));
   required(await staff.rpc('update_fulfillment',{_id:fulfillment.id,_status:'delivered',_carrier:'Test Carrier',_tracking:'TEST123',_url:''}));
   expect((await staff.rpc('collect_cod',{_order:id,_amount:1,_reference:'test-reference'})).error).not.toBeNull();
   required(await staff.rpc('collect_cod',{_order:id,_amount:12800,_reference:'test-'+randomUUID()}));
   const item=required(await admin.from('order_items').select('id').eq('order_id',id).single());
   expect((await loser.from('reviews').insert({user_id:users[1-winningIndex],product_id:product,order_item_id:item.id,rating:5,body:'Not my purchase'})).error).not.toBeNull();
   required(await winner.from('reviews').insert({user_id:users[winningIndex],product_id:product,order_item_id:item.id,rating:4,body:'Isolated verified review'}));
   expect((await winner.from('reviews').insert({user_id:users[winningIndex],product_id:product,order_item_id:item.id,rating:5,body:'Duplicate review'})).error).not.toBeNull();
   const request=required(await winner.rpc('request_order_action',{_order:id,_kind:'return',_reason:'Full order return test'}));
   required(await staff.rpc('review_order_request',{_id:request,_status:'approved',_note:'Return inspected and approved'}));
   expect((await winner.rpc('prepare_account_deletion')).error).not.toBeNull();
   required(await staff.rpc('complete_cod_request',{_request:request,_note:'Entire order received back'}));
   const refund=required(await admin.from('refunds').select('id,amount_paise').eq('order_id',id).single());expect(refund.amount_paise).toBe(12800);
   required(await staff.rpc('complete_cod_refund',{_id:refund.id,_reference:'test-transfer-'+randomUUID()}));
   expect(required(await admin.from('orders').select('status').eq('id',id).single()).status).toBe('refunded');
   expect((await winner.rpc('prepare_account_deletion')).error).toBeNull();
   expect(required(await admin.from('orders').select('user_id,address_snapshot,total_paise').eq('id',id).single())).toEqual({user_id:null,address_snapshot:{deleted:true},total_paise:12800});
   expect((await admin.auth.admin.deleteUser(users[winningIndex]??'')).error).toBeNull();
  }finally{
   // Remove only exact fixture IDs, in reverse foreign-key order. No business rows are touched.
   if(orders.length){await admin.from('reviews').delete().eq('product_id',product);await admin.from('notifications').delete().in('order_id',orders);const fs=await admin.from('fulfillments').select('id').in('order_id',orders);if(fs.data?.length)await admin.from('supplier_tasks').delete().in('fulfillment_id',fs.data.map(f=>f.id));await admin.from('refunds').delete().in('order_id',orders);await admin.from('order_requests').delete().in('order_id',orders);await admin.from('fulfillments').delete().in('order_id',orders);await admin.from('order_items').delete().in('order_id',orders);await admin.from('orders').delete().in('id',orders)}
   await admin.from('inventory_movements').delete().eq('product_id',product);await admin.from('inventory').delete().eq('product_id',product);await admin.from('products').delete().eq('id',product);if(shippingId)await admin.from('shipping_rules').delete().eq('id',shippingId);
   for(const uid of users){await admin.from('addresses').delete().eq('user_id',uid);await admin.auth.admin.deleteUser(uid)}
  }
 },60000);
});