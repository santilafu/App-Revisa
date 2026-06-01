// ─────────────────────────────────────────────────────────────────────────────
// pwa-assets.config.ts
// Configuración del generador de iconos de la PWA. A partir de "public/icono.svg"
// crea los PNG estándar (192, 512, maskable y apple-touch) con el preset oficial.
// Se ejecuta con: pnpm generate-pwa-assets
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: minimal2023Preset,
  images: ['public/icono.svg'],
})
