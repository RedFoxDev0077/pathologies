import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WhatsAppButton } from "@/components/chat/WhatsAppButton";

// Eagerly load the main landing page for fast initial render
import Index from "./pages/Index";

// Lazy load other pages - they load on demand when navigated to
const InformePericalHumedades = lazy(() => import("./pages/seo/InformePericialHumedades"));
const InformeGrietasEstructurales = lazy(() => import("./pages/seo/InformeGrietasEstructurales"));
const InformeDanosSeguro = lazy(() => import("./pages/seo/InformeDanosSeguro"));
const InformeComunidad = lazy(() => import("./pages/seo/InformeComunidad"));
const Asistente = lazy(() => import("./pages/Asistente"));
const AsistenteExpediente = lazy(() => import("./pages/AsistenteExpediente"));
const AsistenteConfirmacion = lazy(() => import("./pages/AsistenteConfirmacion"));
const InformeCompleto = lazy(() => import("./pages/InformeCompleto"));
const PagoExitoso = lazy(() => import("./pages/PagoExitoso"));
const Admin = lazy(() => import("./pages/Admin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const Cookies = lazy(() => import("./pages/Cookies"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const InformePublico = lazy(() => import("./pages/InformePublico"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="text-muted-foreground text-sm">Cargando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

// JSON-LD Schema para SEO - LocalBusiness / ProfessionalService
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Mi Casa Verde",
  "description": "Servicio de diagnóstico técnico de patologías en viviendas con revisión humana obligatoria. Humedades, grietas, filtraciones y más. Informe profesional en 24-48 horas.",
  "url": "https://patologias.micasaverde.es",
  "logo": "https://patologias.micasaverde.es/og-image.jpg",
  "image": "https://patologias.micasaverde.es/og-image.jpg",
  "telephone": "+34634278435",
  "email": "info@micasaverde.es",
  "areaServed": {
    "@type": "Country",
    "name": "España"
  },
  "serviceType": [
    "Informe pericial humedades",
    "Informe grietas estructurales",
    "Informe daños seguro hogar",
    "Perito daños vivienda",
    "Informe técnico comunidad propietarios",
    "Informe pericial vivienda",
    "Perito filtraciones vivienda",
    "Informe daños en vivienda"
  ],
  "priceRange": "€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Tarjeta de crédito, Tarjeta de débito",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ES"
  }
};

const App = () => (
  <HelmetProvider>
    <ThemeProvider defaultTheme="system" storageKey="diagnostico-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Helmet>
              <html lang="es" />
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#3d8a7e" />
              <link rel="canonical" href="https://patologias.micasaverde.es/" />
              <script type="application/ld+json">
                {JSON.stringify(jsonLdSchema)}
              </script>
            </Helmet>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <WhatsAppButton />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/informe-pericial-humedades" element={<InformePericalHumedades />} />
                  <Route path="/informe-grietas-estructurales" element={<InformeGrietasEstructurales />} />
                  <Route path="/informe-danos-seguro-hogar" element={<InformeDanosSeguro />} />
                  <Route path="/informe-comunidad-propietarios" element={<InformeComunidad />} />
                  <Route path="/iniciar-sesion" element={<SignIn />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/registro" element={<SignUp />} />
                  <Route path="/crear-cuenta" element={<SignUp />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/asistente" element={<Asistente />} />
                  <Route path="/asistente/expediente/:id" element={<AsistenteExpediente />} />
                  <Route path="/asistente-expediente/:id" element={<AsistenteExpediente />} />
                  <Route path="/asistente-expediente" element={<Asistente />} />
                  <Route path="/informe-completo/:caseId" element={<InformeCompleto />} />
                  <Route path="/asistente/confirmacion" element={<AsistenteConfirmacion />} />
                  <Route path="/asistente/pago-exitoso" element={<PagoExitoso />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/informe/:caseId" element={<InformePublico />} />
                  <Route path="/privacidad" element={<Privacidad />} />
                  <Route path="/aviso-legal" element={<AvisoLegal />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
