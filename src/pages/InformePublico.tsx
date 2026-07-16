import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Clock, FileText, MapPin, Home, AlertTriangle, QrCode } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://patologias.micasaverde.es/api';

interface PublicCaseInfo {
  caseId: string;
  state: string;
  profile: string;
  clientName: string | null;
  localizacion: string | null;
  tipoDano: string | null;
  antiguedad: string | null;
  createdAt: string;
  paid: boolean;
  reportSent: boolean;
  reportSentAt: string | null;
  reportVersion: number | null;
}

const LOCALIZACION: Record<string, string> = {
  pared: 'Pared', suelo: 'Suelo', techo: 'Techo', fachada: 'Fachada exterior',
  cubierta: 'Cubierta / tejado', instalacion: 'Instalación', no_lo_se: 'No especificado',
};
const TIPO_DANO: Record<string, string> = {
  grieta: 'Grieta / fisura', humedad: 'Humedad / mancha', desconchados: 'Desconchados',
  deformaciones: 'Deformaciones', olor_ruido: 'Olor / ruido anómalo', no_lo_se: 'No especificado',
};
const ANTIGUEDAD: Record<string, string> = {
  dias: 'Días', semanas: 'Semanas', meses: 'Meses', años: 'Años', no_lo_se: 'No especificado',
};

export default function InformePublico() {
  const { caseId } = useParams<{ caseId: string }>();
  const [info, setInfo] = useState<PublicCaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    axios.get(`${API_BASE}/cases/public/${caseId}/info`)
      .then(r => setInfo(r.data))
      .catch(() => setError('Expediente no encontrado o código QR inválido.'))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Verificando expediente...</p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-semibold">Expediente no encontrado</h1>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Link to="/" className="inline-block text-primary underline text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const reportDate = info.reportSentAt
    ? new Date(info.reportSentAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const createdDate = new Date(info.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Helmet>
        <title>Verificación Informe {info.caseId} · Mi Casa Verde</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">

          {/* Header */}
          <div className="text-center space-y-1 pb-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <QrCode className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">Mi Casa Verde</span>
            </div>
            <h1 className="text-2xl font-bold">Verificación de Informe</h1>
            <p className="text-muted-foreground text-sm">Expediente escaneado con código QR</p>
          </div>

          {/* Status card */}
          <div className={`rounded-2xl border-2 p-5 space-y-4 ${info.reportSent ? 'border-green-500/40 bg-green-500/5' : info.paid ? 'border-blue-500/40 bg-blue-500/5' : 'border-border bg-card'}`}>

            {/* Badge */}
            <div className="flex items-center gap-3">
              {info.reportSent ? (
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Informe entregado</span>
                </div>
              ) : info.paid ? (
                <div className="flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">En preparación</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-muted border border-border px-3 py-1.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Análisis gratuito</span>
                </div>
              )}
            </div>

            {/* Case ID */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">N.º Expediente</p>
              <p className="text-xl font-mono font-bold text-primary">{info.caseId}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {info.localizacion && (
                <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Localización
                  </p>
                  <p className="text-sm font-medium">{LOCALIZACION[info.localizacion] || info.localizacion}</p>
                </div>
              )}
              {info.tipoDano && (
                <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Tipo de daño
                  </p>
                  <p className="text-sm font-medium">{TIPO_DANO[info.tipoDano] || info.tipoDano}</p>
                </div>
              )}
              {info.antiguedad && (
                <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Antigüedad
                  </p>
                  <p className="text-sm font-medium">{ANTIGUEDAD[info.antiguedad] || info.antiguedad}</p>
                </div>
              )}
              <div className="rounded-xl bg-background/60 border border-border/50 p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Fecha solicitud</p>
                <p className="text-sm font-medium">{createdDate}</p>
              </div>
            </div>

            {/* Report sent info */}
            {info.reportSent && reportDate && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 space-y-1">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Informe técnico emitido</p>
                <p className="text-sm text-green-800">
                  Entregado el {reportDate}
                  {info.reportVersion && ` · Versión ${info.reportVersion}`}
                </p>
                <p className="text-xs text-green-700/70">
                  Este documento ha sido revisado y firmado por un técnico de Mi Casa Verde.
                </p>
              </div>
            )}

            {/* Client name */}
            {info.clientName && (
              <p className="text-xs text-muted-foreground">
                Solicitante: <span className="font-medium">{info.clientName}</span>
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 pt-1">
            <p className="text-xs text-muted-foreground">
              Documento emitido por Mi Casa Verde · patologias.micasaverde.es
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
              <Home className="h-3 w-3" /> Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
