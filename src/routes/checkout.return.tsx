import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md text-center bg-card border border-border rounded-3xl p-10 shadow-soft">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl mb-3">Pagamento confirmado!</h1>
        <p className="text-muted-foreground text-sm mb-2">
          Sua taxa de reserva foi recebida. Seu horário está garantido.
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          A Dra. Gisele entrará em contato pelo WhatsApp para confirmar os detalhes.
        </p>
        {session_id && (
          <p className="text-xs text-muted-foreground mb-6 break-all">
            Comprovante: {session_id}
          </p>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
