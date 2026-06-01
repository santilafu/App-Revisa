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
      // Archivos sueltos que queremos que la PWA cachee.
      includeAssets: ['favicon.svg'],

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
        // De momento usamos el favicon.svg que ya existe como icono provisional.
        // En una fase posterior pondremos iconos PNG propios (192px y 512px).
        icons: [
          { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },

      // Activa la PWA también en desarrollo, para poder probar la instalación
      // sin tener que hacer "build" cada vez.
      devOptions: { enabled: true },
    }),
  ],
})
