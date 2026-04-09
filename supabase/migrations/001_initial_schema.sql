-- Run in Supabase SQL Editor or via supabase db push
-- Tables, RLS, Storage policies for avtonomera_vip_web

-- Roles: after creating Auth users, insert into user_roles:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('<uuid-from-auth.users>', 'manager');

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('manager')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  status TEXT NOT NULL DEFAULT 'В наличии',
  image_url TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS plates_plate_unique ON public.plates (plate);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sell_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plate TEXT,
  contact_methods JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_requests ENABLE ROW LEVEL SECURITY;

-- Helper: current user is manager
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'manager'
  );
$$;

-- user_roles: only service role / dashboard inserts typically; managers can read own row
CREATE POLICY "Managers read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- plates: public read
CREATE POLICY "Anyone can read plates"
  ON public.plates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Managers insert plates"
  ON public.plates FOR INSERT
  TO authenticated
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers update plates"
  ON public.plates FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers delete plates"
  ON public.plates FOR DELETE
  TO authenticated
  USING (public.is_manager());

-- reviews: public read
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Managers insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.is_manager());

-- sell_requests: anonymous can submit
CREATE POLICY "Anyone can insert sell request"
  ON public.sell_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Managers read sell requests"
  ON public.sell_requests FOR SELECT
  TO authenticated
  USING (public.is_manager());

CREATE POLICY "Managers update sell requests"
  ON public.sell_requests FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers delete sell requests"
  ON public.sell_requests FOR DELETE
  TO authenticated
  USING (public.is_manager());

-- Storage: create bucket in Dashboard → Storage → New bucket → name plate-images → Public bucket ON
-- Then run policies below (adjust if bucket name changes)

-- If this fails, create bucket "plate-images" in Dashboard (public read).
INSERT INTO storage.buckets (id, name, public)
VALUES ('plate-images', 'plate-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read plate images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'plate-images');

CREATE POLICY "Managers upload plate images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'plate-images'
    AND public.is_manager()
  );

CREATE POLICY "Managers update plate images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'plate-images' AND public.is_manager())
  WITH CHECK (bucket_id = 'plate-images' AND public.is_manager());

CREATE POLICY "Managers delete plate images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'plate-images' AND public.is_manager());

GRANT EXECUTE ON FUNCTION public.is_manager() TO anon, authenticated;

-- Optional: Database Webhook on sell_requests INSERT → Telegram / email (Supabase Dashboard → Integrations → Database Webhooks)
