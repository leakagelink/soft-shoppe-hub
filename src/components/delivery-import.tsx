import {useState} from 'react';
import {useServerFn} from '@tanstack/react-start';
import {useQuery} from '@tanstack/react-query';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {importShippingRules,deliverySetupStatus} from '@/lib/operations.functions';
import {parseDeliveryCsv,DELIVERY_CSV_HEADER,type DeliveryImportResult} from '@/lib/delivery-import';

export function DeliveryImport({onSaved}:{onSaved:()=>void}){
  const save=useServerFn(importShippingRules);const statusFn=useServerFn(deliverySetupStatus);
  const status=useQuery({queryKey:['delivery-status'],queryFn:()=>statusFn()});
  const [text,setText]=useState('');const [preview,setPreview]=useState<DeliveryImportResult|null>(null);const [busy,setBusy]=useState(false);
  const configured=status.data?.configured;
  return <section className="mb-6 rounded-lg border border-border bg-card p-5">
    <p className={configured?'text-sm font-semibold text-brand':'text-sm font-semibold text-destructive'}>
      {status.isLoading?'Checking delivery setup…':configured?`Checkout is open for ${status.data?.activeCodPincodes} verified COD PIN code(s).`:'Checkout is closed: no verified COD PIN codes yet.'}
    </p>
    <h3 className="mt-4 font-semibold">Import verified delivery PIN codes</h3>
    <p className="mt-1 text-xs text-muted-foreground">Only add PIN codes your courier has confirmed. One row per PIN. First line must be: <code>{DELIVERY_CSV_HEADER}</code></p>
    <textarea aria-label="Delivery CSV" className="store-input mt-3 min-h-32 font-mono text-xs" placeholder={`${DELIVERY_CSV_HEADER}\n<PIN>,<fee in ₹>,<min days>,<max days>,yes`} value={text} onChange={e=>{setText(e.target.value);setPreview(null)}}/>
    <div className="mt-3 flex flex-wrap gap-2">
      <label className="inline-flex cursor-pointer items-center rounded-md border border-border px-3 py-2 text-sm">Choose CSV file<input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e=>{const f=e.target.files?.[0];if(f){if(f.size>200000){toast.error('File too large');return;}setText(await f.text());setPreview(null)}}}/></label>
      <Button variant="outline" onClick={()=>setPreview(parseDeliveryCsv(text))}>Check rows</Button>
      <Button disabled={busy||!preview||preview.errors.length>0||!preview.rules.length} onClick={async()=>{if(!preview)return;setBusy(true);try{const r=await save({data:{rules:preview.rules}});toast.success(`${r.saved} delivery rules saved`);setText('');setPreview(null);status.refetch();onSaved()}catch(err){toast.error(err instanceof Error?err.message:'Import failed')}finally{setBusy(false)}}}>Save {preview?.rules.length??0} rules</Button>
    </div>
    {preview&&<div className="mt-3 text-xs">{preview.errors.length?<ul className="list-disc pl-5 text-destructive">{preview.errors.slice(0,20).map(e=><li key={e}>{e}</li>)}</ul>:<p className="text-brand">{preview.rules.length} rows valid. Fix nothing — ready to save.</p>}</div>}
  </section>;
}
