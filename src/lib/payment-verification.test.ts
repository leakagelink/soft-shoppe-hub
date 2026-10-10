import {describe,it,expect} from 'vitest';
import {verifyPaymentSignature} from './payment-verification';
describe('Payment webhook signature boundary',()=>{
  const body='{"event":"payment.captured"}';const secret='test-only-signing-fixture';
  async function sign(){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body)));return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
  it('accepts an authentic raw-body signature',async()=>{expect(await verifyPaymentSignature(body,await sign(),secret)).toBe(true)});
  it('rejects a modified body',async()=>{expect(await verifyPaymentSignature(body+' ',await sign(),secret)).toBe(false)});
  it('rejects missing and malformed signatures',async()=>{expect(await verifyPaymentSignature(body,null,secret)).toBe(false);expect(await verifyPaymentSignature(body,'bad',secret)).toBe(false)});
  it('rejects a different signing key',async()=>{expect(await verifyPaymentSignature(body,await sign(),'different-test-key')).toBe(false)});
});