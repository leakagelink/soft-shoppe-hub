import {createFileRoute} from '@tanstack/react-router';
import {z} from 'zod';
import {verifyPaymentSignature} from '@/lib/payment-verification';
export const Route=createFileRoute('/api/public/razorpay-webhook')({server:{handlers:{POST:async({request})=>{
  const secret=process.env['RAZORPAY_WEBHOOK_SECRET'];if(!secret)return new Response('Payment setup required',{status:503});
  if(Number(request.headers.get('content-length')??0)>65536)return new Response('Payload too large',{status:413});
  const body=await request.text();if(body.length>65536)return new Response('Payload too large',{status:413});
  if(!await verifyPaymentSignature(body,request.headers.get('x-razorpay-signature'),secret))return new Response('Invalid signature',{status:401});
  let payload:unknown;try{payload=JSON.parse(body)}catch{return new Response('Invalid payload',{status:400})}
  const parsed=z.object({event:z.string(),payload:z.object({payment:z.object({entity:z.object({id:z.string().min(1),order_id:z.string().min(1),amount:z.number().int().positive(),currency:z.literal('INR'),status:z.literal('captured')})})})}).safeParse(payload);
  if(!parsed.success){return new Response('Event not processed',{status:202});}
  if(parsed.data.event!=='payment.captured')return new Response('Event not processed',{status:202});
  const eventId=request.headers.get('x-razorpay-event-id');if(!eventId||eventId.length>200)return new Response('Event ID required',{status:400});
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const p=parsed.data.payload.payment.entity;
  const {error}=await supabaseAdmin.rpc('record_captured_payment',{_event:eventId,_provider_order:p.order_id,_payment:p.id,_amount:p.amount});
  if(error){console.error('Payment reconciliation failed',error.code);return new Response('Reconciliation required',{status:409});}
  return new Response('ok');
}}}});