import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRole, redirectTo = '/iniciar-sesion' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute checking:', {
    path: location.pathname,
    loading,
    user: user ? { email: user.email, role: user.role } : null,
    requiredRole
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Loading user...');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: No user, redirecting to', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    console.warn(`⛔ ProtectedRoute: Access denied. Required: ${requiredRole}, User has: ${user.role}`);
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted, rendering children');
  return <>{children}</>;
}
