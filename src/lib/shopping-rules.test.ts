import {describe,it,expect} from 'vitest';
import {reorderPlan,whatsappUrl} from './shopping-rules';
import type {Product} from './catalogue';
const product={id:'tee-m',status:'active',is_demo:false,price_paise:12000,available_quantity:3} as Product;
describe('shopping additions',()=>{
 it('reorders only available stock including existing quantities',()=>{expect(reorderPlan([{product_id:'tee-m',quantity:5}],[product],{'tee-m':1})).toEqual({quantities:{'tee-m':3},skipped:['tee-m']});});
 it('never reorders demo or missing products',()=>{expect(reorderPlan([{product_id:'tee-m',quantity:1},{product_id:'missing',quantity:1}],[{...product,is_demo:true}],{}).quantities).toEqual({});});
 it('keeps size and colour SKUs separate',()=>{expect(reorderPlan([{product_id:'tee-m',quantity:1},{product_id:'tee-l',quantity:2}],[product,{...product,id:'tee-l',price_paise:14000,available_quantity:2}],{}).quantities).toEqual({'tee-m':1,'tee-l':2});});
 it('requires a valid Indian WhatsApp business number',()=>{expect(whatsappUrl('','help')).toBeNull();expect(whatsappUrl('123','help')).toBeNull();expect(whatsappUrl('919876543210','Order help')).toBe('https://wa.me/919876543210?text=Order%20help');});
});