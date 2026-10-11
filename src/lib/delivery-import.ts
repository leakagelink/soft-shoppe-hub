// Parses an owner-supplied CSV of verified delivery rules. Nothing is invented:
// every row must be explicit, and invalid rows are reported instead of guessed.
export type DeliveryRule = { pincode: string; fee_paise: number; min_days: number; max_days: number; cod_enabled: boolean; active: boolean };
export type DeliveryImportResult = { rules: DeliveryRule[]; errors: string[] };

export const DELIVERY_CSV_HEADER = 'pincode,shipping_fee_rupees,min_days,max_days,cod_enabled';
export const MAX_IMPORT_ROWS = 2000;

const yes = new Set(['yes', 'y', 'true', '1']);
const no = new Set(['no', 'n', 'false', '0']);

export function parseDeliveryCsv(text: string): DeliveryImportResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];
  const rules: DeliveryRule[] = [];
  if (!lines.length) return { rules, errors: ['The file is empty.'] };
  const header = lines[0]!.toLowerCase().replace(/\s/g, '');
  if (header !== DELIVERY_CSV_HEADER) return { rules, errors: [`First line must be exactly: ${DELIVERY_CSV_HEADER}`] };
  const body = lines.slice(1);
  if (!body.length) return { rules, errors: ['No delivery rows found below the header.'] };
  if (body.length > MAX_IMPORT_ROWS) return { rules, errors: [`Import at most ${MAX_IMPORT_ROWS} rows at a time.`] };
  const seen = new Set<string>();
  body.forEach((line, i) => {
    const row = i + 2;
    const cells = line.split(',').map((c) => c.trim());
    if (cells.length !== 5) { errors.push(`Row ${row}: expected 5 values, found ${cells.length}.`); return; }
    const [pin, fee, min, max, cod] = cells as [string, string, string, string, string];
    if (!/^[1-9]\d{5}$/.test(pin)) { errors.push(`Row ${row}: "${pin}" is not a valid 6-digit Indian PIN code.`); return; }
    if (seen.has(pin)) { errors.push(`Row ${row}: PIN ${pin} appears more than once.`); return; }
    if (!/^\d+(\.\d{1,2})?$/.test(fee) || Number(fee) > 10000) { errors.push(`Row ${row}: shipping fee must be rupees between 0 and 10000.`); return; }
    if (!/^\d+$/.test(min) || !/^\d+$/.test(max)) { errors.push(`Row ${row}: delivery days must be whole numbers.`); return; }
    const minD = Number(min), maxD = Number(max);
    if (minD < 1 || maxD > 60 || maxD < minD) { errors.push(`Row ${row}: delivery days must be 1–60 and max ≥ min.`); return; }
    const c = cod.toLowerCase();
    if (!yes.has(c) && !no.has(c)) { errors.push(`Row ${row}: cod_enabled must be yes or no.`); return; }
    seen.add(pin);
    rules.push({ pincode: pin, fee_paise: Math.round(Number(fee) * 100), min_days: minD, max_days: maxD, cod_enabled: yes.has(c), active: true });
  });
  return { rules, errors };
}
