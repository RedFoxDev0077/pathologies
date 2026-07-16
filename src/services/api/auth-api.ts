import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://patologias.micasaverde.es/api';

// Safe storage helpers — iOS Safari private mode throws SecurityError on localStorage access
function storageGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { /* private mode */ }
  try { return sessionStorage.getItem(key); } catch { /* unavailable */ }
  return null;
}
function storageSet(key: string, value: string, preferLocal = true): void {
  if (preferLocal) {
    try { localStorage.setItem(key, value); return; } catch { /* quota/private */ }
  }
  try { sessionStorage.setItem(key, value); } catch { /* unavailable */ }
}
function storageRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserProfile extends User {
  phone?: string;
  dni?: string;
  verified: boolean;
  createdAt: string;
  statistics?: {
    totalCases: number;
    casesByState: Array<{
      state: string;
      count: number;
    }>;
  };
}

class AuthAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from storage on initialization (safe for iOS private mode)
    this.accessToken = storageGet('accessToken');
    this.refreshToken = storageGet('refreshToken');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      // Store tokens
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;

      if (credentials.rememberMe) {
        storageSet('accessToken', this.accessToken, true);
        storageSet('refreshToken', this.refreshToken, true);
      } else {
        storageSet('accessToken', this.accessToken, false);
        storageSet('refreshToken', this.refreshToken, false);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email o contraseña incorrectos');
      }
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);

      // Store tokens
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;

      storageSet('accessToken', this.accessToken, true);
      storageSet('refreshToken', this.refreshToken, true);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Este email ya está registrado');
      }
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API response
      this.accessToken = null;
      this.refreshToken = null;
      storageRemove('accessToken');
      storageRemove('refreshToken');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          const response = await axios.get<User>(`${API_URL}/auth/me`, {
            headers: this.getAuthHeaders(),
          });
          return response.data;
        }
      }
      throw new Error('No autorizado');
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;

      // Update storage
      const wasInLocal = !!storageGet('accessToken');
      storageSet('accessToken', this.accessToken, wasInLocal);
      storageSet('refreshToken', this.refreshToken, wasInLocal);

      return true;
    } catch (error) {
      // Refresh failed, clear tokens
      await this.logout();
      return false;
    }
  }

  /**
   * Get user profile with statistics
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get<UserProfile>(`${API_URL}/auth/profile`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          const response = await axios.get<UserProfile>(`${API_URL}/auth/profile`, {
            headers: this.getAuthHeaders(),
          });
          return response.data;
        }
      }
      throw new Error('No autorizado');
    }
  }

  /**
   * Get auth headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      this.accessToken = storageGet('accessToken');
    }

    if (this.accessToken) {
      return {
        'Authorization': `Bearer ${this.accessToken}`,
      };
    }

    return {};
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken || storageGet('accessToken'));
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken || storageGet('accessToken');
  }
}

export const authAPI = new AuthAPI();
