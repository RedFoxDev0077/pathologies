import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLandingContent } from "@/hooks/useLandingContent";

const DEFAULT = {
  hero: { badge: 'Mi Casa Verde · Informe Pericial', h1: 'Informe Pericial de Humedades', subtitle: '¿Tienes humedades en tu vivienda y necesitas un documento oficial para reclamar al seguro, al vecino de arriba o a la comunidad de propietarios? Obtén un informe pericial firmado por técnico cualificado en 24-48 horas, desde 90€.', cta_text: 'Solicitar informe gratis →', subnote: 'Primer análisis gratuito · Sin compromiso', image_url: '' },
  specific: {
    what_is_title: '¿Qué es un informe pericial de humedades?',
    what_is_p1: 'Un informe pericial de humedades es un documento técnico elaborado por un técnico cualificado (arquitecto o aparejador) que analiza el origen, las causas y el alcance de las humedades en una vivienda. A diferencia de un presupuesto de obra, el informe pericial tiene valor probatorio: puede utilizarse para reclamar ante aseguradoras, vecinos, comunidades de propietarios y, en casos extremos, ante un juzgado.',
    what_is_p2: 'Los tipos de humedad más habituales son: humedades por capilaridad (suben del suelo), humedades por filtración (entran desde el exterior o desde el vecino de arriba), y humedades por condensación (vapor de agua interior). Cada tipo tiene causas y soluciones diferentes, y sólo un informe técnico puede determinar con precisión cuál es tu caso.',
    what_is_p3: 'En Mi Casa Verde ofrecemos un proceso ágil y accesible: subes fotos y vídeo del problema, nuestra IA realiza un primer análisis y un técnico cualificado revisa, completa y firma el informe definitivo. El resultado es un documento válido para cualquier reclamación, entregado en 24-48 horas desde 90€.',
    when_title: '¿Cuándo necesitas un informe pericial de humedades?',
    when_items: [
      { title: 'Reclamar al seguro del hogar', desc: 'La aseguradora te pide documentación técnica para tramitar la cobertura por daños por agua.' },
      { title: 'Humedad del vecino de arriba', desc: 'Necesitas probar ante el vecino o la comunidad que el origen está en su vivienda.' },
      { title: 'Reclamar a la comunidad de propietarios', desc: 'La filtración proviene de una cubierta, bajante o elemento común y el presidente no actúa.' },
      { title: 'Vender o comprar una vivienda', desc: 'Quieres conocer el estado real del inmueble antes de firmar o necesitas justificar una bajada de precio.' },
      { title: 'Discrepancia con el promotor o constructor', desc: 'Las humedades son consecuencia de un defecto constructivo y quieres reclamar en garantía.' },
    ],
  },
  how_it_works: { section_title: 'Cómo obtener tu informe en 3 pasos', steps: [{ title: 'Describe el problema', desc: 'Responde unas preguntas guiadas y sube fotos o vídeo de las humedades.' }, { title: 'Análisis técnico', desc: 'Nuestra IA analiza las evidencias y genera un pre-informe detallado.' }, { title: 'Informe firmado en 24-48h', desc: 'Un técnico cualificado revisa y firma el informe definitivo. Lo recibes por email.' }] },
  faq: { section_title: 'Preguntas frecuentes sobre el informe pericial de humedades', faqs: [{ q: '¿Quién puede hacer un informe pericial de humedades?', a: 'Debe ser elaborado por un técnico cualificado: arquitecto, aparejador o ingeniero de edificación. En Mi Casa Verde, cada informe es revisado y firmado por un técnico cualificado, con validez ante aseguradoras y comunidades de propietarios.' }, { q: '¿Cuánto cuesta un informe pericial de humedades?', a: 'Un informe pericial presencial oscila entre 300€ y 800€. Nuestro informe pericial remoto cuesta desde 90€ + IVA, con revisión humana obligatoria y entrega en 24-48 horas.' }, { q: '¿Sirve para reclamar al seguro del hogar?', a: 'Sí. El informe identifica el origen de la humedad y sus causas, los datos que la aseguradora necesita para tramitar la cobertura. Es el documento clave en cualquier reclamación.' }, { q: '¿Qué incluye el informe?', a: 'Tipo de humedad, causas probables, nivel de riesgo, recomendaciones de actuación, análisis de evidencias fotográficas y firma de técnico cualificado.' }, { q: '¿Qué hago si la humedad viene del vecino de arriba?', a: 'Con el informe pericial puedes reclamar al vecino, a su seguro o a la comunidad de propietarios. Sin documento técnico, tu reclamación puede ser ignorada.' }] },
  cta: { h2: '¿Tienes humedades y necesitas el informe?', subtitle: 'Empieza ahora gratis. Solo te pedimos fotos y una descripción del problema.', btn_text: 'Obtener informe pericial →', subnote: 'Análisis gratuito · Informe desde 90€ · Entrega 24-48h' },
  seo: { title: 'Informe Pericial de Humedades · Válido para Seguro y Comunidad | Mi Casa Verde', description: 'Informe pericial de humedades con revisión de técnico cualificado. Válido para reclamar al seguro del hogar o al vecino de arriba. Entrega en 24-48h. Desde 90€.', og_title: 'Informe Pericial de Humedades · Mi Casa Verde', og_description: 'Informe pericial de humedades con revisión humana. Válido para reclamar al seguro o al vecino. Desde 90€, entrega en 24-48h.', og_image_url: '' },
};

const InformePericialHumedades = () => {
  const { content: d } = useLandingContent('landing_humedades', DEFAULT);
  const sp = d.specific as typeof DEFAULT.specific;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": d.faq.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{d.seo.title}</title>
        <meta name="description" content={d.seo.description} />
        <link rel="canonical" href="https://patologias.micasaverde.es/informe-pericial-humedades" />
        <meta property="og:title" content={d.seo.og_title} />
        <meta property="og:description" content={d.seo.og_description} />
        <meta property="og:url" content="https://patologias.micasaverde.es/informe-pericial-humedades" />
        {d.seo.og_image_url && <meta property="og:image" content={d.seo.og_image_url} />}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">

          {/* Hero */}
          <section
            className="bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24"
            style={d.hero.image_url ? { backgroundImage: `url(${d.hero.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">{d.hero.badge}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{d.hero.h1}</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">{d.hero.subtitle}</p>
              <Link to="/asistente" className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors shadow-lg">
                {d.hero.cta_text}
              </Link>
              <p className="text-sm text-muted-foreground mt-3">{d.hero.subnote}</p>
            </div>
          </section>

          {/* What is it */}
          <section className="py-14 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{sp.what_is_title}</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">{sp.what_is_p1}</p>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">{sp.what_is_p2}</p>
              <p className="text-muted-foreground text-base leading-relaxed">{sp.what_is_p3}</p>
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
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                    </div>
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
                      {faq.q}
                      <span className="text-primary text-xl flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
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
              <Link to="/asistente" className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors shadow-lg">
                {d.cta.btn_text}
              </Link>
              <p className="text-sm text-muted-foreground mt-3">{d.cta.subnote}</p>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};

export default InformePericialHumedades;
