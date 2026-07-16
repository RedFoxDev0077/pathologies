import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLandingContent } from "@/hooks/useLandingContent";

const DEFAULT = {
  hero: { badge: 'Mi Casa Verde · Informe para Seguros', h1: 'Informe de Daños para Reclamar al Seguro del Hogar', subtitle: '¿Tu aseguradora te pide un informe técnico de los daños? Obtén un informe pericial firmado por técnico cualificado, válido para humedades, grietas o filtraciones. En 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
  specific: {
    why_title: '¿Por qué necesitas un informe técnico para reclamar al seguro?',
    why_p1: 'Cuando sufres un daño en tu vivienda —una filtración de agua, una grieta inesperada, humedades por rotura de tubería— la compañía de seguros envía a su propio perito para valorar los daños. Ese perito trabaja para la aseguradora, no para ti.',
    why_p2: 'Contar con tu propio informe técnico pericial independiente te permite:',
    why_checklist: ['Contrastar la valoración del perito de la aseguradora con criterio técnico propio', 'Acreditar el origen exacto del daño y que está cubierto por la póliza', 'Impugnar el rechazo de la reclamación si la aseguradora no acepta', 'Documentar el daño antes de que se repare y se pierdan las evidencias', 'Tener base técnica para una reclamación judicial si es necesario'],
    types_title: 'Tipos de daños para los que elaboramos el informe',
    types_items: [
      { icon: '💧', title: 'Humedades por filtración', desc: 'Agua que entra desde el exterior, cubiertas, fachadas o vecino de arriba.' },
      { icon: '🔧', title: 'Rotura de tuberías', desc: 'Daños por fuga de agua en instalaciones de fontanería o calefacción.' },
      { icon: '⬆️', title: 'Filtraciones desde el vecino', desc: 'Agua que proviene de la vivienda del piso superior o colindante.' },
      { icon: '🏚️', title: 'Grietas por siniestro', desc: 'Grietas aparecidas tras un evento concreto (hundimiento, impacto, etc.).' },
      { icon: '🌧️', title: 'Daños por lluvia o viento', desc: 'Filtraciones en cubierta o carpinterías por fenómenos atmosféricos.' },
      { icon: '📋', title: 'Daños en elementos comunes', desc: 'Daños en zonas comunes del edificio con repercusión en tu vivienda.' },
    ],
  },
  how_it_works: { section_title: 'Cómo obtienes el informe para tu seguro', steps: [{ title: 'Describe el daño', desc: 'Responde preguntas guiadas sobre el tipo de daño y sube fotos o vídeos.' }, { title: 'Análisis técnico', desc: 'Identificamos el origen del daño, su extensión y las causas probables.' }, { title: 'Informe para el seguro', desc: 'Técnico cualificado revisa y firma. Recibes el informe en 24-48h por email.' }] },
  faq: { section_title: 'Preguntas frecuentes sobre reclamaciones al seguro del hogar', faqs: [{ q: '¿Sirve un informe técnico para reclamar al seguro del hogar?', a: 'Sí. El informe acredita el origen y extensión del daño, información clave para que la aseguradora determine si el siniestro está cubierto. Sin informe técnico, la reclamación se apoya solo en tu palabra.' }, { q: '¿Qué necesito para reclamar daños al seguro?', a: 'Comunicar el siniestro en plazo, aportar un informe técnico pericial del daño y documentación fotográfica. El informe es especialmente importante si la aseguradora envía a su propio perito.' }, { q: '¿Puede el seguro rechazar mi reclamación con informe?', a: 'Puede intentarlo, pero un informe técnico pericial independiente refuerza tu posición y permite impugnar el rechazo. Es mucho más difícil rechazar una reclamación documentada.' }, { q: '¿Cuánto tiempo tiene el seguro para resolver?', a: 'Según la Ley del Contrato de Seguro, la aseguradora tiene 40 días para comunicar su decisión desde que recibe la documentación completa. El informe activa ese plazo.' }, { q: '¿Qué daños cubre el seguro del hogar?', a: 'Habitualmente: rotura de tuberías, filtraciones accidentales, fenómenos atmosféricos, incendios y responsabilidad civil. Las humedades por falta de mantenimiento pueden no estar cubiertas: el informe acredita la causa exacta.' }] },
  cta: { h2: '¿Necesitas el informe para reclamar al seguro?', subtitle: 'Empieza ahora. Solo necesitas fotos del daño y la descripción del problema.', btn_text: 'Solicitar informe para el seguro →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
  seo: { title: 'Informe de Daños para Reclamar al Seguro del Hogar | Mi Casa Verde', description: '¿El seguro te pide un informe de daños? Obtenlo en 24-48h desde 90€. Válido para reclamar humedades, grietas o filtraciones ante tu aseguradora. Revisado por técnico cualificado.', og_title: 'Informe de Daños para Reclamar al Seguro del Hogar · Mi Casa Verde', og_description: 'Informe técnico de daños válido para reclamar al seguro. Revisado por técnico cualificado. Desde 90€, entrega en 24-48h.', og_image_url: '' },
};

const InformeDanosSeguro = () => {
  const { content: d } = useLandingContent('landing_danos', DEFAULT);
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
        <link rel="canonical" href="https://patologias.micasaverde.es/informe-danos-seguro-hogar" />
        <meta property="og:title" content={d.seo.og_title} />
        <meta property="og:description" content={d.seo.og_description} />
        <meta property="og:url" content="https://patologias.micasaverde.es/informe-danos-seguro-hogar" />
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

          {/* Why you need it */}
          <section className="py-14 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{sp.why_title}</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">{sp.why_p1}</p>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">{sp.why_p2}</p>
              <ul className="space-y-3 mb-6">
                {sp.why_checklist.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span className="text-muted-foreground text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Damage types */}
          <section className="py-14 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{sp.types_title}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {sp.types_items.map((item, i) => (
                  <div key={i} className="bg-background rounded-xl border border-border/50 p-5 flex gap-4 items-start">
                    <span className="text-2xl">{item.icon}</span>
                    <div><p className="font-semibold text-foreground mb-1">{item.title}</p><p className="text-muted-foreground text-sm">{item.desc}</p></div>
                  </div>
                ))}
              </div>
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

export default InformeDanosSeguro;
