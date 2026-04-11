ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS rating SMALLINT NOT NULL DEFAULT 5;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_rating_range;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5);

DROP POLICY IF EXISTS "Visitors insert pending reviews" ON public.reviews;

CREATE POLICY "Visitors insert pending reviews"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    published = false
    AND length(trim(author_name)) >= 1
    AND length(trim(author_name)) <= 200
    AND length(trim(text)) >= 1
    AND length(trim(text)) <= 4000
    AND rating >= 1
    AND rating <= 5
  );
