import {useQuery} from '@tanstack/react-query';
import {supabase} from '@/integrations/supabase/client';
export function DeletionStatus({userId}:{userId:string}){
  const q=useQuery({queryKey:['deletion-request',userId],queryFn:async()=>{const r=await supabase.from('account_deletion_requests').select('status,requested_at,blocked_reason').eq('user_id',userId).maybeSingle();if(r.error)throw r.error;return r.data;}});
  if(!q.data)return null;
  return <p className="setup-note mt-4" role="status">Deletion requested on {new Date(q.data.requested_at).toLocaleDateString('en-IN')}. Status: waiting for active orders, COD collection or refunds to finish. {q.data.blocked_reason} Your account will then be deleted within 30 days.</p>;
}
