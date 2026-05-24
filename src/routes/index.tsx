import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Clock, Sparkles, ArrowRight, Star, CalendarDays } from "lucide-react";
import heroImg from "@/assets/hero.png";
import aboutImg from "@/assets/about.png";
import gallery1 from "@/assets/gallery1.png";
import gallery2 from "@/assets/gallery2.png";
import gallery3 from "@/assets/gallery3.png";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dra. Gisele Nascimento — Ateliê de Beleza & Estética Avançada" },
      { name: "description", content: "Tratamentos estéticos personalizados no Tatuapé, São Paulo. Harmonização facial, botox, preenchimento e peeling com a Dra. Gisele Nascimento." },
      { property: "og:title", content: "Dra. Gisele Nascimento — Ateliê de Beleza" },
      { property: "og:description", content: "Sua beleza, cuidada com maestria. Estética avançada em São Paulo." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Home,
});

const WHATSAPP = "https://wa.me/551123826915";

const treatments = [
  { title: "Harmonização Facial", duration: "60–90 min", desc: "Procedimento que equilibra e realça as proporções do rosto com técnicas minimamente invasivas para um resultado natural e harmonioso." },
  { title: "Botox", duration: "30 min", desc: "Aplicação precisa de toxina botulínica para suavizar rugas de expressão, prevenir o envelhecimento e proporcionar um visual descansado." },
  { title: "Preenchimento Labial", duration: "45 min", desc: "Volumização e definição dos lábios com ácido hialurônico para um resultado natural, simétrico e com hidratação duradoura." },
  { title: "Peeling Químico", duration: "60 min", desc: "Renovação celular intensa que atenua manchas, linhas finas e uniformiza a textura e o tom da pele." },
];

const gallery = [
  { img: gallery1, label: "Pele Radiante" },
  { img: gallery2, label: "Cuidado Especializado" },
  { img: gallery3, label: "Produtos Premium" },
];

const fallbackTestimonials = [
  { id: "f1", name: "Mariana Silva", text: "O ambiente é incrivelmente relaxante e a Dra. Gisele é maravilhosa. Meu rosto nunca teve tanto viço. Um momento de puro autocuidado que recomendo de olhos fechados.", rating: 5 },
  { id: "f2", name: "Camila Costa", text: "Fiz o peeling químico e os resultados foram muito além das minhas expectativas. O atendimento é impecável, cheio de mimos e a atenção aos detalhes é fantástica.", rating: 5 },
  { id: "f3", name: "Juliana Mendes", text: "Mais do que um tratamento estético, é uma experiência de relaxamento profundo. As mãos da Dra. Gisele são mágicas e ela tem um conhecimento técnico impressionante.", rating: 5 },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Philosophy />
      <Treatments />
      <About />
      <Gallery />
      <Testimonials />
      <Scheduling />
      <Contact />
      <Footer />
      <FloatingWhats />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="font-display text-2xl tracking-tight text-foreground">
          Dra. Gisele Nascimento
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm text-muted-foreground">
          <a href="#tratamentos" className="hover:text-primary transition-colors">Tratamentos</a>
          <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
          <a href="#galeria" className="hover:text-primary transition-colors">Galeria</a>
          <a href="#agendamento" className="hover:text-primary transition-colors">Agendar</a>
          <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
        </nav>
        <a href="#agendamento" className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-soft">
          Agendar Online
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menu">
          <div className="w-6 flex flex-col gap-1.5">
            <span className="h-px bg-foreground" />
            <span className="h-px bg-foreground" />
            <span className="h-px bg-foreground" />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 px-6 py-4 flex flex-col gap-4 text-sm bg-background">
          <a href="#tratamentos" onClick={() => setOpen(false)}>Tratamentos</a>
          <a href="#sobre" onClick={() => setOpen(false)}>Sobre</a>
          <a href="#galeria" onClick={() => setOpen(false)}>Galeria</a>
          <a href="#contato" onClick={() => setOpen(false)}>Contato</a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-5 py-2.5 text-center text-primary-foreground">Agendar</a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative h-[88vh] min-h-[620px] w-full overflow-hidden">
      <img src={heroImg} alt="Ateliê de beleza Dra. Gisele Nascimento" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/55" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 h-full flex flex-col justify-center">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/85 mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Ateliê de Beleza
        </span>
        <h1 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl text-balance">
          Sua beleza,<br />
          <em className="font-light">cuidada com maestria.</em>
        </h1>
        <p className="mt-6 max-w-xl text-white/85 text-lg leading-relaxed">
          Descubra a sua melhor versão em um ambiente projetado para o seu bem-estar, com tratamentos estéticos personalizados.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition">
            Agende sua Avaliação <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#tratamentos" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-7 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition">
            Nossos Tratamentos
          </a>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">Filosofia</span>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl text-balance leading-[1.1]">
          Elevando a autoestima através da <span className="text-primary">ciência e do toque</span>.
        </h2>
        <p className="mt-8 text-muted-foreground text-lg leading-relaxed">
          Acreditamos que a estética vai muito além da aparência. É sobre como você se sente na sua própria pele.
          Nosso ateliê oferece uma abordagem integrativa, unindo tecnologia de ponta, produtos de excelência
          e um cuidado genuinamente humano para revelar o brilho natural que já existe em você.
        </p>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section id="tratamentos" className="py-28 px-6 lg:px-10 bg-secondary/40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Especialidades</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Tratamentos Exclusivos</h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Protocolos personalizados desenhados especificamente para as necessidades únicas da sua pele.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {treatments.map((t) => (
            <article key={t.title} className="group relative bg-card rounded-2xl p-7 shadow-soft border border-border/50 flex flex-col hover:-translate-y-1 transition duration-300">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-3">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.desc}</p>
              <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.duration}</span>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Agendar <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src={aboutImg} alt="Dra. Gisele Nascimento" className="w-full rounded-3xl shadow-elegant aspect-[4/5] object-cover" />
          <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-card rounded-2xl shadow-elegant p-6 border border-border/50 hidden sm:block">
            <div className="flex gap-8">
              <div>
                <div className="font-display text-4xl text-primary">10+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Anos de<br />Experiência</div>
              </div>
              <div className="border-l border-border pl-8">
                <div className="font-display text-4xl text-primary">2k+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Clientes<br />Atendidos</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Sobre a Especialista</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Dra. Gisele Nascimento</h2>
          <div className="mt-7 space-y-5 text-muted-foreground leading-relaxed">
            <p>Sou apaixonada pela transformação que o cuidado com a pele pode proporcionar na vida das pessoas. Com anos de dedicação e especialização em estética avançada, minha missão é realçar a beleza natural de cada cliente.</p>
            <p>Acredito em uma estética que respeita a individualidade. Não existem fórmulas prontas; cada pele tem sua história e necessita de uma atenção única. Por isso, todos os nossos protocolos são desenvolvidos após uma avaliação criteriosa.</p>
            <p>Meu ateliê foi criado para ser o seu refúgio — um espaço onde o estresse fica do lado de fora, e você é o centro de todo o cuidado.</p>
          </div>
          <a href="https://www.instagram.com/dragiselenascimento_/" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            <Instagram className="w-4 h-4" /> Conheça meu dia a dia
          </a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="galeria" className="py-28 px-6 lg:px-10 bg-secondary/40">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Portfólio</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Resultados & Experiência</h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Um vislumbre do cuidado e dedicação presentes em cada detalhe do nosso ateliê.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {gallery.map((g) => (
            <figure key={g.label} className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-soft">
              <img src={g.img} alt={g.label} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 text-white font-display text-2xl">{g.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [items, setItems] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("id, name, text, rating")
      .order("created_at", { ascending: false })
      .limit(12);
    if (data && data.length > 0) {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "•";

  return (
    <section id="depoimentos" className="py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Avaliações</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">O que dizem nossas clientes</h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Histórias reais de quem já passou pelo nosso ateliê.
          </p>
        </div>
        {loading ? (
          <div className="text-center text-muted-foreground">Carregando...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((t) => (
              <blockquote key={t.id} className="bg-card border border-border/50 rounded-2xl p-8 shadow-soft">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/85 leading-relaxed italic">{t.text}</p>
                <footer className="mt-7 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/40 text-primary flex items-center justify-center font-display text-lg">{initial(t.name)}</div>
                  <cite className="not-italic font-medium">{t.name}</cite>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
        <div className="mt-14 max-w-2xl mx-auto">
          <TestimonialForm onSubmitted={loadTestimonials} />
        </div>
      </div>
    </section>
  );
}

function TestimonialForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (trimmedName.length < 1 || trimmedName.length > 80) {
      setError("O nome deve ter entre 1 e 80 caracteres."); setStatus("error"); return;
    }
    if (trimmedText.length < 10 || trimmedText.length > 1000) {
      setError("O depoimento deve ter entre 10 e 1000 caracteres."); setStatus("error"); return;
    }
    setStatus("loading"); setError("");
    const { error: insertError } = await supabase
      .from("testimonials")
      .insert({ name: trimmedName, text: trimmedText, rating });
    if (insertError) {
      setError("Não foi possível enviar agora. Tente novamente."); setStatus("error"); return;
    }
    setName(""); setText(""); setRating(5);
    setStatus("success");
    onSubmitted();
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-2xl p-8 border border-border/60 shadow-soft space-y-5">
      <div className="text-center">
        <h3 className="font-display text-2xl">Deixe seu depoimento</h3>
        <p className="text-sm text-muted-foreground mt-2">Compartilhe sua experiência com a Dra. Gisele.</p>
      </div>
      <Field label="Seu nome">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required className="input" placeholder="Como podemos te chamar" />
      </Field>
      <Field label="Sua avaliação">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} className="p-1" aria-label={`${n} estrelas`}>
              <Star className={`w-7 h-7 transition ${(hover || rating) >= n ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Seu depoimento">
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} rows={4} required className="input resize-none" placeholder="Conte como foi sua experiência" />
        <span className="text-xs text-muted-foreground mt-1 block">{text.length}/1000</span>
      </Field>
      {status === "error" && <p className="text-sm text-destructive">{error}</p>}
      {status === "success" && <p className="text-sm text-primary">Obrigada! Seu depoimento foi publicado. ✨</p>}
      <button type="submit" disabled={status === "loading"} className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
        {status === "loading" ? "Enviando..." : "Publicar depoimento"}
      </button>
    </form>
  );
}

function Contact() {
  return (
    <section id="contato" className="py-28 px-6 lg:px-10 bg-secondary/40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Contato</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Agende seu momento.</h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Entre em contato para agendar uma avaliação e descobrir qual o melhor protocolo para as suas necessidades.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <InfoItem icon={MapPin} title="Endereço">
              Rua André Vidal, 318 - Tatuapé<br />São Paulo - SP
            </InfoItem>
            <InfoItem icon={Phone} title="Telefone / WhatsApp">
              (11) 2382-6915
            </InfoItem>
            <InfoItem icon={Clock} title="Horário de Funcionamento">
              Seg a Sex: 09h às 19h<br />Sábados: 09h às 14h
            </InfoItem>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 transition">
              Falar pelo WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-display text-xl mb-1">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, Dra. Gisele!%0A%0ANome: ${name}%0AWhatsApp: ${phone}%0AInteresse: ${interest}${message ? `%0AMensagem: ${message}` : ""}`;
    window.open(`https://wa.me/551123826915?text=${text}`, "_blank");
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-2xl p-8 border border-border/60 shadow-soft space-y-5">
      <h3 className="font-display text-2xl mb-2">Envie uma mensagem</h3>
      <Field label="Nome completo">
        <input value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="Seu nome" />
      </Field>
      <Field label="WhatsApp">
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="input" placeholder="(11) 99999-9999" />
      </Field>
      <Field label="Interesse em">
        <select value={interest} onChange={(e) => setInterest(e.target.value)} required className="input">
          <option value="">Selecione</option>
          <option>Harmonização Facial</option>
          <option>Botox</option>
          <option>Preenchimento Labial</option>
          <option>Peeling Químico</option>
          <option>Outros / Avaliação</option>
        </select>
      </Field>
      <Field label="Mensagem (opcional)">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="input resize-none" placeholder="Conte um pouco sobre o que procura" />
      </Field>
      <button type="submit" className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
        Enviar pelo WhatsApp
      </button>
      <style>{`.input { width:100%; background: var(--color-background); border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.95rem; outline: none; transition: border-color .2s, box-shadow .2s; } .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px oklch(0.62 0.085 45 / .15); }`}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function Scheduling() {
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 2);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [treatment, setTreatment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const selected = new Date(date + "T00:00:00");
    if (selected.getDay() === 0) {
      setError("Não atendemos aos domingos. Por favor, escolha de segunda a sábado.");
      return;
    }
    const text =
      `Olá, Dra. Gisele! Gostaria de agendar uma consulta.%0A%0A` +
      `*Nome:* ${name}%0A` +
      `*WhatsApp:* ${phone}%0A` +
      `*Procedimento:* ${treatment}%0A` +
      `*Data:* ${formatDate(date)}%0A` +
      `*Horário:* ${time}%0A%0A` +
      `Aguardo a confirmação. Obrigada!`;
    window.open(`https://wa.me/551123826915?text=${text}`, "_blank");
  };

  return (
    <section id="agendamento" className="py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Agendamento Online</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Escolha seu melhor dia e horário.</h2>
          <p className="mt-5 text-muted-foreground text-lg">
            Selecione uma data e horário disponíveis. Sua solicitação será enviada diretamente para o WhatsApp da Dra. Gisele para confirmação.
          </p>
        </div>

        <form onSubmit={submit} className="bg-card rounded-3xl p-8 sm:p-10 border border-border/60 shadow-soft space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nome completo">
              <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} className="input" placeholder="Seu nome" />
            </Field>
            <Field label="WhatsApp">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} className="input" placeholder="(11) 99999-9999" />
            </Field>
          </div>

          <Field label="Procedimento desejado">
            <select value={treatment} onChange={(e) => setTreatment(e.target.value)} required className="input">
              <option value="">Selecione</option>
              <option>Avaliação / Consulta</option>
              <option>Harmonização Facial</option>
              <option>Botox</option>
              <option>Preenchimento Labial</option>
              <option>Peeling Químico</option>
              <option>Outro</option>
            </select>
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Data">
              <input
                type="date"
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input"
              />
            </Field>
            <Field label="Horário">
              <select value={time} onChange={(e) => setTime(e.target.value)} required className="input">
                <option value="">Selecione um horário</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Atendimento de segunda a sábado, das 09h às 17h.
          </p>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition inline-flex items-center justify-center gap-2">
            Enviar agendamento pelo WhatsApp <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Após enviar, a Dra. Gisele entrará em contato para confirmar a disponibilidade do horário.
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display text-2xl">Dra. Gisele Nascimento</div>
          <p className="text-background/60 text-sm mt-1">Estética Avançada — Tatuapé, São Paulo</p>
        </div>
        <nav className="flex gap-8 text-sm text-background/70">
          <a href="#tratamentos" className="hover:text-background">Tratamentos</a>
          <a href="#sobre" className="hover:text-background">Sobre</a>
          <a href="#galeria" className="hover:text-background">Galeria</a>
          <a href="#contato" className="hover:text-background">Contato</a>
        </nav>
        <a href="https://www.instagram.com/dragiselenascimento_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-background/70 hover:text-background">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
      <div className="mx-auto max-w-7xl text-xs text-background/50 mt-10 pt-6 border-t border-background/10">
        © {new Date().getFullYear()} Dra. Gisele Nascimento. Todos os direitos reservados.
      </div>
    </footer>
  );
}

function FloatingWhats() {
  return (
    <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-elegant hover:scale-110 transition">
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><path d="M20.5 3.5A11.9 11.9 0 0 0 3.4 19.7L2 22l2.4-1.4A11.9 11.9 0 1 0 20.5 3.5Zm-8.5 18a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-2.9.8.8-2.8-.2-.3a9.5 9.5 0 1 1 7.4 3.8Zm5.5-7.1c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.5-1.5a9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-1-2.3-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1 2.9 1.2 3.1c.2.3 2 3.1 5 4.4a16.6 16.6 0 0 0 1.7.6 4 4 0 0 0 1.8.1c.6-.1 1.8-.7 2-1.5s.2-1.4.2-1.5-.3-.2-.6-.3Z"/></svg>
    </a>
  );
}
