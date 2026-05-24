
-- 1) Appointments: explicitly block public reads. Admin reads go through supabaseAdmin (service role) which bypasses RLS.
CREATE POLICY "No public read of appointments"
ON public.appointments
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

-- Block public updates/deletes explicitly (defense in depth)
CREATE POLICY "No public update of appointments"
ON public.appointments
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false);

CREATE POLICY "No public delete of appointments"
ON public.appointments
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- Tighten the anon INSERT policy with length/format checks (replace the permissive "true" one)
DROP POLICY IF EXISTS "Anyone can create an appointment" ON public.appointments;

CREATE POLICY "Anyone can create an appointment"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(phone) BETWEEN 1 AND 30
  AND char_length(treatment) BETWEEN 1 AND 120
  AND (notes IS NULL OR char_length(notes) <= 1000)
  AND status = 'pending'
  AND appointment_date >= CURRENT_DATE
);

-- 2) Testimonials: keep public submission but validate content; keep public read.
DROP POLICY IF EXISTS "Anyone can submit a testimonial" ON public.testimonials;

CREATE POLICY "Anyone can submit a testimonial"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 80
  AND char_length(text) BETWEEN 5 AND 1000
  AND rating BETWEEN 1 AND 5
);

-- Block updates/deletes on testimonials from public
CREATE POLICY "No public update of testimonials"
ON public.testimonials
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false);

CREATE POLICY "No public delete of testimonials"
ON public.testimonials
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

-- 3) Lock down the SECURITY DEFINER function: it must remain callable by anon (booking page checks availability)
--    but only expose times — already the case. Revoke from PUBLIC and grant explicitly.
REVOKE ALL ON FUNCTION public.get_taken_slots(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_taken_slots(date) TO anon, authenticated;
