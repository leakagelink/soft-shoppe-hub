CREATE OR REPLACE FUNCTION public.prepare_account_deletion()
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$ DECLARE u uuid:=auth.uid(); BEGIN
IF u IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
IF public.staff_has_role(ARRAY['owner','admin','operations','support','catalogue']) THEN RAISE EXCEPTION 'Staff must transfer responsibilities before deletion'; END IF;
PERFORM 1 FROM public.orders WHERE user_id=u ORDER BY id FOR UPDATE;
IF EXISTS(SELECT 1 FROM public.orders WHERE user_id=u AND status NOT IN ('cancelled','delivered','returned','refunded','failed')) OR EXISTS(SELECT 1 FROM public.orders WHERE user_id=u AND payment_method='COD' AND status IN ('delivered','returned') AND payment_status<>'paid') OR EXISTS(SELECT 1 FROM public.refunds r JOIN public.orders o ON o.id=r.order_id WHERE o.user_id=u AND r.status='pending') OR EXISTS(SELECT 1 FROM public.order_requests WHERE user_id=u AND status IN ('requested','approved')) THEN RAISE EXCEPTION 'Resolve active orders, collections and requests before deletion'; END IF;
DELETE FROM public.cart_items WHERE user_id=u; DELETE FROM public.wishlist WHERE user_id=u; DELETE FROM public.addresses WHERE user_id=u; DELETE FROM public.support_tickets WHERE user_id=u; DELETE FROM public.account_deletion_requests WHERE user_id=u;
DELETE FROM public.restock_subscriptions WHERE user_id=u; DELETE FROM public.notifications WHERE user_id=u;
UPDATE public.reviews SET body='' WHERE user_id=u;
DELETE FROM public.order_requests WHERE user_id=u AND id NOT IN(SELECT request_id FROM public.refunds);
UPDATE public.order_requests SET user_id='00000000-0000-0000-0000-000000000000',reason='Account deleted',staff_note=NULL WHERE user_id=u;
UPDATE public.orders SET user_id=NULL,address_snapshot=jsonb_build_object('deleted',true) WHERE user_id=u;
UPDATE public.profiles SET display_name='',phone=NULL,preferences='{}' WHERE id=u;
END $function$;