DROP POLICY IF EXISTS catalogue_photo_read ON storage.objects;
ALTER TABLE public.order_requests DROP CONSTRAINT order_requests_user_id_fkey;
COMMENT ON COLUMN public.order_requests.user_id IS 'Owner UUID; anonymized to zero UUID on account deletion so retained refund evidence does not block deletion. No Auth foreign key.';
CREATE OR REPLACE FUNCTION public.prepare_account_deletion() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE u uuid:=auth.uid(); BEGIN
IF u IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
IF public.staff_has_role(ARRAY['owner','admin','operations','support','catalogue']) THEN RAISE EXCEPTION 'Staff must transfer responsibilities before deletion'; END IF;
PERFORM 1 FROM public.orders WHERE user_id=u ORDER BY id FOR UPDATE;
IF EXISTS(SELECT 1 FROM public.orders WHERE user_id=u AND status NOT IN ('cancelled','delivered','returned','refunded','failed')) OR EXISTS(SELECT 1 FROM public.orders WHERE user_id=u AND payment_method='COD' AND status IN ('delivered','returned') AND payment_status<>'paid') OR EXISTS(SELECT 1 FROM public.refunds r JOIN public.orders o ON o.id=r.order_id WHERE o.user_id=u AND r.status='pending') OR EXISTS(SELECT 1 FROM public.order_requests WHERE user_id=u AND status IN ('requested','approved')) THEN RAISE EXCEPTION 'Resolve active orders, collections and requests before deletion'; END IF;
DELETE FROM public.cart_items WHERE user_id=u; DELETE FROM public.wishlist WHERE user_id=u; DELETE FROM public.addresses WHERE user_id=u; DELETE FROM public.support_tickets WHERE user_id=u; DELETE FROM public.account_deletion_requests WHERE user_id=u;
DELETE FROM public.order_requests WHERE user_id=u AND id NOT IN(SELECT request_id FROM public.refunds);
UPDATE public.order_requests SET user_id='00000000-0000-0000-0000-000000000000',reason='Account deleted',staff_note=NULL WHERE user_id=u;
UPDATE public.orders SET user_id=NULL,address_snapshot=jsonb_build_object('deleted',true) WHERE user_id=u;
UPDATE public.profiles SET display_name='',phone=NULL,preferences='{}' WHERE id=u;
END $$;
REVOKE ALL ON FUNCTION public.prepare_account_deletion() FROM PUBLIC,anon; GRANT EXECUTE ON FUNCTION public.prepare_account_deletion() TO authenticated;
CREATE FUNCTION public.guard_cod_online_mutations() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF TG_TABLE_NAME='payments' THEN IF EXISTS(SELECT 1 FROM public.orders WHERE id=NEW.order_id AND payment_method='COD') THEN RAISE EXCEPTION 'COD orders cannot have online payment records'; END IF;
ELSE IF OLD.payment_method='COD' AND NEW.payment_method<>'COD' THEN RAISE EXCEPTION 'COD payment method cannot be changed'; END IF;
IF OLD.payment_method='COD' AND NEW.payment_status='paid' AND OLD.payment_status<>'paid' AND (NEW.cod_collected_at IS NULL OR coalesce(length(trim(NEW.cod_collection_reference)),0)<5 OR NEW.status<>'delivered') THEN RAISE EXCEPTION 'COD collection evidence required'; END IF;
END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.guard_cod_online_mutations() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER guard_cod_payment_record BEFORE INSERT OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.guard_cod_online_mutations();
CREATE TRIGGER guard_cod_payment_state BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.guard_cod_online_mutations();