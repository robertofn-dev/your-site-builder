
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  treatment text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (appointment_date, appointment_time)
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode criar um agendamento pelo formulário
CREATE POLICY "Anyone can create an appointment"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ninguém pode ler dados pessoais diretamente (acesso só via função RPC ou server admin)
-- Sem policy de SELECT = sem leitura pública

-- Função pública que devolve apenas os horários ocupados de uma data (sem nome/telefone)
CREATE OR REPLACE FUNCTION public.get_taken_slots(p_date date)
RETURNS TABLE(appointment_time time)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time
  FROM public.appointments
  WHERE appointment_date = p_date
    AND status IN ('pending', 'confirmed', 'blocked');
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(date) TO anon, authenticated;
