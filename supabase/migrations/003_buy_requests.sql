-- Заявки «Купить номер» с карточки каталога
CREATE TABLE IF NOT EXISTS public.buy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL,
  plate_id UUID REFERENCES public.plates (id) ON DELETE SET NULL,
  name TEXT,
  phone TEXT NOT NULL,
  note TEXT,
  contact_methods JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.buy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert buy request"
  ON public.buy_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Managers read buy requests"
  ON public.buy_requests FOR SELECT
  TO authenticated
  USING (public.is_manager());

CREATE POLICY "Managers update buy requests"
  ON public.buy_requests FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers delete buy requests"
  ON public.buy_requests FOR DELETE
  TO authenticated
  USING (public.is_manager());
