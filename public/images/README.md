# Image Assets for Casa Diagnóstico

This folder contains all images for the landing page. Below is the structure and requirements for each image.

---

## Folder Structure

```
public/images/
├── brand/
│   └── logo.png (512x512, also export 200x200)
├── hero/
│   └── hero-illustration.png (1400x900)
├── pathologies/
│   ├── humedades.jpg (800x600)
│   ├── moho.jpg (800x600)
│   ├── grietas.jpg (800x600)
│   ├── movimientos.jpg (800x600)
│   ├── cubiertas.jpg (800x600)
│   └── fachadas.jpg (800x600)
├── how-it-works/
│   ├── step-1-chat.png (600x450)
│   ├── step-2-upload.png (600x450)
│   ├── step-3-diagnosis.png (600x450)
│   └── step-4-report.png (600x450)
├── profiles/
│   ├── particular.png (400x400)
│   ├── abogado.png (400x400)
│   └── administrador.png (400x400)
└── packs/
    ├── pack-free.png (200x200)
    ├── pack-standard.png (200x200)
    └── pack-priority.png (200x200)
```

---

## Image Requirements

### Brand (`/brand/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `logo.png` | 512x512 | PNG | Main logo with transparency |
| `logo-small.png` | 200x200 | PNG | Small version for header |
| `favicon.ico` | 32x32 | ICO | Browser favicon |

---

### Hero (`/hero/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `hero-illustration.png` | 1400x900 | PNG | Main hero illustration showing house diagnostic concept |

**Style:** Modern flat illustration, teal (#3d8a7e) accent color, white background

---

### Pathologies (`/pathologies/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `humedades.jpg` | 800x600 | JPG/WebP | Moisture/water infiltration damage |
| `moho.jpg` | 800x600 | JPG/WebP | Mold and condensation problems |
| `grietas.jpg` | 800x600 | JPG/WebP | Wall cracks and fissures |
| `movimientos.jpg` | 800x600 | JPG/WebP | Structural movement/settlement |
| `cubiertas.jpg` | 800x600 | JPG/WebP | Roof and terrace damage |
| `fachadas.jpg` | 800x600 | JPG/WebP | Facade thermal bridge issues |

**Style:** Photorealistic, professional inspection documentation style

---

### How It Works (`/how-it-works/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `step-1-chat.png` | 600x450 | PNG | Chat interface mockup |
| `step-2-upload.png` | 600x450 | PNG | File upload interface |
| `step-3-diagnosis.png` | 600x450 | PNG | Pre-diagnosis results screen |
| `step-4-report.png` | 600x450 | PNG | Professional report document |

**Style:** Clean UI mockup illustrations, teal (#3d8a7e) accent

---

### Profiles (`/profiles/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `particular.png` | 400x400 | PNG | Homeowner avatar illustration |
| `abogado.png` | 400x400 | PNG | Lawyer avatar illustration |
| `administrador.png` | 400x400 | PNG | Property manager avatar |

**Style:** Friendly character avatars, flat illustration, circular frame

---

### Packs (`/packs/`)

| File | Size | Format | Description |
|------|------|--------|-------------|
| `pack-free.png` | 200x200 | PNG | Free tier icon |
| `pack-standard.png` | 200x200 | PNG | Standard tier icon (49€) |
| `pack-priority.png` | 200x200 | PNG | Priority tier icon (89€) |

**Style:** Flat icons, teal with gold accents for premium

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#3d8a7e` | Main accent |
| Dark Teal | `#2d6b62` | Shadows |
| Light Teal | `#e8f4f2` | Backgrounds |
| White | `#ffffff` | Backgrounds |
| Dark Gray | `#1a1a1a` | Text |

---

## Usage in Code

```tsx
// Example usage in components
<img src="/images/hero/hero-illustration.png" alt="Diagnóstico de vivienda" />
<img src="/images/pathologies/humedades.jpg" alt="Humedades y filtraciones" />
<img src="/images/profiles/particular.png" alt="Usuario particular" />
```

---

## Optimization Tips

1. Use WebP format for better compression
2. Add `loading="lazy"` for below-fold images
3. Provide `width` and `height` attributes to prevent layout shift
4. Use `srcset` for responsive images if needed
