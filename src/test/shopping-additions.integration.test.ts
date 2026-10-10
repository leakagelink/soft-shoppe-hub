// @vitest-environment node
import {describe,it,expect} from 'vitest';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
const url=process.env['SUPABASE_URL'];const key=process.env['SUPABASE_SERVICE_ROLE_KEY'];const publicKey=process.env['SUPABASE_PUBLISHABLE_KEY'];
describe.skipIf(!url||!key||!publicKey)('Shopping options and restock security',()=>{
 it('isolates subscriptions, sends one stock notification and quotes independent option prices',async()=>{
  if(!url||!key||!publicKey)throw new Error('Test configuration missing');
  const admin=createClient(url,key,{auth:{persistSession:false}});const ids:string[]=[];const products=['test-'+randomUUID(),'test-'+randomUUID()];const family='test-'+randomUUID();const clients=[];
  const required=<T extends {data:unknown;error:unknown}>(r:T):NonNullable<T['data']>=>{if(r.error)throw new Error('Fixture operation failed');return r.data as NonNullable<T['data']>};
  try{
   for(let i=0;i<2;i++){const email=`shopping-${randomUUID()}@example.invalid`;const password=randomUUID()+randomUUID();const u=required(await admin.auth.admin.createUser({email,password,email_confirm:true}));if(!u.user)throw new Error('Test user missing');ids.push(u.user.id);const db=createClient(url,publicKey,{auth:{persistSession:false}});required(await db.auth.signInWithPassword({email,password}));clients.push(db)}
   const [a,b]=clients;const [small,large]=products;if(!a||!b||!small||!large||!ids[0])throw new Error('Fixtures missing');
   required(await admin.from('products').insert([{id:small,name:'Test tee M Blue',sku:small,price_paise:10000,image_key:'tote',status:'active',is_demo:false,tax_bps:0,tax_inclusive:true,family_key:family,option_name:'M · Blue'},{id:large,name:'Test tee L Blue',sku:large,price_paise:14000,image_key:'tote',status:'active',is_demo:false,tax_bps:0,tax_inclusive:true,family_key:family,option_name:'L · Blue'}]));
   required(await admin.from('inventory').insert([{product_id:small,quantity:0,reserved:0},{product_id:large,quantity:2,reserved:0}]));
   required(await a.from('restock_subscriptions').insert({user_id:ids[0],product_id:small}));
   expect(required(await b.from('restock_subscriptions').select('*').eq('user_id',ids[0]))).toEqual([]);
   expect((await b.from('restock_subscriptions').insert({user_id:ids[0],product_id:large})).error).not.toBeNull();
   expect((await a.from('store_contacts').upsert({id:'store',whatsapp_number:'919876543210'})).error).not.toBeNull();
   const availability=required(await a.rpc('shopping_availability'));expect(availability.find((p:{product_id:string})=>p.product_id===small)).toMatchObject({available_quantity:0});expect(availability.find((p:{product_id:string})=>p.product_id===large)).toMatchObject({available_quantity:2});
   expect(required(await a.rpc('preview_coupon',{_code:'UNKNOWN_TEST',_items:[{productId:small,quantity:1},{productId:large,quantity:1}]}))).toEqual({valid:false,discount:0});
   required(await admin.from('inventory').update({quantity:1}).eq('product_id',small));
   const notification=required(await a.from('notifications').select('id,title').eq('user_id',ids[0]).eq('title','Back in stock'));expect(notification).toHaveLength(1);
   required(await admin.from('inventory').update({quantity:2}).eq('product_id',small));
   expect(required(await a.from('notifications').select('id').eq('user_id',ids[0]).eq('title','Back in stock'))).toHaveLength(1);
   expect(required(await b.from('notifications').select('id').eq('user_id',ids[0]))).toEqual([]);
   const options=required(await a.from('products').select('id,price_paise,option_name').eq('family_key',family));expect(options.find((p:{id:string})=>p.id===small)).toMatchObject({price_paise:10000,option_name:'M · Blue'});expect(options.find((p:{id:string})=>p.id===large)).toMatchObject({price_paise:14000,option_name:'L · Blue'});
  }finally{
   for(const uid of ids){await admin.from('notifications').delete().eq('user_id',uid);await admin.from('restock_subscriptions').delete().eq('user_id',uid);await admin.auth.admin.deleteUser(uid)}
   await admin.from('inventory').delete().in('product_id',products);await admin.from('products').delete().in('id',products);
  }
 },60000);
});