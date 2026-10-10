export async function verifyPaymentSignature(body: string, signature: string | null, secret: string) {
  if (!signature || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const bytes = Uint8Array.from(signature.match(/.{2}/g) ?? [], value => parseInt(value, 16));
  return crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(body));
}