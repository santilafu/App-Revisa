// ─────────────────────────────────────────────────────────────────────────────
// vite.config.ts = configuración de Vite (servidor de desarrollo y empaquetado).
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'      // Soporte para React (JSX, recarga en caliente).
import { VitePWA } from 'vite-plugin-pwa'     // Convierte la app en PWA instalable.

// Nota: Tailwind CSS se configura en "postcss.config.js" (método PostCSS).

// Usamos la forma de función para saber si estamos compilando ("build") o en
// desarrollo ("serve"), y así fijar la "base" (la subcarpeta donde vive la web).
// En GitHub Pages la app se sirve en /App-Revisa/; en desarrollo, en la raíz "/".
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/App-Revisa/' : '/',
  plugins: [
    react(),
    VitePWA({
      // "autoUpdate": cuando publiques una versión nueva, se actualiza sola.
      registerType: 'autoUpdate',
      // Archivos sueltos (iconos) que queremos que la PWA incluya.
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icono.svg'],

      // El "manifest": la ficha de identidad de tu app cuando se instala.
      // No fijamos start_url/scope: el plugin los pone solos según la "base".
      manifest: {
        name: 'Revisa',
        short_name: 'Revisa',
        description: 'Recordatorios de mantenimiento de tus vehículos.',
        lang: 'es',
        theme_color: '#0b0f17',
        background_color: '#0b0f17',
        display: 'standalone',
        // Rutas SIN barra inicial → relativas a la "base" (funcionan en subcarpeta).
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      // Activa la PWA también en desarrollo para poder probar la instalación.
      devOptions: { enabled: true },
    }),
  ],
}))
