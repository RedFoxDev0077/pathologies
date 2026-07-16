import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User, LoginCredentials, RegisterData } from '@/services/api/auth-api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (!authAPI.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);

      toast({
        title: "Sesión iniciada",
        description: `Bienvenido, ${response.user.name}`,
        variant: "default",
      });

      return response.user;
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.user);

      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "No se pudo crear la cuenta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
        variant: "default",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    if (!authAPI.isAuthenticated()) return;

    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
