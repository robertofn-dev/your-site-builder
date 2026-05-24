import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Trash2, Lock, Plus, RefreshCcw } from "lucide-react";
import {
  listAppointments,
  deleteAppointment,
  blockSlot,
  updateStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Agendamentos" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Appointment = {
  id: string;
  name: string;
  phone: string;
  treatment: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  blocked: "Bloqueado",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-zinc-200 text-zinc-600",
  blocked: "bg-rose-100 text-rose-800",
};

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const listFn = useServerFn(listAppointments);
  const deleteFn = useServerFn(deleteAppointment);
  const blockFn = useServerFn(blockSlot);
  const statusFn = useServerFn(updateStatus);

  const load = async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await listFn({ data: { password: pw } });
      setAppointments(res.appointments as Appointment[]);
      setAuthed(true);
      setPassword(pw);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    void load(password);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este agendamento?")) return;
    await deleteFn({ data: { password, id } });
    await load(password);
  };

  const handleStatus = async (id: string, status: string) => {
    await statusFn({ data: { password, id, status: status as any } });
    await load(password);
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-card border border-border/60 rounded-2xl p-8 shadow-soft space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-accent/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl">Área administrativa</h1>
              <p className="text-xs text-muted-foreground">Acesso restrito</p>
            </div>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </main>
    );
  }

  // Group by date
  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    (acc[a.appointment_date] ||= []).push(a);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl">Agendamentos</h1>
            <p className="text-sm text-muted-foreground mt-1">{appointments.length} no total</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => load(password)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              <RefreshCcw className="w-4 h-4" /> Atualizar
            </button>
            <button
              onClick={() => {
                setAuthed(false);
                setPassword("");
                setAppointments([]);
              }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Sair
            </button>
          </div>
        </div>

        <BlockForm password={password} onCreated={() => load(password)} blockFn={blockFn} />

        <div className="mt-10 space-y-8">
          {dates.length === 0 && (
            <p className="text-muted-foreground text-center py-12">Nenhum agendamento ainda.</p>
          )}
          {dates.map((date) => (
            <section key={date}>
              <h2 className="font-display text-xl mb-3">{formatDateBr(date)}</h2>
              <div className="bg-card border border-border/60 rounded-2xl divide-y divide-border/60 overflow-hidden">
                {grouped[date]
                  .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                  .map((a) => (
                    <div key={a.id} className="p-4 sm:p-5 flex flex-wrap items-start gap-4">
                      <div className="font-display text-2xl text-primary w-20">
                        {a.appointment_time.slice(0, 5)}
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <div className="font-medium">{a.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.treatment} • {a.phone}
                        </div>
                        {a.notes && (
                          <div className="text-xs text-muted-foreground mt-1 italic">{a.notes}</div>
                        )}
                      </div>
                      <select
                        value={a.status}
                        onChange={(e) => handleStatus(a.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLOR[a.status] ?? ""}`}
                      >
                        {Object.entries(STATUS_LABEL).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-muted-foreground hover:text-destructive p-2"
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function BlockForm({
  password,
  onCreated,
  blockFn,
}: {
  password: string;
  onCreated: () => void;
  blockFn: ReturnType<typeof useServerFn<typeof blockSlot>>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState("Avaliação / Consulta");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await blockFn({
        data: {
          password,
          name: name || "Reservado (WhatsApp)",
          phone: phone || "—",
          treatment,
          appointment_date: date,
          appointment_time: time,
          notes: notes || undefined,
        },
      });
      setName(""); setPhone(""); setNotes(""); setDate(""); setTime("");
      setOpen(false);
      onCreated();
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao salvar (talvez horário já ocupado).");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90"
      >
        <Plus className="w-4 h-4" /> Adicionar agendamento manual
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">Novo agendamento</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
          Cancelar
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nome (opcional)" className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        />
        <input
          value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp (opcional)" className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        />
        <select
          value={treatment} onChange={(e) => setTreatment(e.target.value)}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        >
          <option>Avaliação / Consulta</option>
          <option>Harmonização Facial</option>
          <option>Botox</option>
          <option>Preenchimento Labial</option>
          <option>Peeling Químico</option>
          <option>Outro</option>
        </select>
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)} required
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        />
        <select
          value={time} onChange={(e) => setTime(e.target.value)} required
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        >
          <option value="">Horário</option>
          {times.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Observação (opcional)" className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
        />
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button
        type="submit" disabled={saving}
        className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

function formatDateBr(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
