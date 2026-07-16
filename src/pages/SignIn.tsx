import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login({ email, password, rememberMe });

      console.log('🔍 Login successful, userData:', userData);
      console.log('🔍 User role:', userData?.role);

      // Redirect based on user role
      const from = (location.state as any)?.from?.pathname;
      console.log('🔍 From path:', from);

      if (from) {
        console.log('✅ Redirecting to from path:', from);
        navigate(from, { replace: true });
      } else if (userData?.role === 'ADMIN') {
        console.log('✅ ADMIN detected, redirecting to /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('✅ Regular user, redirecting to /dashboard');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      // Error is handled by AuthContext toast
      console.error('❌ Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión | Diagnóstico Técnico</title>
        <meta name="description" content="Accede a tu cuenta para gestionar tus diagnósticos técnicos de vivienda." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="/images/pathologies/humedades.webp"
            alt="Diagnóstico de vivienda"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />

          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col justify-center p-12 text-white">
            <Link to="/" className="mb-8">
              <img
                src="/images/brand/logo.webp"
                alt="Mi Casa Verde"
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              Bienvenido de nuevo
            </h1>
            <p className="text-lg text-white/90 max-w-md">
              Accede a tu cuenta para revisar tus diagnósticos, descargar informes y gestionar tus expedientes.
            </p>

            {/* Trust indicators */}
            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Acceso seguro con cifrado SSL</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Tus datos protegidos (RGPD)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Historial de diagnósticos disponible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link to="/">
                <img
                  src="/images/brand/logo.webp"
                  alt="Mi Casa Verde"
                  className="h-12 w-auto mx-auto"
                />
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-muted-foreground">
                Introduce tus credenciales para acceder
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/recuperar-password"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Recordar mi sesión
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              asChild
            >
              <Link to="/registro">
                Crear cuenta nueva
              </Link>
            </Button>

            {/* Back to Home */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                ← Volver a la página principal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
