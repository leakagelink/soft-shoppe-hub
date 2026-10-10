import {describe,it,expect} from 'vitest';
import {supplierMetrics} from './supplier-metrics';
describe('Supplier reporting',()=>{
 it('separates completed, failed, retried and overdue tasks without calling sales profit',()=>{expect(supplierMetrics([{id:'s',name:'Supplier'}],[{supplier_id:'s',status:'completed',attempts:0,due_at:'2026-01-01'},{supplier_id:'s',status:'failed',attempts:2,due_at:'2026-01-01'},{supplier_id:'s',status:'queued',attempts:0,due_at:'2027-01-01'}],Date.parse('2026-10-10'))).toEqual([{supplier:'Supplier',tasks:3,completed:1,failed:1,retries:2,overdue:1}])});
});