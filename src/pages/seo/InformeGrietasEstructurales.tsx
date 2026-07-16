import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLandingContent } from "@/hooks/useLandingContent";

const DEFAULT = {
  hero: { badge: 'Mi Casa Verde · Informe Técnico', h1: 'Informe Técnico de Grietas Estructurales', subtitle: '¿Tienes grietas en la pared y no sabes si son peligrosas? Obtén un informe técnico firmado por arquitecto o aparejador que te diga exactamente qué tipo de grieta tienes, qué la ha causado y qué debes hacer. En 24-48 horas, desde 90€.', cta_text: 'Analizar mis grietas gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
  specific: {
    types_title: '¿Todas las grietas son iguales de preocupantes?',
    types_intro: 'No. Existen diferencias importantes entre una fisura superficial (en el revestimiento o yeso) y una grieta estructural (en elementos portantes como muros de carga, pilares o forjados). Confundirlas puede llevar a gastar dinero en reparaciones innecesarias o, peor, a ignorar un problema grave.',
    col_ok_title: 'Generalmente no preocupantes',
    col_ok_items: ['Fisuras finas verticales en yeso o pintura', 'Grietas en esquinas entre tabiques', 'Fisuras por retracción en obras recientes', 'Grietas superficiales en cerámica o azulejo'],
    col_bad_title: 'Pueden ser estructurales',
    col_bad_items: ['Grietas horizontales en muros portantes', 'Grietas diagonales en esquinas de ventanas', 'Grietas que crecen con el tiempo', 'Grietas que atraviesan la pared de lado a lado'],
    when_title: '¿Cuándo necesitas un informe de grietas?',
    when_items: [
      { title: 'Grietas que aparecen de repente o crecen', desc: 'Una grieta que evoluciona en el tiempo puede indicar un problema activo que requiere intervención urgente.' },
      { title: 'Antes de comprar una vivienda con grietas', desc: 'El informe técnico te permite negociar el precio o descartar la compra si el riesgo es real.' },
      { title: 'Reclamar al promotor por defectos constructivos', desc: 'Las grietas estructurales en edificios nuevos pueden ser reclamadas al promotor durante el período de garantía.' },
      { title: 'Reclamar al seguro del hogar', desc: 'Si las grietas son consecuencia de un siniestro, el informe técnico es imprescindible para que el seguro lo cubra.' },
      { title: 'Tranquilidad ante una grieta antigua', desc: 'Saber si una grieta lleva años estabilizada o si sigue activa te evita la incertidumbre y los gastos innecesarios.' },
    ],
  },
  how_it_works: { section_title: 'Cómo obtienes el informe', steps: [{ title: 'Describe y fotografía', desc: 'Responde preguntas sobre la grieta y sube fotos con escala de referencia.' }, { title: 'Análisis técnico con IA', desc: 'Clasificamos el tipo de grieta, analizamos su morfología y causas probables.' }, { title: 'Informe firmado', desc: 'Un técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
  faq: { section_title: 'Preguntas frecuentes sobre grietas en viviendas', faqs: [{ q: '¿Es grave una grieta en la pared?', a: 'No todas las grietas son peligrosas. Las fisuras finas en yeso son habitualmente superficiales. Las grietas horizontales en elementos portantes o las diagonales que atraviesan la pared sí pueden indicar riesgo estructural.' }, { q: '¿Cómo saber si una grieta es estructural?', a: 'Una grieta puede ser estructural si supera 5 mm de anchura, es diagonal en esquinas de huecos, aparece en pilares o vigas, o si crece con el tiempo.' }, { q: '¿Qué hace el técnico al revisar una grieta?', a: 'Analiza la dirección, anchura y profundidad; la localización en el elemento constructivo; la causa probable y su evolución.' }, { q: '¿Cuánto cuesta el informe de grietas?', a: 'Un informe presencial cuesta entre 400€ y 1.000€. Nuestro informe remoto parte desde 90€ + IVA, con revisión de técnico cualificado.' }, { q: '¿Sirve para reclamar al seguro?', a: 'Sí. Si las grietas son consecuencia de un siniestro cubierto, el informe técnico acredita el daño y su origen.' }] },
  cta: { h2: '¿Tienes grietas y quieres saber si son peligrosas?', subtitle: 'Empieza con el análisis gratuito. Solo necesitas fotos de las grietas.', btn_text: 'Analizar mis grietas →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
  seo: { title: 'Informe Técnico de Grietas Estructurales · ¿Es peligrosa tu grieta? | Mi Casa Verde', description: '¿Tienes grietas en la pared y no sabes si son peligrosas? Informe técnico de grietas estructurales con revisión de técnico cualificado. Desde 90€, entrega en 24-48h.', og_title: 'Informe Técnico de Grietas Estructurales · Mi Casa Verde', og_description: '¿Es peligrosa tu grieta? Informe técnico con revisión de técnico cualificado. Desde 90€, entrega en 24-48h.', og_image_url: '' },
};

const InformeGrietasEstructurales = () => {
  const { content: d } = useLandingContent('landing_grietas', DEFAULT);
  const sp = d.specific as typeof DEFAULT.specific;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": d.faq.faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  };

  return (
    <>
      <Helmet>
        <title>{d.seo.title}</title>
        <meta name="description" content={d.seo.description} />
        <link rel="canonical" href="https://patologias.micasaverde.es/informe-grietas-estructurales" />
        <meta property="og:title" content={d.seo.og_title} />
        <meta property="og:description" content={d.seo.og_description} />
        <meta property="og:url" content="https://patologias.micasaverde.es/informe-grietas-estructurales" />
        {d.seo.og_image_url && <meta property="og:image" content={d.seo.og_image_url} />}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">

          {/* Hero */}
          <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24" style={d.hero.image_url ? { backgroundImage: `url(${d.hero.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">{d.hero.badge}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{d.hero.h1}</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">{d.hero.subtitle}</p>
              <Link to="/asistente" className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors shadow-lg">{d.hero.cta_text}</Link>
              <p className="text-sm text-muted-foreground mt-3">{d.hero.subnote}</p>
            </div>
          </section>

          {/* Crack types comparison */}
          <section className="py-14 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{sp.types_title}</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">{sp.types_intro}</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
                  <p className="font-bold text-foreground mb-2">{sp.col_ok_title}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {sp.col_ok_items.map((item, i) => <li key={i}>· {item}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-5">
                  <p className="font-bold text-foreground mb-2">{sp.col_bad_title}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {sp.col_bad_items.map((item, i) => <li key={i}>· {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* When you need it */}
          <section className="py-14 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{sp.when_title}</h2>
              <ul className="space-y-4">
                {sp.when_items.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start bg-background rounded-xl p-4 border border-border/50">
                    <span className="text-primary font-bold text-lg mt-0.5">✓</span>
                    <div><p className="font-semibold text-foreground">{item.title}</p><p className="text-muted-foreground text-sm mt-1">{item.desc}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* How it works */}
          <section className="py-14 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">{d.how_it_works.section_title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {d.how_it_works.steps.map((item, i) => (
                  <div key={i} className="text-center p-6 rounded-2xl border border-border/50 bg-muted/20">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">{i + 1}</div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-14 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{d.faq.section_title}</h2>
              <div className="space-y-4">
                {d.faq.faqs.map((faq, i) => (
                  <details key={i} className="bg-background rounded-xl border border-border/50 p-5 group">
                    <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center gap-4">
                      {faq.q}<span className="text-primary text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-primary/5 border-t border-primary/10">
            <div className="container mx-auto px-4 max-w-2xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{d.cta.h2}</h2>
              <p className="text-muted-foreground mb-8">{d.cta.subtitle}</p>
              <Link to="/asistente" className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors shadow-lg">{d.cta.btn_text}</Link>
              <p className="text-sm text-muted-foreground mt-3">{d.cta.subnote}</p>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default InformeGrietasEstructurales;
