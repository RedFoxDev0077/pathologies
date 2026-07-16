import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Privacidad() {
  return (
    <>
    <Helmet>
      <title>Política de Privacidad | Mi Casa Verde</title>
      <meta name="description" content="Política de privacidad de Mi Casa Verde. Información sobre el tratamiento de tus datos personales conforme al RGPD y la normativa española." />
      <link rel="canonical" href="https://patologias.micasaverde.es/privacidad" />
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

          <h1 className="mb-8 text-3xl font-semibold">Política de Privacidad</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground">
              Última actualización: [FECHA_PLACEHOLDER]
            </p>

            <h2 className="mt-8 text-xl font-semibold">1. Responsable del tratamiento</h2>
            <p className="text-muted-foreground">
              [NOMBRE_EMPRESA_PLACEHOLDER]<br />
              [DIRECCIÓN_PLACEHOLDER]<br />
              [CIF_PLACEHOLDER]<br />
              Contacto: [EMAIL_PLACEHOLDER]
            </p>

            <h2 className="mt-8 text-xl font-semibold">2. Datos que recopilamos</h2>
            <p className="text-muted-foreground">
              Recopilamos los siguientes datos personales:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Datos identificativos: nombre, email, teléfono (si se proporciona)</li>
              <li>Evidencias: fotos y vídeos de las patologías</li>
              <li>Descripciones del problema y respuestas al cuestionario</li>
              <li>Perfil de usuario: particular, abogado o administrador de fincas</li>
              <li>Datos de pago (procesados por terceros de confianza)</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">3. Finalidad del tratamiento</h2>
            <p className="text-muted-foreground">
              Los datos se tratan para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Prestar el servicio de diagnóstico de patologías</li>
              <li>Generar informes técnicos</li>
              <li>Gestionar el pago de los servicios contratados</li>
              <li>Comunicaciones relacionadas con el servicio</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">4. Base legal</h2>
            <p className="text-muted-foreground">
              El tratamiento de datos se basa en:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>La ejecución del contrato de servicios</li>
              <li>El consentimiento expreso del usuario</li>
              <li>El cumplimiento de obligaciones legales</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">5. Conservación de datos</h2>
            <p className="text-muted-foreground">
              Los datos se conservarán durante el tiempo necesario para la prestación 
              del servicio y posteriormente durante los plazos legalmente establecidos.
            </p>

            <h2 className="mt-8 text-xl font-semibold">6. Derechos del usuario</h2>
            <p className="text-muted-foreground">
              El usuario puede ejercer los siguientes derechos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Acceso a sus datos personales</li>
              <li>Rectificación de datos inexactos</li>
              <li>Supresión de datos</li>
              <li>Limitación del tratamiento</li>
              <li>Portabilidad de datos</li>
              <li>Oposición al tratamiento</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Para ejercer estos derechos, contacte con [EMAIL_PLACEHOLDER].
            </p>

            <h2 className="mt-8 text-xl font-semibold">7. Seguridad</h2>
            <p className="text-muted-foreground">
              Implementamos medidas técnicas y organizativas para proteger los datos 
              personales, incluyendo cifrado, accesos temporales controlados y 
              trazabilidad de los expedientes.
            </p>

            <h2 className="mt-8 text-xl font-semibold">8. Reclamaciones</h2>
            <p className="text-muted-foreground">
              Si considera que sus derechos no han sido debidamente atendidos, puede 
              presentar una reclamación ante la Agencia Española de Protección de 
              Datos (www.aepd.es).
            </p>
          </div>
        </div>
      </main>
    </div>
  </>
  );
}
