-- Заявки «Запросить подбор» со страницы контактов
CREATE TABLE IF NOT EXISTS public.selection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT NOT NULL,
  wish TEXT NOT NULL,
  contact_methods JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.selection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert selection request"
  ON public.selection_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Managers read selection requests"
  ON public.selection_requests FOR SELECT
  TO authenticated
  USING (public.is_manager());

CREATE POLICY "Managers update selection requests"
  ON public.selection_requests FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

CREATE POLICY "Managers delete selection requests"
  ON public.selection_requests FOR DELETE
  TO authenticated
  USING (public.is_manager());
