ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS stripe_session_id text;
CREATE UNIQUE INDEX IF NOT EXISTS appointments_stripe_session_id_key ON public.appointments(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can create an appointment" ON public.appointments;