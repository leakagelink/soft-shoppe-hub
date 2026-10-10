export function stickyCartSummary(cart: Record<string, number>, products: {id: string; price_paise: number}[]) {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  return {
    count: entries.reduce((total, [, quantity]) => total + quantity, 0),
    subtotal: entries.reduce((total, [id, quantity]) => total + (products.find(product => product.id === id)?.price_paise ?? 0) * quantity, 0),
  };
}