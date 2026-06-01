// ─────────────────────────────────────────────────────────────────────────────
// vite.config.ts = la configuración de Vite (el servidor de desarrollo y el
// empaquetador que convierte tu código en algo que el navegador entiende).
// Aquí conectamos los "plugins" que dan superpoderes a Vite.
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'      // Soporte para React (JSX, recarga en caliente).
import { VitePWA } from 'vite-plugin-pwa'     // Convierte la app en PWA instalable.

// Nota: Tailwind CSS NO se configura aquí, sino en "postcss.config.js" (método
// PostCSS), que es el más estable. Vite lo aplica automáticamente al CSS.

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "autoUpdate": cuando publiques una versión nueva, se actualiza sola.
      registerType: 'autoUpdate',
      // Archivos sueltos (iconos) que queremos que la PWA incluya.
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icono.svg'],

      // El "manifest": la ficha de identidad de tu app cuando se instala en el móvil.
      manifest: {
        name: 'Revisa',
        short_name: 'Revisa', // Nombre corto bajo el icono en la pantalla de inicio.
        description: 'Recordatorios de mantenimiento de tus vehículos.',
        lang: 'es',
        theme_color: '#0b0f17',       // Color de la barra superior (modo oscuro).
        background_color: '#0b0f17',  // Color de la pantalla de carga.
        display: 'standalone',        // Se abre como app, sin barra del navegador.
        start_url: '/',
        // Iconos PNG generados a partir de public/icono.svg (pnpm generate-pwa-assets).
        // El "maskable" es la versión que Android recorta en distintas formas.
        icons: [
          { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      // Activa la PWA también en desarrollo, para poder probar la instalación
      // sin tener que hacer "build" cada vez.
      devOptions: { enabled: true },
    }),
  ],
})
