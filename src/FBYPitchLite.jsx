import { Deck, SLIDES, Slide, H1, Eyebrow, C } from "./FBYPitch.jsx";

/* ══════════════════════════════════════════════════════════════════════════
   VERSIÓN REDUCIDA del deck — para una junta corta.
   Reutiliza las slides de FBYPitch.jsx (misma fuente, sin duplicar código)
   y agrega una slide final de trabajo abierto.

   Orden: portada → demo del dashboard → el hallazgo (subproducidas)
          → recomendador (qué es · cómo funciona) → ideas de ustedes
   ══════════════════════════════════════════════════════════════════════ */

const S = { fill: "none", stroke: C.accent, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  alerta: (
    <svg width="30" height="30" viewBox="0 0 24 24" {...S}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
      <path d="M10.4 19a2 2 0 0 0 3.2 0" />
    </svg>
  ),
  busqueda: (
    <svg width="30" height="30" viewBox="0 0 24 24" {...S}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5 20 20" />
    </svg>
  ),
  panel: (
    <svg width="30" height="30" viewBox="0 0 24 24" {...S}>
      <path d="M4 19.5h16" />
      <path d="M7.5 19.5V12M12 19.5V5.5M16.5 19.5v-5" />
    </svg>
  ),
  calendario: (
    <svg width="30" height="30" viewBox="0 0 24 24" {...S}>
      <rect x="3.8" y="5.5" width="16.4" height="14.7" rx="3" />
      <path d="M3.8 10h16.4M8.5 3.8v3.4M15.5 3.8v3.4" />
    </svg>
  ),
  musica: (
    <svg width="30" height="30" viewBox="0 0 24 24" {...S}>
      <circle cx="7" cy="17.4" r="2.8" />
      <circle cx="17.6" cy="15.2" r="2.8" />
      <path d="M9.8 17.4V7.2l10.6-2.4v10.4" />
    </svg>
  ),
};

const IDEAS = [
  { k: "alerta", t: "Alertas de abandono", b: "Ver quién está por darse de baja antes de que pase, y hacer algo al respecto." },
  { k: "busqueda", t: "Búsqueda que entiende", b: "Que alguien pida \"algo suave para la espalda\" y la app le responda bien." },
  { k: "panel", t: "Panel para coaches", b: "Que cada coach vea su desempeño y qué le está pidiendo su audiencia." },
  { k: "calendario", t: "Qué grabar el próximo mes", b: "El calendario de producción decidido con números en la mano." },
  { k: "musica", t: "Análisis de música", b: "Qué música, qué artistas, qué BPM funcionan más con qué clases y qué usuarias. No les diremos a las coaches qué música usar, pero podemos dar recomendaciones o tips de cosas que pueden tomar en cuenta para mejorar el ritmo de las clases.", wide: true },
];

const ideasSlide = {
  id: "ideas",
  render: () => (
    <Slide>
      <H1 style={{ fontSize: 32, maxWidth: 900, marginBottom: 34 }}>
        Estas son ideas que se me ocurrieron, pero si ustedes ya están trabajando en algo así y puedo aportar
        valor al proyecto que tienen, me interesa mucho poder trabajar juntos.
      </H1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
        {IDEAS.map((x) => (
          <div key={x.t} style={{ background: "#fff", borderRadius: 22, padding: "26px 26px", border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 1px 3px rgba(0,0,0,.04),0 6px 18px rgba(0,0,0,.04)", gridColumn: x.wide ? "span 2" : "span 1", display: x.wide ? "flex" : "block", gap: x.wide ? 22 : 0, alignItems: "center" }}>
            <div style={{ width: 54, height: 54, borderRadius: 18, background: `${C.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: x.wide ? 0 : 16, flexShrink: 0 }}>
              {ICONS[x.k]}
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-.3px" }}>{x.t}</p>
              <p style={{ fontSize: 14, color: "#666", margin: 0, lineHeight: 1.6 }}>{x.b}</p>
            </div>
          </div>
        ))}
      </div>
    </Slide>
  ),
};

const WA_NUMERO = "527221608465";
const WA_VISIBLE = "+52 722 160 8465";

const IconWA = ({ color = C.accent, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.3 11.7a8.3 8.3 0 0 1-12.2 7.3L3.7 20.3l1.3-4.4A8.3 8.3 0 1 1 20.3 11.7Z" />
    <path d="M9.1 9.2c-.2 1.6 1.1 3.4 2.2 4.3 1.1.9 2.5 1.5 3.4 1.2.5-.2.8-.7 1-1.2l-1.9-1-.9.8c-.7-.4-1.6-1.2-2-2l.7-.9-1-1.9c-.6.1-1.1.4-1.5.7Z" />
  </svg>
);

const SKILLS = ["Ciencia de Datos", "Desarrollo Web", "Producto"];

const contactoSlide = {
  id: "contacto",
  render: () => (
    <Slide>
      <style>{`
        .fbyWa { transition: transform .18s ease, box-shadow .18s ease; }
        .fbyWa:hover { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(0,0,0,.22); }
        @keyframes fbyRing { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(1.5); opacity: 0 } }
      `}</style>

      <div style={{ minHeight: "calc(100vh - 172px)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {/* halo suave detrás del bloque */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", pointerEvents: "none", background: `radial-gradient(circle, ${C.accent}17 0%, ${C.accent}00 66%)` }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 620 }}>
          {/* monograma */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: C.accent, animation: "fbyRing 2.6s ease-out infinite" }} />
            <div style={{ position: "relative", width: 80, height: 80, borderRadius: 26, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 30px ${C.accent}4d` }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 27, letterSpacing: "-1.2px" }}>AE</span>
            </div>
          </div>

          <Eyebrow>Gracias por su tiempo</Eyebrow>
          <H1 style={{ fontSize: 46, margin: "0 0 14px" }}>Andrés Estrada Plata</H1>

          <p style={{ fontSize: 17.5, fontWeight: 600, color: C.ink, margin: "0 0 12px", lineHeight: 1.45 }}>
            Ingeniero Industrial · Analista de Datos
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 34 }}>
            <span style={{ fontSize: 12.5, color: C.mute }}>Experiencia en</span>
            {SKILLS.map((s) => (
              <span key={s} style={{ background: `${C.accent}15`, color: C.accent, fontSize: 12, fontWeight: 600, padding: "5px 13px", borderRadius: 20 }}>{s}</span>
            ))}
          </div>

          {/* separador fino */}
          <div style={{ width: 46, height: 2, borderRadius: 2, background: "#e6ddd7", marginBottom: 34 }} />

          <a
            className="fbyWa"
            href={`https://wa.me/${WA_NUMERO}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none",
              background: C.ink, color: "#fff", borderRadius: 26, padding: "16px 30px",
              boxShadow: "0 10px 30px rgba(0,0,0,.18)", fontWeight: 700, fontSize: 15,
            }}
          >
            <IconWA color="#fff" size={22} />
            Escríbeme por WhatsApp
          </a>

          <p style={{ fontSize: 15, fontWeight: 600, color: "#555", margin: "16px 0 0", letterSpacing: "-.2px" }}>{WA_VISIBLE}</p>
          <p style={{ fontSize: 12.5, color: C.mute, margin: "6px 0 0" }}>Con gusto agendamos una llamada esta semana.</p>
        </div>
      </div>
    </Slide>
  ),
};

const ORDER = ["cover", "demo", "framework", "reco-intro", "reco-como"];

const LITE_SLIDES = [
  ...ORDER.map((id) => {
    const s = SLIDES.find((x) => x.id === id);
    if (!s) throw new Error(`Slide "${id}" no existe en FBYPitch.jsx`);
    return s;
  }),
  ideasSlide,
  contactoSlide,
];

export default function FBYPitchLite() {
  return <Deck slides={LITE_SLIDES} />;
}
