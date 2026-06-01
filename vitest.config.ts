// ─────────────────────────────────────────────────────────────────────────────
// vitest.config.ts — configuración de Vitest (los tests).
// Usamos "jsdom" para simular el navegador (necesario para probar componentes de
// React) y un archivo de preparación común. Ejecuta los tests con: pnpm test
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // Para que Vitest entienda el JSX de los componentes.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
