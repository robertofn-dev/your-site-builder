import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const InputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(1).max(30),
  treatment: z.string().trim().min(1).max(120),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(1000).optional(),
});

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const time = `${data.appointment_time}:00`;

    const { data: conflict } = await supabaseAdmin
      .from("appointments")
      .select("id")
      .eq("appointment_date", data.appointment_date)
      .eq("appointment_time", time)
      .in("status", ["pending", "confirmed", "blocked"])
      .limit(1);

    if (conflict && conflict.length > 0) {
      throw new Error("Esse horário já foi reservado. Escolha outro.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        name: data.name,
        phone: data.phone,
        treatment: data.treatment,
        appointment_date: data.appointment_date,
        appointment_time: time,
        status: "pending",
        notes: data.notes ?? null,
      })
      .select("id")
      .single();

    if (error || !inserted) {
      throw new Error("Não foi possível salvar o agendamento. Tente novamente.");
    }

    return { appointmentId: inserted.id };
  });
