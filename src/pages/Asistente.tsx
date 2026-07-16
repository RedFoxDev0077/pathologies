import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Scale, Building, ArrowRight, Camera, FileVideo, MessageSquare, Shield } from "lucide-react";
import { UserProfile } from "@/types/expediente";
import { useExpediente } from "@/hooks/useExpediente";

const profiles = [
  {
    id: "particular" as const,
    icon: User,
    title: "Particular",
    description: "Tengo un problema en mi vivienda y quiero entender qué ocurre.",
  },
  {
    id: "abogado" as const,
    icon: Scale,
    title: "Abogado",
    description: "Necesito documentación técnica para un procedimiento legal.",
  },
  {
    id: "administrador" as const,
    icon: Building,
    title: "Administrador de fincas",
    description: "Gestiono incidencias en comunidades de propietarios.",
  },
];

const checklist = [
  { icon: Camera, text: "Fotos claras de la zona afectada (ideal 3-6, máx. 10)" },
  { icon: FileVideo, text: "Vídeos si hay goteo o movimiento (máx. 2, 200MB total)" },
  { icon: MessageSquare, text: "Descripción de cuándo empezó y cómo ha evolucionado" },
];

export default function Asistente() {
  const navigate = useNavigate();
  const { initExpediente, loading } = useExpediente();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [consentimiento, setConsentimiento] = useState(false);

  const handleProfileSelect = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setShowChecklist(true);
  };

  const handleBack = () => {
    setShowChecklist(false);
    setSelectedProfile(null);
    setConsentimiento(false);
  };

  const handleStartChat = async () => {
    if (!selectedProfile || !consentimiento) return;

    const expediente = await initExpediente(selectedProfile);
    navigate(`/asistente/expediente/${expediente.id}`);
  };

  return (
    <>
    <Helmet>
      <title>Iniciar Diagnóstico Gratuito | Mi Casa Verde</title>
      <meta name="description" content="Inicia tu diagnóstico técnico gratuito de patologías en vivienda. Selecciona tu perfil y describe el problema para obtener un análisis preliminar con IA." />
      <link rel="canonical" href="https://patologias.micasaverde.es/asistente" />
    </Helmet>
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">DT</span>
            </div>
            <span className="font-semibold text-foreground">Diagnóstico Técnico</span>
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          {!showChecklist ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Inicia tu diagnóstico</h1>
                <p className="text-muted-foreground">Selecciona tu perfil para adaptar el asistente</p>
              </div>

              <div className="space-y-4">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className="card-institutional w-full p-6 text-left transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
                        <profile.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="mb-1 text-lg font-semibold">{profile.title}</h2>
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      </div>
                      <ArrowRight className="ml-auto h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  ← Volver a la página principal
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Cambiar perfil
              </button>

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent/50 px-3 py-1 text-sm">
                  {selectedProfile === "particular" && <User className="h-4 w-4" />}
                  {selectedProfile === "abogado" && <Scale className="h-4 w-4" />}
                  {selectedProfile === "administrador" && <Building className="h-4 w-4" />}
                  <span className="capitalize">{selectedProfile}</span>
                </div>
                <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Antes de empezar</h1>
                <p className="text-muted-foreground">
                  Para obtener una orientación más precisa, te recomendamos tener preparado lo siguiente:
                </p>
              </div>

              <div className="card-institutional mb-6 p-6">
                <h2 className="mb-4 font-semibold">Qué vas a necesitar</h2>
                <ul className="space-y-4">
                  {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="pt-1 text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-institutional mb-6 border-l-4 border-l-primary bg-accent/30 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> No te preocupes si no tienes toda la
                  información. El asistente te guiará paso a paso.
                </p>
              </div>

              {/* Consentimiento RGPD */}
              <div className="mb-6 rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consentimiento"
                    checked={consentimiento}
                    onCheckedChange={(checked) => setConsentimiento(checked === true)}
                  />
                  <label htmlFor="consentimiento" className="text-sm leading-relaxed cursor-pointer">
                    Acepto la{" "}
                    <Link to="/privacidad" className="text-primary underline-offset-2 hover:underline">
                      política de privacidad
                    </Link>{" "}
                    y el tratamiento de datos para el análisis del expediente según el{" "}
                    <Link to="/aviso-legal" className="text-primary underline-offset-2 hover:underline">
                      aviso legal
                    </Link>
                    .
                  </label>
                </div>
              </div>

              <Button
                variant="cta"
                size="xl"
                className="w-full"
                onClick={handleStartChat}
                disabled={!consentimiento || loading}
              >
                <Shield className="h-5 w-5" />
                {loading ? 'Creando expediente...' : 'Iniciar chat'}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">Tiempo estimado: 3–6 minutos</p>
            </>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
