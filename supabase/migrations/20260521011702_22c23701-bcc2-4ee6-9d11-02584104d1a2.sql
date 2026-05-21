
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 10 AND 1000),
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit a testimonial"
  ON public.testimonials FOR INSERT
  WITH CHECK (true);

CREATE INDEX testimonials_created_at_idx ON public.testimonials (created_at DESC);
