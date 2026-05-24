import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const requirePassword = (password: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Senha de admin não configurada no servidor.");
  if (password !== expected) throw new Error("Senha incorreta.");
};

export const listAppointments = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ password: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    requirePassword(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("appointments")
      .select("id, name, phone, treatment, appointment_date, appointment_time, status, notes, created_at")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });
    if (error) throw new Error(error.message);
    return { appointments: rows ?? [] };
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ password: z.string().min(1).max(200), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    requirePassword(data.password);
    const { error } = await supabaseAdmin.from("appointments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const blockSlot = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        password: z.string().min(1).max(200),
        name: z.string().min(1).max(80),
        phone: z.string().min(1).max(30),
        treatment: z.string().min(1).max(80),
        appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        appointment_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
        notes: z.string().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requirePassword(data.password);
    const time = data.appointment_time.length === 5 ? `${data.appointment_time}:00` : data.appointment_time;
    const { error } = await supabaseAdmin.from("appointments").insert({
      name: data.name,
      phone: data.phone,
      treatment: data.treatment,
      appointment_date: data.appointment_date,
      appointment_time: time,
      status: "confirmed",
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateStatus = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "cancelled", "blocked", "pending_payment"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requirePassword(data.password);
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
