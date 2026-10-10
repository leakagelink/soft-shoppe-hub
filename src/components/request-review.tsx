import {useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';
export function RequestReview({id,onSaved}:{id:string;onSaved:()=>void}){
 const [busy,setBusy]=useState(false);
 return <form className="mt-3 flex min-w-64 flex-wrap gap-2" onSubmit={async e=>{e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);try{const {error}=await supabase.rpc('review_order_request',{_id:id,_status:String(form.get('status')),_note:String(form.get('note'))});if(error)throw new Error('Request review denied or already processed');toast.success('Review recorded; no refund has been issued');onSaved()}catch(err){toast.error(err instanceof Error?err.message:'Review failed')}finally{setBusy(false)}}}><select aria-label="Request decision" name="status" className="store-input"><option value="approved">Approve request</option><option value="rejected">Reject request</option></select><input className="store-input" name="note" aria-label="Review explanation" placeholder="Review explanation" minLength={5} maxLength={1000} required/><Button type="submit" disabled={busy}>Record decision</Button></form>;
}
export function TicketStatus({id,status,onSaved}:{id:string;status:string;onSaved:()=>void}){
 const [busy,setBusy]=useState(false);
 return <select className="store-input" aria-label="Support ticket status" value={status} disabled={busy} onChange={async e=>{setBusy(true);const {error}=await supabase.rpc('update_support_ticket',{_id:id,_status:e.target.value});if(error)toast.error('Ticket update denied');else{toast.success('Ticket updated');onSaved()}setBusy(false)}}><option value="open">Open</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select>;
}