import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { casaDiagAPI } from '@/services/api/casadiag-api';
import {
  BarChart, FileText, Clock, CheckCircle, AlertTriangle, MoreVertical,
  Download, Upload, Send, History, Eye, Filter, Search, Images, X, Globe, Trash2
} from 'lucide-react';
import { LandingPageEditor } from '@/components/admin/LandingPageEditor';
import { Evidence } from '@/services/api/casadiag-api';

interface DashboardStats {
  totalCases: number;
  pendingReview: number;
  completedToday: number;
  totalRevenue: number;
  paymentPending: number;
  infoConfirmation: number;
}

interface CaseData {
  id: string;
  caseId: string;
  userProfile: string;
  currentState: string;
  createdAt: string;
  fullName?: string;
  email?: string;
  propertyAddress?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  payment?: {
    totalAmount: number;
    status: string;
  };
  admin_reports?: string;
}

interface CaseFilters {
  search: string;
  state: string;
  type: 'all' | 'free' | 'paid';
  skip: number;
  take: number;
}

export default function Admin() {
  console.log('🎯 Admin component rendered!');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filters
  const [filters, setFilters] = useState<CaseFilters>({
    search: '',
    state: 'all',
    type: 'all',
    skip: 0,
    take: 20,
  });

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; caseId?: string; caseLabel?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [generateReportModal, setGenerateReportModal] = useState<{ open: boolean; caseId?: string }>({ open: false });
  const [uploadPdfModal, setUploadPdfModal] = useState<{ open: boolean; caseId?: string }>({ open: false });
  const [sendReportModal, setSendReportModal] = useState<{ open: boolean; caseData?: CaseData; reportId?: string }>({ open: false });
  const [evidenceModal, setEvidenceModal] = useState<{ open: boolean; caseId?: string; caseName?: string }>({ open: false });
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  // Form states
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [emailMessage, setEmailMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadCases();
  }, [filters, activeTab]);

  const loadDashboard = async () => {
    try {
      const statsData = await casaDiagAPI.getAdminStats();
      setStats(statsData);
    } catch (err: any) {
      toast({
        title: "Error al cargar estadísticas",
        description: err.message || "No se pudo cargar la información",
        variant: "destructive",
      });
    }
  };

  const loadCases = async () => {
    setLoading(true);
    try {
      let apiFilters: any = { ...filters };

      // Adjust filters based on active tab
      if (activeTab === 'pending') {
        apiFilters.state = 'DRAFT_SENT_TO_TECHNICIAN';
      } else if (activeTab === 'free') {
        apiFilters.type = 'free';
      } else if (activeTab === 'paid') {
        apiFilters.type = 'paid';
      }

      const response = await casaDiagAPI.getAllCases(apiFilters);
      setCases(response.data || []);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      toast({
        title: "Error al cargar casos",
        description: err.message || "No se pudo cargar los casos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!generateReportModal.caseId) return;

    setGenerating(true);
    try {
      const result = await casaDiagAPI.generateAdminReport(generateReportModal.caseId, reviewNotes);

      // Trigger browser download from blob — works in all browsers including Safari
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Informe generado",
        description: `DOCX v${result.version} descargado correctamente`,
        variant: "default",
      });

      // Close modal and reload
      setGenerateReportModal({ open: false });
      setReviewNotes('');
      loadCases();
    } catch (err: any) {
      toast({
        title: "Error al generar informe",
        description: err.message || "No se pudo generar el informe",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleUploadPdf = async () => {
    if (!uploadPdfModal.caseId || !selectedPdf) return;

    setUploading(true);
    try {
      const result = await casaDiagAPI.uploadAdminPdf(
        uploadPdfModal.caseId,
        selectedPdf,
        (progress) => setUploadProgress(progress)
      );

      toast({
        title: "PDF subido correctamente",
        description: `Versión ${result.version} lista para enviar`,
        variant: "default",
      });

      // Close modal and reload
      setUploadPdfModal({ open: false });
      setSelectedPdf(null);
      setUploadProgress(0);
      loadCases();
    } catch (err: any) {
      toast({
        title: "Error al subir PDF",
        description: err.message || "No se pudo subir el PDF",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSendReport = async () => {
    if (!sendReportModal.caseData || !sendReportModal.reportId) return;

    setSending(true);
    try {
      const result = await casaDiagAPI.sendAdminReport(
        sendReportModal.caseData.id,
        sendReportModal.reportId,
        emailMessage
      );

      toast({
        title: "Informe enviado",
        description: `Enviado correctamente a ${result.sentTo}`,
        variant: "default",
      });

      // Close modal and reload
      setSendReportModal({ open: false });
      setEmailMessage('');
      loadCases();
    } catch (err: any) {
      toast({
        title: "Error al enviar informe",
        description: err.message || "No se pudo enviar el informe",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getStateLabel = (state: string) => {
    const labels: Record<string, string> = {
      'S0_INTRODUCCION': 'S0 - Introducción',
      'S1_LOCALIZACION': 'S1 - Localización',
      'S8_ANALISIS_GRATUITO': 'S8 - Análisis gratuito',
      'S9_CONFIRMACION_PAGO': 'S9 - Confirmación pago',
      'S10_PAGO_COMPLETADO': 'S10 - Pago completado',
      'DRAFT_SENT_TO_TECHNICIAN': 'Enviado a técnico',
      'FINAL_SENT': 'Informe enviado',
    };
    return labels[state] || state;
  };

  const handleOpenEvidence = async (caseId: string, caseName: string) => {
    setEvidenceModal({ open: true, caseId, caseName });
    setLoadingEvidence(true);
    try {
      const data = await casaDiagAPI.getEvidence(caseId);
      setEvidenceList(data);
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar las evidencias", variant: "destructive" });
      setEvidenceList([]);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const getStateColor = (state: string) => {
    if (state.startsWith('S8')) return 'default';
    if (state.includes('PAGO')) return 'secondary';
    if (state === 'DRAFT_SENT_TO_TECHNICIAN') return 'outline';
    if (state === 'FINAL_SENT') return 'success';
    return 'default';
  };

  const getLatestAdminReport = (adminReportsStr?: string) => {
    if (!adminReportsStr) return null;
    try {
      const reports = JSON.parse(adminReportsStr);
      return reports[reports.length - 1];
    } catch {
      return null;
    }
  };

  const handlePaginationNext = () => {
    setFilters(prev => ({ ...prev, skip: prev.skip + prev.take }));
  };

  const handlePaginationPrev = () => {
    setFilters(prev => ({ ...prev, skip: Math.max(0, prev.skip - prev.take) }));
  };

  const handleDeleteCase = async () => {
    if (!deleteModal.caseId) return;
    setDeleting(true);
    try {
      await casaDiagAPI.adminDeleteCase(deleteModal.caseId);
      toast({ title: 'Expediente eliminado', description: `${deleteModal.caseLabel} eliminado permanentemente`, variant: 'default' });
      setDeleteModal({ open: false });
      loadCases();
      loadDashboard();
    } catch (err: any) {
      toast({ title: 'Error al eliminar', description: err.message || 'No se pudo eliminar el expediente', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button onClick={loadDashboard} variant="outline">
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casos</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
            <p className="text-xs text-muted-foreground">Todos los expedientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReview || 0}</div>
            <p className="text-xs text-muted-foreground">Esperando revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedToday || 0}</div>
            <p className="text-xs text-muted-foreground">Informes enviados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue?.toFixed(2) || 0}€</div>
            <p className="text-xs text-muted-foreground">Pagos completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Casos</CardTitle>
          <CardDescription>
            Todos los casos con análisis gratuitos y pagados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todos los casos ({total})</TabsTrigger>
              <TabsTrigger value="pending">Pendientes revisión ({stats?.pendingReview || 0})</TabsTrigger>
              <TabsTrigger value="free">Análisis gratuitos</TabsTrigger>
              <TabsTrigger value="paid">Informes pagados</TabsTrigger>
              <TabsTrigger value="seo-pages">
                <Globe className="h-4 w-4 mr-1.5" />
                Páginas SEO
              </TabsTrigger>
            </TabsList>

            {/* SEO Pages Editor - standalone tab */}
            {activeTab === 'seo-pages' && (
              <TabsContent value="seo-pages" className="mt-4">
                <LandingPageEditor />
              </TabsContent>
            )}

            <TabsContent value={activeTab} className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Expediente, email, nombre..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, skip: 0 }))}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="w-[200px]">
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={filters.state}
                    onValueChange={(state) => setFilters(prev => ({ ...prev, state, skip: 0 }))}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="S8_ANALISIS_GRATUITO">S8 - Análisis gratis</SelectItem>
                      <SelectItem value="DRAFT_SENT_TO_TECHNICIAN">Enviado a técnico</SelectItem>
                      <SelectItem value="FINAL_SENT">Informe final enviado</SelectItem>
                      <SelectItem value="S9_CONFIRMACION_PAGO">S9 - Confirmación pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={loadCases} variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>

              {/* Table */}
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : cases.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No hay casos que mostrar</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expediente</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cases.map((caso) => {
                        const latestReport = getLatestAdminReport(caso.admin_reports);
                        return (
                          <TableRow key={caso.id}>
                            <TableCell className="font-mono text-sm">
                              {caso.caseId || caso.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>
                              {caso.user ? (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">AUTH</Badge>
                                  <span className="text-sm">{caso.user.name}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  {caso.fullName || 'Anónimo'}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {caso.user?.email || caso.email || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStateColor(caso.currentState) as any}>
                                {getStateLabel(caso.currentState)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {caso.payment ? (
                                <Badge variant="default">💰 Pagado</Badge>
                              ) : (
                                <Badge variant="outline">🆓 Gratis</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(caso.createdAt).toLocaleDateString('es-ES')}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => window.open(`/asistente/expediente/${caso.id}`, '_blank')}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenEvidence(caso.id, caso.fullName || caso.caseId)}>
                                    <Images className="h-4 w-4 mr-2" />
                                    Ver evidencias
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setGenerateReportModal({ open: true, caseId: caso.id });
                                  }}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generar informe DOCX
                                  </DropdownMenuItem>
                                  {latestReport?.id && (
                                    <DropdownMenuItem onClick={async () => {
                                      try {
                                        const result = await casaDiagAPI.downloadAdminReport(caso.id, latestReport.id);
                                        const url = URL.createObjectURL(result.blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `informe-v${result.version}.docx`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      } catch (e) {
                                        console.error('Error downloading report', e);
                                      }
                                    }}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Descargar DOCX
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => {
                                    setUploadPdfModal({ open: true, caseId: caso.id });
                                  }}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir PDF editado
                                  </DropdownMenuItem>
                                  {latestReport?.pdfUrl && (
                                    <DropdownMenuItem onClick={() => {
                                      setSendReportModal({
                                        open: true,
                                        caseData: caso,
                                        reportId: latestReport.id,
                                      });
                                    }}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Enviar por email
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteModal({
                                      open: true,
                                      caseId: caso.id,
                                      caseLabel: caso.caseId || caso.id.substring(0, 8),
                                    })}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar expediente
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Mostrando {filters.skip + 1} a {Math.min(filters.skip + filters.take, total)} de {total}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePaginationPrev}
                        disabled={filters.skip === 0}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePaginationNext}
                        disabled={filters.skip + filters.take >= total}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generate Report Modal */}
      <Dialog open={generateReportModal.open} onOpenChange={(open) => setGenerateReportModal({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Informe Editable</DialogTitle>
            <DialogDescription>
              Se generará un documento DOCX que podrás editar en Word
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Notas del revisor (opcional)</Label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Añade observaciones que se incluirán en el informe..."
                rows={4}
              />
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                El documento se generará en formato DOCX. Podrás editarlo,
                añadir firmas y exportarlo a PDF desde Word.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateReportModal({ open: false })}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateReport} disabled={generating}>
              {generating ? 'Generando...' : 'Generar DOCX'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload PDF Modal */}
      <Dialog open={uploadPdfModal.open} onOpenChange={(open) => setUploadPdfModal({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Informe Editado (PDF)</DialogTitle>
            <DialogDescription>
              Sube el PDF final después de editar y firmar el documento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Click para seleccionar PDF</p>
                {selectedPdf && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {selectedPdf.name}
                  </p>
                )}
              </label>
            </div>

            {uploadProgress > 0 && (
              <div>
                <Label>Progreso de subida</Label>
                <Progress value={uploadProgress} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">{uploadProgress}%</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadPdfModal({ open: false })}>
              Cancelar
            </Button>
            <Button
              onClick={handleUploadPdf}
              disabled={!selectedPdf || uploading}
            >
              {uploading ? `Subiendo... ${uploadProgress}%` : 'Subir PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Report Modal */}
      <Dialog open={sendReportModal.open} onOpenChange={(open) => setSendReportModal({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Informe al Cliente</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Email destinatario</Label>
              <Input
                value={sendReportModal.caseData?.user?.email || sendReportModal.caseData?.email || ''}
                disabled
                className="mt-2"
              />
              {!sendReportModal.caseData?.user && (
                <Alert className="mt-2" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    ⚠️ Caso anónimo - se enviará al email proporcionado
                    en la entrevista: {sendReportModal.caseData?.email}
                  </AlertDescription>
                </Alert>
              )}
              {sendReportModal.caseData?.user && (
                <Alert className="mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✓ Se enviará al email autenticado del usuario
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <Label>Mensaje adicional (opcional)</Label>
              <Textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Mensaje personalizado para el cliente..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendReportModal({ open: false })}>
              Cancelar
            </Button>
            <Button onClick={handleSendReport} disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar por Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Eliminar expediente
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el expediente <strong>{deleteModal.caseLabel}</strong>?
              Esta acción es <strong>irreversible</strong> y borrará todos los datos, evidencias y archivos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false })} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCase} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Viewer Modal */}
      <Dialog open={evidenceModal.open} onOpenChange={(open) => { setEvidenceModal({ open }); setEvidenceList([]); }}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="h-5 w-5" />
              Evidencias del expediente
            </DialogTitle>
            <DialogDescription>
              Fotos y vídeos subidos por el cliente — {evidenceModal.caseName}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {loadingEvidence ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
              </div>
            ) : evidenceList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Images className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No hay evidencias para este expediente</p>
              </div>
            ) : (
              <div className="space-y-4 p-1">
                <p className="text-sm text-muted-foreground">{evidenceList.length} archivo(s) encontrado(s)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {evidenceList.map((ev) => (
                    <div key={ev.id} className="border rounded-lg overflow-hidden bg-muted/30 flex flex-col">
                      {/* Preview */}
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {ev.type === 'photo' ? (
                          <img
                            src={ev.storageUrl}
                            alt={ev.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <video
                            src={ev.storageUrl}
                            className="w-full h-full object-cover"
                            controls={false}
                          />
                        )}
                      </div>
                      {/* Info + Download */}
                      <div className="p-2 flex flex-col gap-1">
                        <p className="text-xs font-medium truncate" title={ev.filename}>{ev.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {ev.type === 'photo' ? '📷 Foto' : '🎥 Vídeo'} · {(ev.sizeBytes / 1024).toFixed(0)} KB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(ev.uploadedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-1 w-full text-xs h-7"
                          onClick={() => {
                            const w = window.open('about:blank', '_blank');
                            if (w) w.location.href = ev.storageUrl;
                            else window.location.href = ev.storageUrl;
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEvidenceModal({ open: false }); setEvidenceList([]); }}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
