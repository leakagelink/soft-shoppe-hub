import type { Product } from './catalogue';
export function reorderPlan(items:{product_id:string;quantity:number}[],products:Product[],cart:Record<string,number>){
 const quantities:Record<string,number>={};const skipped:string[]=[];
 for(const item of items){const p=products.find(p=>p.id===item.product_id);const limit=Math.min(20,p?.available_quantity??0);const current=quantities[item.product_id]??cart[item.product_id]??0;const next=Math.min(limit,current+item.quantity);if(!p||p.is_demo||p.status!=='active'||next<=current){skipped.push(item.product_id);continue;}quantities[item.product_id]=next;if(next<current+item.quantity)skipped.push(item.product_id);}
 return {quantities,skipped};
}
export function whatsappUrl(number:string,message:string){return /^91[6-9]\d{9}$/.test(number)?`https://wa.me/${number}?text=${encodeURIComponent(message.slice(0,1000))}`:null;}