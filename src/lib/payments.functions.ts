import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";

const InputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(1).max(30),
  treatment: z.string().trim().min(1).max(120),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(1000).optional(),
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

export const createAppointmentCheckout = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const env: StripeEnv = data.environment;
    const time = `${data.appointment_time}:00`;

    // Check slot not already taken
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

    // Insert pending_payment appointment
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("appointments")
      .insert({
        name: data.name,
        phone: data.phone,
        treatment: data.treatment,
        appointment_date: data.appointment_date,
        appointment_time: time,
        status: "pending_payment",
        notes: data.notes ?? null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      throw new Error("Não foi possível iniciar o agendamento. Tente novamente.");
    }

    const stripe = createStripeClient(env);
    const prices = await stripe.prices.list({ lookup_keys: ["taxa_reserva_100"] });
    if (!prices.data.length) throw new Error("Configuração de pagamento indisponível.");
    const price = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer_email: undefined,
      payment_intent_data: {
        description: `Taxa de reserva - ${data.treatment} (${data.appointment_date} ${data.appointment_time})`,
      },
      metadata: {
        appointment_id: inserted.id,
        customer_name: data.name,
        customer_phone: data.phone,
      },
    });

    // Save session id on appointment
    await supabaseAdmin
      .from("appointments")
      .update({ stripe_session_id: session.id })
      .eq("id", inserted.id);

    if (!session.client_secret) throw new Error("Falha ao criar sessão de pagamento.");
    return { clientSecret: session.client_secret, appointmentId: inserted.id };
  });
