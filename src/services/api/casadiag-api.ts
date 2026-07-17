/**
 * CasaDiag API Service
 * Connects frontend to the NestJS backend
 * Base URL: https://patologias.micasaverde.es/api
 */

import axios, { AxiosInstance } from 'axios';
import { authAPI } from './auth-api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://patologias.micasaverde.es/api';

class CasaDiagAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = authAPI.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await authAPI.refreshAccessToken();
            if (refreshed) {
              const token = authAPI.getAccessToken();
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, user needs to login again
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // ==================== CASES ====================

  /**
   * Create a new case
   * @param userProfile - "particular" | "abogado" | "administrador"
   */
  async createCase(userProfile: string) {
    const response = await this.client.post('/cases', { userProfile });
    return response.data;
  }

  /**
   * Get case details
   */
  async getCase(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}`);
    return response.data;
  }

  /**
   * Update case data (name, DNI, address, etc.)
   */
  async updateCase(caseId: string, data: {
    fullName?: string;
    dni?: string;
    propertyAddress?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    rgpdConsent?: boolean;
  }) {
    const response = await this.client.patch(`/cases/${caseId}`, data);
    return response.data;
  }

  // ==================== MESSAGES ====================

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(caseId: string, content: string) {
    const response = await this.client.post(`/cases/${caseId}/messages`, { content }, {
      timeout: 120000, // 2 minutes for AI processing (especially S8 analysis generation)
    });
    return response.data;
  }

  /**
   * Get all messages for a case
   */
  async getMessages(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}/messages`);
    return response.data;
  }

  // ==================== EVIDENCE ====================

  /**
   * Upload photo or video evidence
   * @param onProgress - Optional callback for upload progress (0-100)
   */
  async uploadEvidence(
    caseId: string,
    file: File,
    type: 'photo' | 'video',
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.client.post(`/cases/${caseId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for large files
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  }

  /**
   * Get all evidence for a case
   */
  async getEvidence(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}/evidence`);
    return response.data;
  }

  /**
   * Validate that evidence file is accessible in R2 storage
   * Phase 2: S5 Upload Verification
   */
  async validateEvidence(caseId: string, evidenceId: string) {
    const response = await this.client.get(`/cases/${caseId}/evidence/${evidenceId}/validate`);
    return response.data;
  }

  /**
   * Check if case has minimum required evidence to proceed
   * Phase 2: S5 Upload Verification
   */
  async checkEvidenceReady(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}/evidence/ready`);
    return response.data;
  }

  // ==================== DIAGNOSIS ====================

  /**
   * Generate or re-evaluate diagnosis
   */
  async generateDiagnosis(caseId: string) {
    const response = await this.client.post(`/cases/${caseId}/re-evaluate`);
    return response.data;
  }

  // ==================== PAYMENTS ====================

  /**
   * Create a Stripe payment intent
   * NEW: Only accepts "informe_preliminar_remoto" (108.90€)
   * @param packId - "informe_preliminar_remoto"
   */
  async createPaymentIntent(caseId: string, packId: string = 'informe_preliminar_remoto') {
    const response = await this.client.post(`/cases/${caseId}/payments/create-intent`, { packId });
    return response.data;
  }

  /**
   * Confirm payment (direct charge, not authorize+capture)
   * NEW: Replaces authorizePayment - verifies with Stripe and advances to PAYMENT_COMPLETED
   */
  async confirmPayment(caseId: string, paymentIntentId: string) {
    const response = await this.client.post(`/cases/${caseId}/payments/confirm`, { paymentIntentId });
    return response.data;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}/payments/status`);
    return response.data;
  }

  /**
   * Confirm information after payment
   * NEW: Client confirms all information is correct before pre-report generation
   */
  async confirmInformation(
    caseId: string,
    confirmed: boolean,
    additional_photos?: string[],
    additional_notes?: string
  ) {
    const response = await this.client.post(`/cases/${caseId}/confirm-information`, {
      confirmed,
      additional_photos,
      additional_notes,
    });
    return response.data;
  }

  /**
   * Generate and send pre-report to technician
   * NEW: Generates DOCX pre-report and sends to jfcastillo@micasaverde.es
   */
  async generatePreReport(caseId: string) {
    const response = await this.client.post(`/cases/${caseId}/generate-prereport`);
    return response.data;
  }

  /**
   * Get current case state
   * NEW: Returns currentState and S8 analysis if available
   */
  async getCaseState(caseId: string) {
    const response = await this.client.get(`/cases/${caseId}/state`);
    return response.data;
  }

  // ==================== GENERIC HTTP METHODS ====================

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string): Promise<T> {
    const response = await this.client.get(url);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  /**
   * Permanently delete a case (admin only)
   */
  async adminDeleteCase(caseId: string): Promise<{ deleted: boolean; caseId: string }> {
    const response = await this.client.delete(`/admin/cases/${caseId}`);
    return response.data;
  }

  // ==================== USER CASE MANAGEMENT ====================

  /**
   * Get authenticated user's cases
   * Requires authentication
   */
  async getMyCases(skip = 0, take = 20) {
    const response = await this.client.get(`/cases/user/my-cases?skip=${skip}&take=${take}`);
    return response.data;
  }

  /**
   * Link an anonymous case to the authenticated user
   * Requires authentication
   * @param caseId - The case ID to link
   */
  async linkCaseToUser(caseId: string) {
    const response = await this.client.post(`/cases/${caseId}/link-to-user`);
    return response.data;
  }

  // ==================== ADMIN (Optional) ====================

  /**
   * Get dashboard statistics
   */
  async getAdminStats() {
    const response = await this.client.get('/admin/dashboard/stats');
    return response.data;
  }

  /**
   * Mark a case as saved for later, enabling the 24h follow-up email.
   * Best-effort: the UI still copies the link even if this fails.
   */
  async saveCaseForLater(caseId: string): Promise<{ success: boolean }> {
    const response = await this.client.post(`/cases/${caseId}/save-for-later`);
    return response.data;
  }

  // ---- Guest access (temporary read-only invitations) ----

  /** List invitations + how many are currently active. */
  async getGuestInvites(): Promise<{ invites: GuestInvite[]; activeCount: number }> {
    const response = await this.client.get('/admin/guests');
    return response.data;
  }

  /**
   * Create an invitation. The raw token comes back exactly once — it is not
   * recoverable afterwards, so the caller must show it to the owner immediately.
   */
  async createGuestInvite(
    label: string,
    expiry: GuestExpiry,
  ): Promise<{ invite: GuestInvite; token: string }> {
    const response = await this.client.post('/admin/guests', { label, expiry });
    return response.data;
  }

  /** Revoke an invitation; the guest's session dies on their next request. */
  async revokeGuestInvite(id: string): Promise<{ success: boolean; invite: GuestInvite }> {
    const response = await this.client.delete(`/admin/guests/${id}`);
    return response.data;
  }

  /** Exchange an invitation token for a read-only session (public endpoint). */
  async redeemGuestInvite(token: string) {
    const response = await this.client.post('/auth/guest/redeem', { token });
    return response.data;
  }

  /**
   * Get pending cases for review
   */
  async getPendingCases() {
    const response = await this.client.get('/admin/cases/pending');
    return response.data;
  }

  /**
   * Send final report
   */
  async sendReport(caseId: string, adminNotes?: string) {
    const response = await this.client.post(`/admin/cases/${caseId}/send-report`, { adminNotes });
    return response.data;
  }

  // ==================== NEW ADMIN REPORT GENERATION ====================

  /**
   * Get all cases with filters and pagination
   */
  async getAllCases(filters?: {
    skip?: number;
    take?: number;
    state?: string;
    type?: 'free' | 'paid' | 'all';
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const response = await this.client.get(`/admin/cases?${params}`);
    return response.data;
  }

  /**
   * Generate admin DOCX report for editing — streams binary directly
   */
  async generateAdminReport(caseId: string, notes?: string): Promise<{ version: number; filename: string; blob: Blob }> {
    const response = await this.client.post(
      `/admin/cases/${caseId}/generate-admin-report`,
      { notes },
      { responseType: 'blob' }
    );

    // Extract filename from Content-Disposition header
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `informe-${caseId}.docx`;

    // Extract version from filename (informe-v2.docx → 2)
    const versionMatch = filename.match(/v(\d+)/);
    const version = versionMatch ? parseInt(versionMatch[1]) : 1;

    return { version, filename, blob: response.data as Blob };
  }

  /**
   * Download a previously generated admin report by ID — streams binary directly
   */
  async downloadAdminReport(caseId: string, reportId: string): Promise<{ version: number; blob: Blob }> {
    const response = await this.client.get(
      `/admin/cases/${caseId}/reports/${reportId}/download`,
      { responseType: 'blob' }
    );
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `informe-${caseId}.docx`;
    const versionMatch = filename.match(/v(\d+)/);
    const version = versionMatch ? parseInt(versionMatch[1]) : 1;
    return { version, blob: response.data as Blob };
  }

  /**
   * Download a sent PDF report for the current authenticated user — streams binary directly
   */
  async downloadMyReport(caseId: string, reportId: string): Promise<{ blob: Blob; filename: string }> {
    const response = await this.client.get(
      `/cases/${caseId}/reports/${reportId}/download-pdf`,
      { responseType: 'blob' }
    );
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `informe-${caseId}.pdf`;
    return { blob: response.data as Blob, filename };
  }

  /**
   * Upload edited PDF report
   */
  async uploadAdminPdf(caseId: string, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(
      `/admin/cases/${caseId}/upload-admin-pdf`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  }

  /**
   * Send admin-generated report to user
   */
  async sendAdminReport(caseId: string, reportId: string, message?: string) {
    const response = await this.client.post(
      `/admin/cases/${caseId}/send-admin-report`,
      { reportId, message }
    );
    return response.data;
  }

  /**
   * Get all reports for a case (admin + auto-generated)
   */
  async getCaseReportsHistory(caseId: string) {
    const response = await this.client.get(`/admin/cases/${caseId}/reports`);
    return response.data;
  }

  // ==================== SITE CONTENT (Landing Page CMS) ====================

  async getLandingContent(key: string) {
    const response = await this.client.get(`/admin/site-content/${key}`);
    return response.data;
  }

  async saveLandingContent(key: string, content: any) {
    const response = await this.client.put(`/admin/site-content/${key}`, {
      value: JSON.stringify(content),
    });
    return response.data;
  }

  async uploadLandingImage(file: File, onProgress?: (pct: number) => void) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/admin/upload/landing-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return response.data as { url: string };
  }
}

// Export singleton instance
export const casaDiagAPI = new CasaDiagAPI();

// Export types for TypeScript
export interface Case {
  id: string;
  userProfile: string;
  currentState: string;
  threadId?: string;
  fullName?: string;
  dni?: string;
  propertyAddress?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  diagnosisJson?: any;
  overallConfidence?: number;
  nextFunnelStep?: string;
  rgpdConsent: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  caseId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments: string[];
  openaiMessageId?: string;
  createdAt: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  type: 'photo' | 'video';
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  storageUrl: string;
  visionAnalysis?: any;
  uploadedAt: string;
}

export interface Payment {
  id: string;
  caseId: string;
  selectedOption: string;
  baseAmount: number;
  vatRate: number;
  totalAmount: number;
  stripePaymentIntent?: string;
  stripePaymentLink?: string;
  status: string;
  authorizedAt?: string;
  capturedAt?: string;
  createdAt: string;
}

export type GuestExpiry = '7d' | '30d' | 'unlimited';

export interface GuestInvite {
  id: string;
  label: string;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastUsedAt: string | null;
}

export interface Diagnosis {
  expedienteId: string;
  fechaGeneracion: string;
  hipotesisPrincipales: Array<{
    tipo: string;
    confianza: number;
    descripcion: string;
    causasProbables: string[];
    zonasAfectadas: string[];
  }>;
  recomendaciones: Array<{
    prioridad: 'alta' | 'media' | 'baja';
    accion: string;
    justificacion: string;
  }>;
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  confianzaGeneral: number;
  siguientesPasos: string[];
}
