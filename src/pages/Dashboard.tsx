import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api/auth-api';
import { casaDiagAPI, Case } from '@/services/api/casadiag-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Plus, LogOut, User, Download, CheckCircle, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminReport {
  id: string;
  version: number;
  sentAt: string;
  notes?: string;
  caseId: string;       // friendly case ID for display
  caseInternalId: string; // internal UUID for API calls
}

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load profile with statistics
      const profileData = await authAPI.getProfile();
      setProfile(profileData);

      // Load user's cases
      const casesData = await casaDiagAPI.getMyCases(0, 20);
      const loadedCases = casesData.data || [];
      setCases(loadedCases);

      // Extract admin reports from all cases
      loadReportsFromCases(loadedCases);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el panel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReportsFromCases = (loadedCases: Case[]) => {
    const allReports: AdminReport[] = [];

    loadedCases.forEach((caso: any) => {
      if (caso.admin_reports) {
        try {
          const adminReports = JSON.parse(caso.admin_reports);
          adminReports.forEach((report: any) => {
            allReports.push({
              id: report.id,
              version: report.version,
              sentAt: report.sentAt,
              notes: report.notes,
              caseId: caso.caseId || caso.id,
              caseInternalId: caso.id,
            });
          });
        } catch (error) {
          console.error('Failed to parse admin_reports:', error);
        }
      }
    });

    // Only show reports that have been sent (sentAt set by backend)
    const completedReports = allReports
      .filter(report => report.sentAt)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    setReports(completedReports);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNewCase = () => {
    navigate('/asistente');
  };

  const handleViewCase = (caseId: string) => {
    navigate(`/asistente-expediente/${caseId}`);
  };

  const getStateLabel = (state: string): string => {
    const stateLabels: Record<string, string> = {
      'S0_INTRODUCCION': 'Introducción',
      'S1_LOCALIZACION': 'Localización',
      'S2_TIPO_DANO': 'Tipo de daño',
      'S3_ANTIGUEDAD': 'Antigüedad',
      'S4_EVOLUCION': 'Evolución',
      'S5_MATERIAL_GRAFICO': 'Material gráfico',
      'S6_CONTEXTO': 'Contexto',
      'S7_DESCRIPCION_LIBRE': 'Descripción',
      'S7B_PREGUNTAS_TECNICAS': 'Preguntas técnicas',
      'S8_ANALISIS_GRATUITO': 'Análisis completado',
      'S9_CONFIRMACION_PAGO': 'Confirmación de pago',
      'S10_PAGO_COMPLETADO': 'Pago completado',
      'PAYMENT_COMPLETED': 'Pago procesado',
      'INFO_CONFIRMATION': 'Confirmación de información',
      'S9_GENERACION_PREINFORME': 'Generando pre-informe',
      'DRAFT_SENT_TO_TECHNICIAN': 'Enviado a técnico',
      'FINAL_SENT': 'Informe final enviado',
      'EXPIRED': 'Expirado',
    };
    return stateLabels[state] || state;
  };

  const getStateColor = (state: string): string => {
    if (state.startsWith('S') && !state.includes('PAGO')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (state.includes('PAGO') || state.includes('PAYMENT')) {
      return 'bg-green-100 text-green-800';
    }
    if (state.includes('DRAFT') || state.includes('GENERACION')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (state.includes('FINAL')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.name || user.name}</h1>
                <p className="text-sm text-gray-500">{profile?.email || user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === 'ADMIN' && (
                <Button variant="default" onClick={() => navigate('/admin')}>
                  <BarChart className="w-4 h-4 mr-2" />
                  Panel de Administración
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        {profile?.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total de casos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profile.statistics.totalCases}</div>
              </CardContent>
            </Card>

            {profile.statistics.casesByState.map((stat: any) => (
              <Card key={stat.state}>
                <CardHeader>
                  <CardTitle className="text-lg">{getStateLabel(stat.state)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cases List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mis casos</h2>
          <Button onClick={handleNewCase}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo caso
          </Button>
        </div>

        {cases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No tienes casos aún</h3>
              <p className="text-gray-500 mb-6">
                Crea tu primer caso para empezar a analizar patologías en tu vivienda
              </p>
              <Button onClick={handleNewCase}>
                <Plus className="w-4 h-4 mr-2" />
                Crear primer caso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caso) => (
              <Card key={caso.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewCase(caso.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">Caso {caso.id.substring(0, 8)}...</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStateColor(caso.currentState)}`}>
                      {getStateLabel(caso.currentState)}
                    </span>
                  </div>
                  <CardDescription>
                    {caso.propertyAddress || 'Sin dirección especificada'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {caso.fullName && (
                      <div>
                        <span className="font-medium">Nombre:</span> {caso.fullName}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Creado:</span>{' '}
                      {new Date(caso.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    {caso.userProfile && (
                      <div>
                        <span className="font-medium">Perfil:</span>{' '}
                        {caso.userProfile === 'particular' ? 'Particular' :
                         caso.userProfile === 'abogado' ? 'Abogado' : 'Administrador'}
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Ver detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* My Reports Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Mis Informes Técnicos</CardTitle>
            </div>
            <CardDescription>
              Informes técnicos revisados y enviados por nuestro equipo profesional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tienes informes generados aún
              </p>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          Informe Técnico v{report.version}
                        </p>
                        <Badge variant="outline">
                          {report.caseId}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Enviado el {new Date(report.sentAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}</span>
                      </div>
                      {report.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{report.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            const result = await casaDiagAPI.downloadMyReport(report.caseInternalId, report.id);
                            const url = URL.createObjectURL(result.blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = result.filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          } catch (e) {
                            toast({ title: 'Error', description: 'No se pudo descargar el informe', variant: 'destructive' });
                          }
                        }}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
