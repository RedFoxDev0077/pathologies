import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function AvisoLegal() {
  return (
    <>
    <Helmet>
      <title>Aviso Legal | Mi Casa Verde</title>
      <meta name="description" content="Aviso legal de Mi Casa Verde. Condiciones de uso, información del titular y responsabilidades del servicio de diagnóstico de patologías en viviendas." />
      <link rel="canonical" href="https://patologias.micasaverde.es/aviso-legal" />
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

          <h1 className="mb-8 text-3xl font-semibold">Aviso Legal</h1>

          <div className="prose prose-gray max-w-none">
            <h2 className="mt-8 text-xl font-semibold">1. Datos identificativos</h2>
            <p className="text-muted-foreground">
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, 
              de Servicios de la Sociedad de la Información y Comercio Electrónico, 
              se informa:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Denominación social: [NOMBRE_EMPRESA_PLACEHOLDER]</li>
              <li>CIF: [CIF_PLACEHOLDER]</li>
              <li>Domicilio: [DIRECCIÓN_PLACEHOLDER]</li>
              <li>Email: [EMAIL_PLACEHOLDER]</li>
              <li>Inscripción registral: [REGISTRO_PLACEHOLDER]</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">2. Objeto</h2>
            <p className="text-muted-foreground">
              Esta web ofrece un servicio de diagnóstico preliminar de patologías 
              en viviendas, asistido por inteligencia artificial y con revisión 
              humana obligatoria antes de la emisión de cualquier informe.
            </p>

            <h2 className="mt-8 text-xl font-semibold">3. Naturaleza del servicio</h2>
            <p className="text-muted-foreground">
              El servicio prestado tiene carácter orientativo y preliminar. 
              Los informes emitidos no sustituyen una inspección presencial 
              cuando esta sea necesaria, ni constituyen un dictamen pericial 
              en el sentido procesal del término, salvo que expresamente se 
              indique lo contrario.
            </p>

            <h2 className="mt-8 text-xl font-semibold">4. Propiedad intelectual</h2>
            <p className="text-muted-foreground">
              Todos los contenidos de esta web (textos, imágenes, diseño, código, 
              marcas) son propiedad de [NOMBRE_EMPRESA_PLACEHOLDER] o de terceros 
              que han autorizado su uso. Queda prohibida su reproducción sin 
              autorización expresa.
            </p>

            <h2 className="mt-8 text-xl font-semibold">5. Responsabilidad</h2>
            <p className="text-muted-foreground">
              [NOMBRE_EMPRESA_PLACEHOLDER] no se hace responsable de:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Decisiones tomadas por el usuario basándose únicamente en la orientación preliminar</li>
              <li>Errores derivados de información incompleta o inexacta proporcionada por el usuario</li>
              <li>Interrupciones del servicio por causas ajenas a su control</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">6. Legislación aplicable</h2>
            <p className="text-muted-foreground">
              Este aviso legal se rige por la legislación española. Para cualquier 
              controversia, las partes se someten a los juzgados y tribunales de 
              [CIUDAD_PLACEHOLDER], con renuncia a cualquier otro fuero que pudiera 
              corresponderles.
            </p>

            <h2 className="mt-8 text-xl font-semibold">7. Modificaciones</h2>
            <p className="text-muted-foreground">
              [NOMBRE_EMPRESA_PLACEHOLDER] se reserva el derecho a modificar este 
              aviso legal sin previo aviso. Las modificaciones serán efectivas 
              desde su publicación en la web.
            </p>
          </div>
        </div>
      </main>
    </div>
  </>
  );
}
