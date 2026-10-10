import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {PDFDocument,StandardFonts} from 'pdf-lib';

export const downloadOrderReceipt=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input)=>z.object({id:z.string().uuid()}).parse(input)).handler(async({data,context})=>{
 const order=await context.supabase.from('orders').select('*').eq('id',data.id).eq('user_id',context.userId).single();if(order.error)throw new Error('Order unavailable');
 const items=await context.supabase.from('order_items').select('*').eq('order_id',data.id);if(items.error)throw new Error('Order receipt unavailable');
 const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);let page=doc.addPage([595,842]);let y=790;
 const line=(text:string,size=11)=>{if(y<50){page=doc.addPage([595,842]);y=790;}page.drawText(text.replace(/[^\x20-\x7E]/g,'?'),{x:45,y,size,font,maxWidth:505});y-=size+13};
 const amount=(n:number)=>`INR ${(n/100).toFixed(2)}`;
 line('little things - ORDER RECEIPT',20);line('Not a GST tax invoice. Seller registration details await verification.',9);line(`Order: ${order.data.id}`);line(`Date: ${new Date(order.data.created_at).toISOString().slice(0,10)}`);line(`Payment method: ${order.data.payment_method} / status: ${order.data.payment_status}`);line(`Order status: ${order.data.status}`);line('');
 for(const item of items.data??[]){line(item.name.slice(0,80));line(`${item.sku} | Qty ${item.quantity} | ${amount(item.unit_price_paise*item.quantity)}`,10)}
 line('');line(`Items: ${amount(order.data.subtotal_paise)}`);line(`Discount: ${amount(order.data.discount_paise)}`);line(`Shipping: ${amount(order.data.shipping_paise)}`);line(`Additional tax: ${amount(order.data.tax_paise)}`);line(`Total: ${amount(order.data.total_paise)}`,15);line(order.data.payment_status==='paid'?'Collection recorded.':'Cash due on delivery; this document is not proof of payment.',10);
 return {base64:await doc.saveAsBase64(),filename:`order-${data.id.slice(0,8)}.pdf`};
});