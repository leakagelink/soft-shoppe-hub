CREATE OR REPLACE FUNCTION public.check_delivery(_pincode text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$ DECLARE s public.shipping_rules; BEGIN IF _pincode !~ '^[1-9][0-9]{5}$' THEN RAISE EXCEPTION 'Invalid PIN'; END IF; SELECT * INTO s FROM public.shipping_rules WHERE pincode=_pincode AND active; IF NOT FOUND THEN RETURN jsonb_build_object('serviceable',false,'cod_enabled',false); END IF; RETURN jsonb_build_object('serviceable',s.cod_enabled,'fee_paise',s.fee_paise,'min_days',s.min_days,'max_days',s.max_days,'cod_enabled',s.cod_enabled); END $function$;

DO $$ DECLARE d text; BEGIN
 d := pg_get_functiondef('public.reserve_customer_order(uuid,uuid,jsonb,uuid)'::regprocedure);
 d := replace(d, 'WHERE pincode=a.pincode AND active;', 'WHERE pincode=a.pincode AND active AND cod_enabled;');
 IF position('AND active AND cod_enabled' in d)=0 THEN RAISE EXCEPTION 'patch failed'; END IF;
 EXECUTE d;
END $$;