import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

async function handleCheckoutCompleted(session: any) {
  const appointmentId = session.metadata?.appointment_id;
  if (!appointmentId) {
    console.error("Webhook: no appointment_id in session metadata", session.id);
    return;
  }
  const { error } = await supabaseAdmin
    .from("appointments")
    .update({ status: "pending" })
    .eq("id", appointmentId)
    .eq("status", "pending_payment");
  if (error) console.error("Webhook: failed to confirm appointment", error.message);
}

async function handleCheckoutExpired(session: any) {
  const appointmentId = session.metadata?.appointment_id;
  if (!appointmentId) return;
  await supabaseAdmin
    .from("appointments")
    .delete()
    .eq("id", appointmentId)
    .eq("status", "pending_payment");
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "transaction.completed":
              await handleCheckoutCompleted(event.data.object);
              break;
            case "checkout.session.expired":
            case "transaction.payment_failed":
              await handleCheckoutExpired(event.data.object);
              break;
            default:
              console.log("Unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
