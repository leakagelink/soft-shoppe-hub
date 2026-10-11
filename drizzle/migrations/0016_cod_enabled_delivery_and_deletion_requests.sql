DO $$ DECLARE d text; BEGIN
 d := pg_get_functiondef('public.quote_cod_order(jsonb,text,text)'::regprocedure);
 d := replace(d, 'WHERE pincode=_pincode AND active;', 'WHERE pincode=_pincode AND active AND cod_enabled;');
 IF position('AND active AND cod_enabled' in d)=0 THEN RAISE EXCEPTION 'quote patch failed'; END IF;
 EXECUTE d;
END $$;

CREATE OR REPLACE FUNCTION public.delivery_setup_status()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT jsonb_build_object('activeCodPincodes', count(*) FILTER (WHERE active AND cod_enabled), 'configured', count(*) FILTER (WHERE active AND cod_enabled) > 0) FROM public.shipping_rules
$$;
GRANT EXECUTE ON FUNCTION public.delivery_setup_status() TO anon, authenticated;

ALTER TABLE public.account_deletion_requests ADD COLUMN IF NOT EXISTS blocked_reason text;
ALTER TABLE public.account_deletion_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.request_account_deletion(_reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 INSERT INTO public.account_deletion_requests(user_id,status,requested_at,blocked_reason,updated_at)
 VALUES (auth.uid(),'awaiting_obligations',now(),left(coalesce(_reason,''),300),now())
 ON CONFLICT (user_id) DO UPDATE SET status='awaiting_obligations', blocked_reason=excluded.blocked_reason, updated_at=now();
END $$;
REVOKE EXECUTE ON FUNCTION public.request_account_deletion(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_account_deletion(text) TO authenticated;