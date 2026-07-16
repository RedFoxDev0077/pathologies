# CasaDiag - Diagnóstico de Patologías de Vivienda

Plataforma web de diagnóstico experto para patologías de viviendas en España. Los usuarios interactúan con un asistente IA para diagnosticar problemas de construcción, subir evidencias y recibir informes de expertos.

## Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn-ui (Radix) + Tailwind CSS
- **IA**: OpenAI API
- **Estado**: TanStack React Query + React Hook Form + Zod
- **Routing**: React Router v6

## Requisitos Previos

- Node.js 18+ y npm
- Clave API de OpenAI

## Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd casadiag

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves API
```

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_OPENAI_API_KEY` | Clave API de OpenAI para respuestas IA | Sí |
| `VITE_CLIENT_EMAIL` | Email para notificaciones | Sí |
| `VITE_WEBHOOK_URL` | URL webhook para notificaciones (Zapier/Make) | No |

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 8080)
npm run build    # Build de producción
npm run lint     # Verificación ESLint
npm run preview  # Preview del build de producción
```

## Estructura del Proyecto

```
src/
├── pages/           # Componentes de página (rutas)
├── components/
│   ├── ui/          # Componentes shadcn-ui
│   ├── landing/     # Secciones de landing page
│   ├── asistente/   # UI del asistente de diagnóstico
│   └── chat/        # Widget de chat
├── services/chat/   # Integraciones API (OpenAI, EmailJS)
├── hooks/           # Hooks personalizados de React
├── types/           # Definiciones TypeScript
└── lib/             # Utilidades
```

## Flujo de Diagnóstico

1. **Perfil** - Selección de tipo de usuario (particular/abogado/administrador)
2. **Contexto** - Recopilación del contexto del problema via chat
3. **Evidencias** - Subida de fotos, videos y documentos
4. **Prediagnóstico** - Diagnóstico preliminar generado por IA
5. **Packs** - Selección de paquete de servicio
6. **Revisión** - Revisión por experto humano
7. **Entrega** - Informe enviado al cliente

## Paquetes de Servicio

| Pack | Precio | Incluye |
|------|--------|---------|
| Gratuito | €0 | Evaluación por chat + recopilación de evidencias + prediagnóstico en pantalla |
| Estándar | €49 | Borrador auto-generado + revisión humana + informe PDF |
| Premium | €89 | Revisión prioritaria (24-48h) + aclaraciones + recomendaciones extendidas |

## Licencia

Proyecto privado - Todos los derechos reservados.
