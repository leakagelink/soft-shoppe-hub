import { z } from 'zod';
export const cartSchema = z.array(z.object({ productId: z.string().min(1).max(100), quantity: z.number().int().min(1).max(20) })).max(100);
export const addressSchema = z.object({ name: z.string().trim().min(2).max(100), phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'), line1: z.string().trim().min(5).max(250), city: z.string().trim().min(2).max(100), state: z.string().trim().min(2).max(100), pincode: z.string().regex(/^[1-9]\d{5}$/, 'Enter a valid six-digit PIN code') });
export function calculateSubtotal(items: { productId: string; quantity: number }[], products: { id: string; price_paise: number }[]) {
  const validated = cartSchema.parse(items);
  const ids = new Set<string>();
  return validated.reduce((sum, item) => {
    if (ids.has(item.productId)) throw new Error('Duplicate cart item');
    ids.add(item.productId);
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error('A product is no longer available');
    return sum + product.price_paise * item.quantity;
  }, 0);
}