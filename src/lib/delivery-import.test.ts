import { describe, expect, it } from 'vitest';
import { parseDeliveryCsv, DELIVERY_CSV_HEADER } from './delivery-import';

const csv = (...rows: string[]) => [DELIVERY_CSV_HEADER, ...rows].join('\n');

describe('delivery CSV import', () => {
  it('accepts a valid row and converts rupees to paise', () => {
    const r = parseDeliveryCsv(csv('462023,49,2,4,yes'));
    expect(r.errors).toEqual([]);
    expect(r.rules).toEqual([{ pincode: '462023', fee_paise: 4900, min_days: 2, max_days: 4, cod_enabled: true, active: true }]);
  });
  it('rejects PIN codes that are not 6 digits or start with 0', () => {
    expect(parseDeliveryCsv(csv('062023,49,2,4,yes')).rules).toHaveLength(0);
    expect(parseDeliveryCsv(csv('46202,49,2,4,yes')).rules).toHaveLength(0);
  });
  it('rejects duplicate PIN codes', () => {
    const r = parseDeliveryCsv(csv('462023,49,2,4,yes', '462023,0,1,2,no'));
    expect(r.rules).toHaveLength(1);
    expect(r.errors[0]).toContain('more than once');
  });
  it('rejects max days below min days', () => {
    expect(parseDeliveryCsv(csv('462023,49,5,2,yes')).errors).toHaveLength(1);
  });
  it('rejects a wrong header so nothing is guessed', () => {
    expect(parseDeliveryCsv('pin,fee\n462023,49').rules).toHaveLength(0);
  });
  it('keeps COD off when the owner says no', () => {
    expect(parseDeliveryCsv(csv('462023,0,1,3,no')).rules[0]!.cod_enabled).toBe(false);
  });
});
