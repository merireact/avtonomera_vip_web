-- Visitors can submit reviews (pending). Public catalog shows only published.
-- Managers see all rows and can approve via UPDATE.

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Managers insert reviews" ON public.reviews;

CREATE POLICY "Read published reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Managers read all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (public.is_manager());

CREATE POLICY "Visitors insert pending reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    published = false
    AND length(trim(author_name)) >= 1
    AND length(trim(author_name)) <= 200
    AND length(trim(text)) >= 1
    AND length(trim(text)) <= 4000
  );

CREATE POLICY "Managers insert reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.is_manager());
