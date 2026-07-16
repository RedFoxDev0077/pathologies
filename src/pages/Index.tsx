import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ParallaxSection } from "@/components/layout/ParallaxSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { PathologiesSection } from "@/components/landing/PathologiesSection";
import { HumanReviewSection } from "@/components/landing/HumanReviewSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PacksSection } from "@/components/landing/PacksSection";
import { ProfilesSection } from "@/components/landing/ProfilesSection";
import { TransparencySection } from "@/components/landing/TransparencySection";
import { HowItWorksVideoSection } from "@/components/landing/HowItWorksVideoSection";
import { MobileStickyCta } from "@/components/landing/MobileStickyCta";

const FloatingCtaIcon = lazy(() => import("@/components/landing/FloatingCtaIcon").then(m => ({ default: m.FloatingCtaIcon })));
const ChatContainer = lazy(() => import("@/components/chat").then(m => ({ default: m.ChatContainer })));
const FAQSection = lazy(() => import("@/components/landing/FAQSection").then(m => ({ default: m.FAQSection })));

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Diagnóstico Técnico de Grietas y Humedades | Informe Online desde 400€ | Mi Casa Verde</title>
        <meta name="description" content="Diagnóstico de humedades en Valencia e informe técnico de grietas en vivienda. Perito arquitecto online: análisis por fotos/vídeos + consulta telefónica + informe firmado desde 400€ + IVA. Vicios constructivos, seguros y comunidades." />
        <link rel="canonical" href="https://patologias.micasaverde.es/" />
        <meta property="og:title" content="Diagnóstico Técnico de Grietas y Humedades | Informe Online desde 400€ | Mi Casa Verde" />
        <meta property="og:description" content="Perito arquitecto online: diagnóstico de humedades y grietas por fotos/vídeos + consulta telefónica + informe firmado desde 400€ + IVA. Válido para seguros y comunidades." />
        <meta property="og:url" content="https://patologias.micasaverde.es/" />
        <meta property="og:image" content="https://patologias.micasaverde.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Mi Casa Verde",
          "url": "https://patologias.micasaverde.es",
          "description": "Diagnóstico técnico de grietas, humedades y filtraciones en viviendas. Informe pericial online firmado por arquitecto colegiado.",
          "areaServed": "Spain",
          "priceRange": "€€",
          "telephone": "+34634278435",
          "founder": {
            "@type": "Person",
            "name": "José Francisco Castillo Miras",
            "jobTitle": "Arquitecto Colegiado nº 12.279 COACV / 3.353 COIAT Valencia"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios de diagnóstico de patologías",
            "itemListElement": [
              {
                "@type": "Offer",
                "name": "Análisis Técnico Orientativo",
                "price": "0",
                "priceCurrency": "EUR",
                "description": "Asistente IA. Pre-diagnóstico en pantalla. Sin PDF, sin firma."
              },
              {
                "@type": "Offer",
                "name": "Informe Técnico Online",
                "price": "400",
                "priceCurrency": "EUR",
                "description": "Análisis completo por fotos/vídeos + consulta telefónica. Informe PDF firmado por arquitecto colegiado. (+ IVA)"
              },
              {
                "@type": "Offer",
                "name": "Informe Pericial Presencial",
                "price": "950",
                "priceCurrency": "EUR",
                "description": "Inspección in situ obligatoria. Documentación pericial completa. Válido para litigios. (+ IVA)"
              },
              {
                "@type": "Offer",
                "name": "Proyecto de Intervención",
                "price": "2000",
                "priceCurrency": "EUR",
                "description": "Proyecto técnico completo. Mediciones, presupuesto y dirección facultativa. Desde 2.000€ (+ IVA)"
              }
            ]
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "ProfessionalService",
            "name": "Mi Casa Verde"
          },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "author": { "@type": "Person", "name": "María G., propietaria en Valencia" },
          "reviewBody": "Hice el análisis gratis, subí las fotos, hablé con el arquitecto por teléfono y en 48 horas tenía el informe. Me ahorró una obra de 8.000 € que no necesitaba."
        })}</script>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">

          {/* Hero with fullscreen video background - includes trust bar */}
          <HeroSection />

          {/* Problem + Process Zone */}
          <ParallaxSection background="process" overlay="gradient">
            <ProblemSection />
            <HowItWorksVideoSection />
            <PathologiesSection />
          </ParallaxSection>

          {/* Human Review Section */}
          <HumanReviewSection />

          {/* Testimonials */}
          <TestimonialsSection />

          {/* Services Zone */}
          <ParallaxSection background="services" overlay="gradient">
            <PacksSection />
            <ProfilesSection />
          </ParallaxSection>

          {/* Trust Zone */}
          <ParallaxSection background="trust" overlay="gradient">
            <TransparencySection />
            <Suspense fallback={null}>
              <FAQSection />
            </Suspense>
          </ParallaxSection>

        </main>
        <Footer />

        <Suspense fallback={null}>
          <FloatingCtaIcon />
          <ChatContainer />
        </Suspense>

        {/* Sticky mobile CTA — always visible on small screens */}
        <MobileStickyCta />
      </div>
    </>
  );
};

export default Index;
