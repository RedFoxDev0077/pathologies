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

  // No logging here: this component re-renders on every guarded navigation and
  // was printing the signed-in user's email and role to the console each time.

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
