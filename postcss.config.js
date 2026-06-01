// ─────────────────────────────────────────────────────────────────────────────
// postcss.config.js — PostCSS es una herramienta que transforma el CSS.
// Vite lo ejecuta automáticamente sobre tus estilos. Aquí solo le decimos que
// use el plugin de Tailwind v4, que es quien lee tu "@import 'tailwindcss'" y
// genera todas las clases utilitarias (flex, p-4, bg-estado-aldia, etc.).
// ─────────────────────────────────────────────────────────────────────────────
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
