import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLandingContent } from "@/hooks/useLandingContent";

const DEFAULT = {
  hero: { badge: 'Mi Casa Verde · Informe para Comunidades', h1: 'Informe Técnico para Comunidad de Propietarios', subtitle: '¿Tienes humedades del vecino de arriba o de elementos comunes del edificio y la comunidad no actúa? Un informe técnico pericial es el documento que necesitas para reclamar con fundamento. En 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
  specific: {
    resp_title: '¿Quién es responsable de las humedades en un edificio?',
    resp_intro: 'Determinar quién paga la reparación de las humedades depende del origen de la filtración. Sin un informe técnico que lo establezca con claridad, vecinos y comunidades pueden negar su responsabilidad indefinidamente. El informe pericial es la herramienta que corta ese bloqueo.',
    col_vecino_title: '🏠 Responsabilidad del vecino',
    col_vecino_items: ['Rotura de tubería en su vivienda', 'Fallo en su instalación de fontanería', 'Desbordamiento de bañera, lavabo o lavadora', 'Filtración desde su terraza o balcón privativo'],
    col_comunidad_title: '🏢 Responsabilidad de la comunidad',
    col_comunidad_items: ['Filtración desde la cubierta o azotea', 'Bajante o tubería en elementos comunes', 'Humedad por fachada o cerramiento común', 'Filtración desde garaje o local comunitario'],
    claim_title: 'Cómo reclamar con el informe técnico',
    claim_steps: [
      { title: 'Obtén el informe técnico', desc: 'El informe pericial identifica el origen de la filtración y al responsable. Es tu punto de partida para cualquier reclamación.' },
      { title: 'Comunica la incidencia por escrito', desc: 'Envía al vecino o al presidente de la comunidad una comunicación fehaciente adjuntando el informe.' },
      { title: 'Reclamación a la aseguradora', desc: 'Si el responsable tiene seguro del hogar, puedes reclamar directamente a su aseguradora con el informe como soporte técnico.' },
      { title: 'Junta de propietarios', desc: 'Si la comunidad no actúa, puedes solicitar la convocatoria de junta extraordinaria o impugnar los acuerdos con el informe como base.' },
      { title: 'Vía judicial si es necesario', desc: 'En última instancia, el informe técnico pericial sirve como prueba en un procedimiento judicial para exigir la reparación y los daños.' },
    ],
  },
  how_it_works: { section_title: 'Cómo obtienes el informe', steps: [{ title: 'Describe las humedades', desc: 'Cuéntanos dónde están, cuándo aparecieron y sube fotos o vídeo del problema.' }, { title: 'Análisis del origen', desc: 'Identificamos si la filtración viene del vecino, de elementos comunes o de otro origen.' }, { title: 'Informe para reclamar', desc: 'Técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
  faq: { section_title: 'Preguntas frecuentes sobre reclamaciones a la comunidad', faqs: [{ q: '¿Quién paga las humedades del vecino de arriba?', a: 'Si la filtración proviene de la vivienda del vecino, paga él o su seguro. Si proviene de elementos comunes (cubierta, bajantes), paga la comunidad. El informe técnico pericial determina el origen y, por tanto, quién es responsable.' }, { q: '¿Qué documento necesito para reclamar al vecino?', a: 'Un informe técnico pericial que acredite que el origen de la filtración está en su vivienda. Sin ese documento, el vecino puede negar su responsabilidad sin base legal para rebatirle.' }, { q: '¿Puede la comunidad negarse a reparar las humedades?', a: 'La comunidad tiene obligación legal de mantener los elementos comunes. Si se niega, puedes reclamar formalmente con el informe técnico y, si persiste, acudir al juzgado de primera instancia.' }, { q: '¿Cuánto cuesta un informe para la comunidad?', a: 'Un informe presencial puede costar entre 400€ y 1.200€. Nuestro informe remoto parte desde 90€ + IVA, con revisión de técnico cualificado y entrega en 24-48h.' }, { q: '¿Qué hago si el presidente de la comunidad no actúa?', a: 'Envía un burofax formal con el informe técnico adjunto. Si no hay respuesta, convoca junta extraordinaria o acude al juzgado. El informe es imprescindible para que cualquiera de estas vías prospere.' }] },
  cta: { h2: '¿Necesitas el informe para reclamar al vecino o a la comunidad?', subtitle: 'Empieza ahora. Solo necesitas fotos de las humedades y la descripción del problema.', btn_text: 'Obtener informe para reclamar →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
  seo: { title: 'Informe Técnico para Comunidad de Propietarios · Humedades y Filtraciones | Mi Casa Verde', description: '¿Humedades del vecino de arriba o de elementos comunes? Informe técnico para reclamar a la comunidad de propietarios o al vecino. Desde 90€, entrega en 24-48h.', og_title: 'Informe para Comunidad de Propietarios · Mi Casa Verde', og_description: 'Informe técnico para reclamar humedades al vecino o a la comunidad. Desde 90€, revisado por técnico cualificado, entrega en 24-48h.', og_image_url: '' },
};

const InformeComunidad = () => {
  const { content: d } = useLandingContent('landing_comunidad', DEFAULT);
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
        <link rel="canonical" href="https://patologias.micasaverde.es/informe-comunidad-propietarios" />
        <meta property="og:title" content={d.seo.og_title} />
        <meta property="og:description" content={d.seo.og_description} />
        <meta property="og:url" content="https://patologias.micasaverde.es/informe-comunidad-propietarios" />
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

          {/* Who is responsible */}
          <section className="py-14 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{sp.resp_title}</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">{sp.resp_intro}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                  <p className="font-bold text-foreground mb-3">{sp.col_vecino_title}</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {sp.col_vecino_items.map((item, i) => <li key={i}>· {item}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                  <p className="font-bold text-foreground mb-3">{sp.col_comunidad_title}</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {sp.col_comunidad_items.map((item, i) => <li key={i}>· {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How to claim */}
          <section className="py-14 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{sp.claim_title}</h2>
              <ol className="space-y-4">
                {sp.claim_steps.map((step, i) => (
                  <li key={i} className="flex gap-4 items-start bg-background rounded-xl p-4 border border-border/50">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div><p className="font-semibold text-foreground">{step.title}</p><p className="text-muted-foreground text-sm mt-1">{step.desc}</p></div>
                  </li>
                ))}
              </ol>
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

export default InformeComunidad;
