// @vitest-environment node
import {describe,it,expect} from 'vitest';
import {Client} from 'pg';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
const connectionString=process.env['SUPABASE_DB_URL'];
const url=process.env['SUPABASE_URL'];const adminKey=process.env['SUPABASE_SERVICE_ROLE_KEY'];
describe.skipIf(!connectionString||!url||!adminKey)('Rolled-back COD transactions',()=>{
 it('quotes COD, applies coupon, commits stock once, denies over-selling and protects unpaid collection',async()=>{
  if(!url||!adminKey)throw new Error('Test configuration unavailable');
  const admin=createClient(url,adminKey,{auth:{persistSession:false}});const created=await admin.auth.admin.createUser({email:`cod-test-${randomUUID()}@example.invalid`,password:randomUUID()+randomUUID(),email_confirm:true});const uid=created.data.user?.id;if(!uid)throw new Error('Isolated test account could not be created');
  const db=new Client({connectionString,ssl:{rejectUnauthorized:false}});await db.connect();
  try{await db.query('BEGIN');
   await db.query("SELECT set_config('request.jwt.claim.sub',$1,true)",[uid]);
   const product=`test-${randomUUID()}`;const pin='999991';
   await db.query("INSERT INTO public.products(id,name,sku,price_paise,image_key,status,is_demo,tax_bps,tax_inclusive) VALUES($1,'COD test item',$1,10000,'lamp','active',false,1800,false)",[product]);
   await db.query('INSERT INTO public.inventory(product_id,quantity,reserved) VALUES($1,1,0)',[product]);
   await db.query("INSERT INTO public.shipping_rules(pincode,fee_paise,min_days,max_days,active,cod_enabled) VALUES($1,1000,2,5,true,true) ON CONFLICT(pincode) DO UPDATE SET fee_paise=1000,active=true",[pin]);
   const code=`TEST${randomUUID().replaceAll('-','').slice(0,12)}`;
   await db.query("INSERT INTO public.coupons(code,percent,max_discount_paise,starts_at,ends_at,active) VALUES($1,10,2000,now()-interval '1 day',now()+interval '1 day',true)",[code]);
   const items=JSON.stringify([{productId:product,quantity:1}]);
   const quoted=await db.query('SELECT public.quote_cod_order($1::jsonb,$2,$3) AS q',[items,pin,code]);
   expect(quoted.rows[0].q).toMatchObject({paymentMethod:'COD',subtotal:10000,discount:1000,tax:1620,shipping:1000,payable:11620,purchasingEnabled:true});
   const address=JSON.stringify({name:'Test Customer',phone:'9876543210',line1:'123 Test Street',city:'Test City',state:'Test State',pincode:pin});const key=randomUUID();
   const placed=await db.query('SELECT public.place_cod_order($1::jsonb,$2::jsonb,$3,$4,11620) AS id',[address,items,code,key]);const id=placed.rows[0].id;
   const retry=await db.query('SELECT public.place_cod_order($1::jsonb,$2::jsonb,$3,$4,11620) AS id',[address,items,code,key]);expect(retry.rows[0].id).toBe(id);
   const order=await db.query('SELECT payment_method,payment_status,total_paise,status FROM public.orders WHERE id=$1',[id]);expect(order.rows[0]).toEqual({payment_method:'COD',payment_status:'pending',total_paise:11620,status:'confirmed'});
   const stock=await db.query('SELECT quantity,reserved FROM public.inventory WHERE product_id=$1',[product]);expect(stock.rows[0]).toEqual({quantity:0,reserved:0});
   const exhausted=await db.query('SELECT public.quote_cod_order($1::jsonb,$2,\'\') AS q',[items,pin]);expect(exhausted.rows[0].q.purchasingEnabled).toBe(false);
   await db.query('SAVEPOINT denied');let denied=false;try{await db.query('SELECT public.place_cod_order($1::jsonb,$2::jsonb,\'\',$3,12800)',[address,items,randomUUID()])}catch{denied=true;await db.query('ROLLBACK TO SAVEPOINT denied')}expect(denied).toBe(true);
   await db.query('SAVEPOINT collection');denied=false;try{await db.query("SELECT public.collect_cod($1,11620,'test-collection')",[id])}catch{denied=true;await db.query('ROLLBACK TO SAVEPOINT collection')}expect(denied).toBe(true);
  }finally{await db.query('ROLLBACK');await db.end();await admin.auth.admin.deleteUser(uid)}
 },20000);
});