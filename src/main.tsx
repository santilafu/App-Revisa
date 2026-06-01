// ─────────────────────────────────────────────────────────────────────────────
// main.tsx — el PUNTO DE ENTRADA de la aplicación.
// Este es el primer archivo de TU código que se ejecuta en el navegador.
// Su único trabajo: coger el componente principal <App /> y "montarlo" dentro
// del <div id="root"> que está en index.html.
// ─────────────────────────────────────────────────────────────────────────────
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Cargamos los estilos globales (Tailwind + nuestros colores).
import App from './App.tsx'
import { aplicarTema, obtenerTema } from './utils/tema'

// Aplicamos el tema guardado ANTES de dibujar, para que no haya un "parpadeo"
// de color al cargar la página.
aplicarTema(obtenerTema())

// 1) Buscamos el div con id="root" en el HTML.
// 2) createRoot prepara React para dibujar dentro de ese div.
// El "!" le dice a TypeScript: "confía, ese elemento existe seguro".
createRoot(document.getElementById('root')!).render(
  // StrictMode es una ayuda SOLO en desarrollo: detecta errores y malas prácticas.
  // No afecta a la app publicada.
  <StrictMode>
    <App />
  </StrictMode>,
)
