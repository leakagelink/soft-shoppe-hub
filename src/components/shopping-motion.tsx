import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

/** Progressive enhancement: content stays visible without JavaScript. */
export function ShoppingMotion() {
  const path = useRouterState({ select: state => state.location.pathname });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const register = () => {
      document.querySelectorAll('main .home-section, main .product-card, main .category-tile, main .collection-band, main .closing-note').forEach(element => {
        if (!element.classList.contains('motion-revealed')) observer.observe(element);
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [path]);
  return null;
}