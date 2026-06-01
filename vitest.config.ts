// ─────────────────────────────────────────────────────────────────────────────
// vitest.config.ts — configuración de Vitest, el sistema de pruebas (tests).
// Lo separamos del vite.config para no cargar el plugin de PWA durante los tests.
// Probamos lógica pura (funciones), así que el entorno "node" es suficiente.
// Ejecuta los tests con: pnpm test
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'], // Solo archivos que terminan en .test.ts
  },
})
