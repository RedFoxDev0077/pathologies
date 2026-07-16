import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      // Navigate to dashboard after successful registration
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Cuenta | Diagnóstico Técnico</title>
        <meta name="description" content="Regístrate para acceder a diagnósticos técnicos profesionales de tu vivienda." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Sign Up Form */}
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
                Crear Cuenta
              </h2>
              <p className="text-muted-foreground">
                Regístrate para comenzar tu diagnóstico
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      className="pl-10 h-11"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="García"
                    className="h-11"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-11"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    className="pl-10 h-11"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10 pr-10 h-11"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleInputChange}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    className="pl-10 pr-10 h-11"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                  Acepto los{" "}
                  <Link to="/aviso-legal" className="text-primary hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link to="/privacidad" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                className="w-full h-12 text-base mt-2"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Crear Cuenta
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Button
              variant="outline"
              className="w-full h-11 text-base"
              asChild
            >
              <Link to="/iniciar-sesion">
                Iniciar Sesión
              </Link>
            </Button>

            {/* Back to Home */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                ← Volver a la página principal
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <img
            src="/images/pathologies/grietas.webp"
            alt="Diagnóstico de vivienda"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-primary/60" />

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
              Únete a nosotros
            </h1>
            <p className="text-lg text-white/90 max-w-md mb-8">
              Crea tu cuenta y obtén diagnósticos técnicos profesionales para tu vivienda con revisión humana garantizada.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Análisis preliminar gratuito</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Informes revisados por técnicos colegiados</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Historial completo de diagnósticos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Soporte técnico personalizado</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="italic text-white/90 mb-4">
                "Gracias al diagnóstico pude identificar el problema de humedad en mi vivienda y tomar las medidas correctas. Muy profesional."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30" />
                <div>
                  <p className="font-medium">María González</p>
                  <p className="text-sm text-white/70">Propietaria en Valencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
