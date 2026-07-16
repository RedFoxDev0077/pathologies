import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Cookies() {
  return (
    <>
    <Helmet>
      <title>Política de Cookies | Mi Casa Verde</title>
      <meta name="description" content="Política de cookies de Mi Casa Verde. Información sobre el uso de cookies técnicas y analíticas en nuestro servicio de diagnóstico de patologías en vivienda." />
      <link rel="canonical" href="https://patologias.micasaverde.es/cookies" />
      <meta name="robots" content="index, follow" />
    </Helmet>
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">DT</span>
            </div>
            <span className="font-semibold text-foreground">
              Diagnóstico Técnico
            </span>
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la página principal
          </Link>

          <h1 className="mb-8 text-3xl font-semibold">Política de Cookies</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground">
              Última actualización: [FECHA_PLACEHOLDER]
            </p>

            <h2 className="mt-8 text-xl font-semibold">1. ¿Qué son las cookies?</h2>
            <p className="text-muted-foreground">
              Las cookies son pequeños archivos de texto que se almacenan en tu 
              dispositivo cuando visitas una página web. Permiten que la web 
              recuerde tus acciones y preferencias durante un período de tiempo.
            </p>

            <h2 className="mt-8 text-xl font-semibold">2. Tipos de cookies que utilizamos</h2>
            
            <h3 className="mt-6 text-lg font-semibold">Cookies técnicas (necesarias)</h3>
            <p className="text-muted-foreground">
              Son imprescindibles para el funcionamiento de la web. Incluyen:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Cookies de sesión para mantener tu progreso en el asistente</li>
              <li>Cookies de autenticación para usuarios registrados</li>
              <li>Cookies de seguridad</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold">Cookies analíticas</h3>
            <p className="text-muted-foreground">
              Nos permiten entender cómo los usuarios interactúan con la web para 
              mejorar el servicio. Se utilizan de forma anónima y agregada.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Cookies de preferencias</h3>
            <p className="text-muted-foreground">
              Recuerdan tus preferencias (como el perfil seleccionado) para 
              ofrecerte una experiencia personalizada.
            </p>

            <h2 className="mt-8 text-xl font-semibold">3. Gestión de cookies</h2>
            <p className="text-muted-foreground">
              Puedes configurar tu navegador para rechazar todas las cookies o 
              para que te avise cuando se envía una cookie. Sin embargo, algunas 
              funciones de la web pueden no funcionar correctamente sin cookies.
            </p>
            <p className="mt-4 text-muted-foreground">
              Instrucciones para los navegadores más comunes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Chrome: Configuración → Privacidad y seguridad → Cookies</li>
              <li>Firefox: Opciones → Privacidad y seguridad</li>
              <li>Safari: Preferencias → Privacidad</li>
              <li>Edge: Configuración → Cookies y permisos del sitio</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">4. Cookies de terceros</h2>
            <p className="text-muted-foreground">
              Podemos utilizar servicios de terceros que establecen sus propias 
              cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>[SERVICIO_ANALITICA_PLACEHOLDER]: para análisis de uso</li>
              <li>[SERVICIO_PAGO_PLACEHOLDER]: para procesar pagos seguros</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">5. Actualización de esta política</h2>
            <p className="text-muted-foreground">
              Esta política de cookies puede actualizarse periódicamente. Te 
              recomendamos revisarla de vez en cuando para estar informado de 
              cualquier cambio.
            </p>

            <h2 className="mt-8 text-xl font-semibold">6. Contacto</h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre nuestra política de cookies, puedes 
              contactarnos en [EMAIL_PLACEHOLDER].
            </p>
          </div>
        </div>
      </main>
    </div>
  </>
  );
}
