// ─────────────────────────────────────────────────────────────────────────────
// eslint.config.js — configuración de ESLint, la herramienta que revisa el código
// y avisa de errores y malas prácticas. Ahora revisa archivos .ts y .tsx
// (TypeScript) usando "typescript-eslint". Ejecútalo con: pnpm lint
// ─────────────────────────────────────────────────────────────────────────────
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // Carpetas/archivos que NO queremos revisar.
  globalIgnores(['dist', 'dev-dist']),
  {
    // Aplica estas reglas a todo el código fuente TypeScript.
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,            // Reglas base de JavaScript.
      ...tseslint.configs.recommended,   // Reglas recomendadas de TypeScript.
      reactHooks.configs.flat.recommended, // Buen uso de los hooks de React.
      reactRefresh.configs.vite,         // Compatibilidad con la recarga en caliente.
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser, // Damos por disponibles las APIs del navegador.
    },
  },
])
