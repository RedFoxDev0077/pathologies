import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Lock, Mail, User, Eye, EyeOff, Phone, MapPin, CreditCard, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { casaDiagAPI } from '@/services/api/casadiag-api';

interface AuthCheckpointProps {
  caseId: string;
  userEmail?: string;
  onAuthComplete: () => void;
  onCancel?: () => void;
}

/**
 * Authentication checkpoint shown after S8 analysis
 * Requires user to login or register before proceeding to payment
 */
export function AuthCheckpoint({ caseId, userEmail, onAuthComplete, onCancel }: AuthCheckpointProps) {
  const { login, register, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState(userEmail || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState(userEmail || '');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerDni, setRegisterDni] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerGdpr, setRegisterGdpr] = useState(false);

  // Data-only form for already-authenticated users
  const [dataName, setDataName] = useState(user?.name || '');
  const [dataEmail, setDataEmail] = useState(user?.email || userEmail || '');
  const [dataDni, setDataDni] = useState('');
  const [dataAddress, setDataAddress] = useState('');
  const [dataPhone, setDataPhone] = useState('');
  const [dataGdpr, setDataGdpr] = useState(false);

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataGdpr) {
      toast({ title: 'Error', description: 'Debes aceptar la política de protección de datos para continuar', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await casaDiagAPI.updateCase(caseId, {
        fullName: dataName,
        dni: dataDni,
        propertyAddress: dataAddress,
        phone: dataPhone,
        email: dataEmail,
        rgpdConsent: true,
      });
      try { await casaDiagAPI.linkCaseToUser(caseId); } catch {}
      onAuthComplete();
    } catch (error) {
      console.error('Failed to save case data:', error);
      toast({ title: 'Error', description: 'No se pudieron guardar los datos. Inténtalo de nuevo.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });

      // Link the anonymous case to the user
      try {
        await casaDiagAPI.linkCaseToUser(caseId);
        toast({
          title: 'Caso vinculado',
          description: 'Tu caso ha sido vinculado a tu cuenta',
        });
      } catch (linkError: any) {
        console.error('Failed to link case:', linkError);
        if (linkError.message?.includes('Email mismatch')) {
          toast({
            title: 'Aviso',
            description: 'Este caso fue creado con un email diferente',
            variant: 'default',
          });
        }
      }

      onAuthComplete();
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (!registerGdpr) {
      toast({
        title: 'Error',
        description: 'Debes aceptar la política de protección de datos para continuar',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
      });

      // Save personal data to the case (required for the informe)
      try {
        await casaDiagAPI.updateCase(caseId, {
          fullName: registerName,
          dni: registerDni,
          propertyAddress: registerAddress,
          phone: registerPhone,
          email: registerEmail,
          rgpdConsent: true,
        });
      } catch (updateError) {
        console.error('Failed to update case data:', updateError);
      }

      // Link the anonymous case to the newly registered user
      try {
        await casaDiagAPI.linkCaseToUser(caseId);
        toast({
          title: 'Caso vinculado',
          description: 'Tu caso ha sido vinculado a tu nueva cuenta',
        });
      } catch (linkError: any) {
        console.error('Failed to link case:', linkError);
        if (linkError.message?.includes('Email mismatch')) {
          toast({
            title: 'Aviso',
            description: 'Este caso fue creado con un email diferente',
            variant: 'default',
          });
        }
      }

      onAuthComplete();
    } catch (error: any) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Already authenticated — show only data collection form
  if (isAuthenticated) {
    return (
      <div className="w-full mx-auto">
        <Card>
          <CardHeader className="text-center relative">
            {onCancel && (
              <button type="button" onClick={onCancel}
                className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            )}
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Datos del expediente</CardTitle>
            <CardDescription>
              Completa los datos del inmueble para preparar tu informe técnico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDataSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-name">Nombre completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input id="data-name" type="text" placeholder="Juan Pérez García" value={dataName}
                    onChange={(e) => setDataName(e.target.value)} required disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-dni">DNI / NIE *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input id="data-dni" type="text" placeholder="12345678A" value={dataDni}
                    onChange={(e) => setDataDni(e.target.value)} required disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-address">Dirección del inmueble *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input id="data-address" type="text" placeholder="Calle Mayor 10, 2ºA, Madrid" value={dataAddress}
                    onChange={(e) => setDataAddress(e.target.value)} required disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-phone">Teléfono de contacto *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input id="data-phone" type="tel" placeholder="+34 612 345 678" value={dataPhone}
                    onChange={(e) => setDataPhone(e.target.value)} required disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input id="data-email" type="email" placeholder="tu@email.com" value={dataEmail}
                    onChange={(e) => setDataEmail(e.target.value)} required disabled={loading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="data-gdpr" checked={dataGdpr}
                    onChange={(e) => setDataGdpr(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-gray-300 flex-shrink-0" disabled={loading} required />
                  <Label htmlFor="data-gdpr" className="text-xs font-normal cursor-pointer leading-relaxed">
                    Acepto el tratamiento de mis datos personales conforme a la{' '}
                    <strong>LOPDGDD</strong> y el <strong>RGPD</strong>, necesarios para la elaboración del informe técnico. *
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground pl-7">
                  Tus datos serán utilizados exclusivamente para la redacción del informe y no serán cedidos a terceros.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading || !dataGdpr}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Continuar al pago'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <Card>
        <CardHeader className="text-center relative">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Inicia sesión para continuar</CardTitle>
          <CardDescription>
            Para solicitar el informe completo necesitas crear una cuenta o iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            </TabsList>

            {/* Register Tab — shown first, required fields for the informe */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Juan Pérez García"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* DNI */}
                <div className="space-y-2">
                  <Label htmlFor="register-dni">DNI / NIE *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-dni"
                      type="text"
                      placeholder="12345678A"
                      value={registerDni}
                      onChange={(e) => setRegisterDni(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="register-address">Dirección del inmueble *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-address"
                      type="text"
                      placeholder="Calle Mayor 10, 2ºA, Madrid"
                      value={registerAddress}
                      onChange={(e) => setRegisterAddress(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Teléfono de contacto *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+34 612 345 678"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirmar contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repite la contraseña"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* GDPR Consent — required by Spanish law */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="register-gdpr"
                      checked={registerGdpr}
                      onChange={(e) => setRegisterGdpr(e.target.checked)}
                      className="h-4 w-4 mt-0.5 rounded border-gray-300 flex-shrink-0"
                      disabled={loading}
                      required
                    />
                    <Label htmlFor="register-gdpr" className="text-xs font-normal cursor-pointer leading-relaxed">
                      Acepto el tratamiento de mis datos personales (nombre, DNI, dirección, teléfono y email) conforme a la{' '}
                      <strong>Ley Orgánica de Protección de Datos (LOPDGDD)</strong> y el{' '}
                      <strong>Reglamento General de Protección de Datos (RGPD)</strong>, necesarios para la elaboración del informe técnico. *
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">
                    Tus datos serán utilizados exclusivamente para la redacción del informe y no serán cedidos a terceros.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !registerGdpr}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta y continuar'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={loading}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                    Recordarme
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
