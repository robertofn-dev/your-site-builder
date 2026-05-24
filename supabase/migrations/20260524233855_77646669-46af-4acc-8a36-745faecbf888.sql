CREATE OR REPLACE FUNCTION public.submit_appointment(
  p_name text,
  p_phone text,
  p_treatment text,
  p_appointment_date date,
  p_appointment_time time without time zone,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_name text := trim(coalesce(p_name, ''));
  v_phone text := trim(coalesce(p_phone, ''));
  v_treatment text := trim(coalesce(p_treatment, ''));
  v_notes text := nullif(trim(coalesce(p_notes, '')), '');
BEGIN
  IF char_length(v_name) < 1 OR char_length(v_name) > 80 THEN
    RAISE EXCEPTION 'O nome deve ter entre 1 e 80 caracteres.';
  END IF;

  IF char_length(v_phone) < 1 OR char_length(v_phone) > 30 THEN
    RAISE EXCEPTION 'Informe um WhatsApp válido.';
  END IF;

  IF char_length(v_treatment) < 1 OR char_length(v_treatment) > 120 THEN
    RAISE EXCEPTION 'Selecione um procedimento.';
  END IF;

  IF p_appointment_date < current_date OR p_appointment_date > (current_date + interval '2 months')::date THEN
    RAISE EXCEPTION 'Escolha uma data dentro dos próximos 2 meses.';
  END IF;

  IF extract(dow from p_appointment_date) = 0 THEN
    RAISE EXCEPTION 'Não atendemos aos domingos. Por favor, escolha de segunda a sábado.';
  END IF;

  IF p_appointment_time NOT IN (
    time '09:00', time '10:00', time '11:00', time '12:00', time '13:00',
    time '14:00', time '15:00', time '16:00', time '17:00'
  ) THEN
    RAISE EXCEPTION 'Escolha um horário disponível da agenda.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.appointments
    WHERE appointment_date = p_appointment_date
      AND appointment_time = p_appointment_time
      AND status IN ('pending', 'confirmed', 'blocked')
  ) THEN
    RAISE EXCEPTION 'Esse horário já foi reservado. Escolha outro.';
  END IF;

  INSERT INTO public.appointments (
    name,
    phone,
    treatment,
    appointment_date,
    appointment_time,
    status,
    notes
  ) VALUES (
    v_name,
    v_phone,
    v_treatment,
    p_appointment_date,
    p_appointment_time,
    'pending',
    v_notes
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_appointment(text, text, text, date, time without time zone, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_appointment(text, text, text, date, time without time zone, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_taken_slots(date) TO anon, authenticated;