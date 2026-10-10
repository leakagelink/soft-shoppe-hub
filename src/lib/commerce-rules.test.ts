import {describe,it,expect} from 'vitest';
import {addressSchema,calculateSubtotal,cartSchema} from './commerce-rules';
describe('Commerce security rules',()=>{
 it('uses catalogue prices instead of submitted prices',()=>{expect(calculateSubtotal([{productId:'a',quantity:2}],[{id:'a',price_paise:199900}])).toBe(399800)});
 it('rejects unavailable product IDs',()=>{expect(()=>calculateSubtotal([{productId:'missing',quantity:1}],[])).toThrow('no longer available')});
 it('rejects duplicate rows rather than allowing limits to be bypassed',()=>{expect(()=>calculateSubtotal([{productId:'a',quantity:15},{productId:'a',quantity:15}],[{id:'a',price_paise:100}])).toThrow('Duplicate')});
 it('rejects invalid quantities',()=>{expect(cartSchema.safeParse([{productId:'a',quantity:0}]).success).toBe(false)});
 it('requires a valid six-digit Indian PIN',()=>{expect(addressSchema.safeParse({name:'Test User',phone:'9876543210',line1:'123 Test Street',city:'Mumbai',state:'Maharashtra',pincode:'012345'}).success).toBe(false)});
 it('requires a valid Indian mobile number',()=>{expect(addressSchema.safeParse({name:'Test User',phone:'1234567890',line1:'123 Test Street',city:'Mumbai',state:'Maharashtra',pincode:'400001'}).success).toBe(false)});
});