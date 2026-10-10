import { expect, it } from 'vitest';
import { stickyCartSummary } from './sticky-cart';
it('has no sticky cart items before adding a product', () => {
  expect(stickyCartSummary({}, []).count).toBe(0);
});
it('shows added items and updates subtotal with quantity', () => {
  expect(stickyCartSummary({tote: 2}, [{id: 'tote', price_paise: 69900}])).toEqual({count: 2, subtotal: 139800});
});
it('removes the sticky cart after the last item is removed', () => {
  expect(stickyCartSummary({tote: 0}, [{id: 'tote', price_paise: 69900}])).toEqual({count: 0, subtotal: 0});
});