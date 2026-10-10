CREATE TABLE public.reviews(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),product_id text NOT NULL REFERENCES public.products(id),user_id uuid NOT NULL,order_item_id uuid NOT NULL UNIQUE REFERENCES public.order_items(id),rating integer NOT NULL CHECK(rating BETWEEN 1 AND 5),body text NOT NULL CHECK(length(body) BETWEEN 5 AND 2000),created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT ON public.reviews TO authenticated; GRANT SELECT ON public.reviews TO anon; GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY public_verified_reviews ON public.reviews FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.status='active'));
CREATE POLICY verified_review_insert ON public.reviews FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid() AND EXISTS(SELECT 1 FROM public.order_items i JOIN public.orders o ON o.id=i.order_id WHERE i.id=order_item_id AND i.product_id=reviews.product_id AND o.user_id=auth.uid() AND o.status='delivered' AND o.payment_status='paid'));
CREATE TABLE public.campaigns(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),title text NOT NULL CHECK(length(title) BETWEEN 2 AND 100),subtitle text NOT NULL DEFAULT '',category_id text REFERENCES public.categories(id),active boolean NOT NULL DEFAULT false,starts_at timestamptz NOT NULL DEFAULT now(),ends_at timestamptz NOT NULL DEFAULT now()+interval '1 day',sort_order integer NOT NULL DEFAULT 0);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.campaigns TO authenticated; GRANT SELECT ON public.campaigns TO anon; GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY live_campaigns ON public.campaigns FOR SELECT TO anon,authenticated USING(active AND starts_at<=now() AND ends_at>now());
CREATE POLICY catalogue_campaigns ON public.campaigns FOR ALL TO authenticated USING(public.staff_has_role(ARRAY['owner','admin','catalogue'])) WITH CHECK(public.staff_has_role(ARRAY['owner','admin','catalogue']));
CREATE TRIGGER audit_campaigns AFTER INSERT OR UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.audit_staff_change();
CREATE TABLE public.notifications(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,order_id uuid REFERENCES public.orders(id),title text NOT NULL,body text NOT NULL,read_at timestamptz,created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.notifications TO authenticated; GRANT UPDATE(read_at) ON public.notifications TO authenticated; GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_notifications_read ON public.notifications FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY own_notifications_seen ON public.notifications FOR UPDATE TO authenticated USING(user_id=auth.uid()) WITH CHECK(user_id=auth.uid());
CREATE FUNCTION public.notify_order_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN
IF NEW.user_id IS NOT NULL AND (TG_OP='INSERT' OR NEW.status IS DISTINCT FROM OLD.status OR NEW.payment_status IS DISTINCT FROM OLD.payment_status) THEN
INSERT INTO public.notifications(user_id,order_id,title,body) VALUES(NEW.user_id,NEW.id,'Order '||left(NEW.id::text,8),replace(NEW.status,'_',' ')||' · Payment '||NEW.payment_status); END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.notify_order_change() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER order_notifications AFTER INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.notify_order_change();
CREATE INDEX reviews_product_idx ON public.reviews(product_id,created_at DESC);
CREATE INDEX notifications_owner_idx ON public.notifications(user_id,created_at DESC);