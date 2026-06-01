// ─────────────────────────────────────────────────────────────────────────────
// src/test/setup.ts — preparación común para TODOS los tests.
// Se ejecuta una vez antes de cada archivo de test (lo indica vitest.config.ts).
// ─────────────────────────────────────────────────────────────────────────────

// Añade matchers cómodos como expect(...).toBeInTheDocument() a Vitest.
import '@testing-library/jest-dom/vitest'

// Polyfill de IndexedDB en memoria: jsdom no trae base de datos, así que esto
// la "finge" para poder probar Dexie sin un navegador real.
import 'fake-indexeddb/auto'

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Tras cada test, desmonta lo que se haya renderizado para no mezclar pruebas.
afterEach(() => {
  cleanup()
})
