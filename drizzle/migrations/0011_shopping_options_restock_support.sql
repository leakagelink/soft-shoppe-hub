ALTER TABLE public.products ADD COLUMN family_key text, ADD COLUMN option_name text;
CREATE INDEX products_family_key_idx ON public.products(family_key) WHERE family_key IS NOT NULL;
CREATE TABLE public.store_contacts (id text PRIMARY KEY DEFAULT 'store' CHECK (id = 'store'), whatsapp_number text NOT NULL DEFAULT '' CHECK (whatsapp_number = '' OR whatsapp_number ~ '^91[6-9][0-9]{9}$'));
GRANT SELECT ON public.store_contacts TO anon, authenticated;
GRANT INSERT, UPDATE ON public.store_contacts TO authenticated;
GRANT ALL ON public.store_contacts TO service_role;
ALTER TABLE public.store_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY contacts_public_read ON public.store_contacts FOR SELECT TO anon,authenticated USING (true);
CREATE POLICY contacts_staff_insert ON public.store_contacts FOR INSERT TO authenticated WITH CHECK (public.staff_has_role(ARRAY['owner','admin']));
CREATE POLICY contacts_staff_update ON public.store_contacts FOR UPDATE TO authenticated USING (public.staff_has_role(ARRAY['owner','admin'])) WITH CHECK (public.staff_has_role(ARRAY['owner','admin']));
CREATE TABLE public.restock_subscriptions (user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, product_id text NOT NULL REFERENCES public.products(id), created_at timestamptz NOT NULL DEFAULT now(), notified_at timestamptz, PRIMARY KEY(user_id,product_id));
GRANT SELECT,INSERT,DELETE ON public.restock_subscriptions TO authenticated;
GRANT ALL ON public.restock_subscriptions TO service_role;
ALTER TABLE public.restock_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY restock_owner_read ON public.restock_subscriptions FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY restock_owner_insert ON public.restock_subscriptions FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id AND notified_at IS NULL AND EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.status='active' AND NOT p.is_demo));
CREATE POLICY restock_owner_delete ON public.restock_subscriptions FOR DELETE TO authenticated USING(auth.uid()=user_id);
CREATE OR REPLACE FUNCTION public.shopping_availability() RETURNS TABLE(product_id text,available_quantity integer) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT p.id, CASE WHEN p.is_demo OR p.tax_bps IS NULL THEN 0 WHEN p.fulfillment_model='OWN_INVENTORY' THEN LEAST(20,GREATEST(0,COALESCE(i.quantity-i.reserved,0))) WHEN EXISTS(SELECT 1 FROM public.supplier_products sp JOIN public.suppliers s ON s.id=sp.supplier_id WHERE sp.product_id=p.id AND sp.available AND s.approved) THEN 20 ELSE 0 END FROM public.products p LEFT JOIN public.inventory i ON i.product_id=p.id WHERE p.status='active';
$$;
REVOKE ALL ON FUNCTION public.shopping_availability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.shopping_availability() TO anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.notify_restock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE pid text; eligible boolean;
BEGIN
 pid:=NEW.product_id;
 SELECT EXISTS(SELECT 1 FROM public.shopping_availability() a WHERE a.product_id=pid AND a.available_quantity>0) INTO eligible;
 IF eligible THEN
 WITH notified AS (UPDATE public.restock_subscriptions SET notified_at=now() WHERE product_id=pid AND notified_at IS NULL RETURNING user_id)
 INSERT INTO public.notifications(user_id,title,body) SELECT n.user_id,'Back in stock',p.name || ' is available again. Check current price and availability before ordering.' FROM notified n JOIN public.products p ON p.id=pid;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER inventory_restock AFTER INSERT OR UPDATE OF quantity,reserved ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.notify_restock();
CREATE TRIGGER supplier_restock AFTER INSERT OR UPDATE OF available ON public.supplier_products FOR EACH ROW EXECUTE FUNCTION public.notify_restock();
CREATE OR REPLACE FUNCTION public.notify_product_restock() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF EXISTS(SELECT 1 FROM public.shopping_availability() a WHERE a.product_id=NEW.id AND a.available_quantity>0) THEN
 WITH notified AS (UPDATE public.restock_subscriptions SET notified_at=now() WHERE product_id=NEW.id AND notified_at IS NULL RETURNING user_id)
 INSERT INTO public.notifications(user_id,title,body) SELECT user_id,'Back in stock',NEW.name || ' is available again. Check current price and availability before ordering.' FROM notified;
 END IF; RETURN NEW;
END $$;
CREATE TRIGGER product_restock AFTER UPDATE OF status,tax_bps ON public.products FOR EACH ROW EXECUTE FUNCTION public.notify_product_restock();
CREATE TRIGGER contacts_audit AFTER INSERT OR UPDATE ON public.store_contacts FOR EACH ROW EXECUTE FUNCTION public.audit_staff_change();