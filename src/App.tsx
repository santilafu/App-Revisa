// ─────────────────────────────────────────────────────────────────────────────
// App.tsx — el componente principal (la "raíz" de la interfaz).
//
// OJO: en la Fase 1 esto es solo una PANTALLA DE BIENVENIDA provisional, para
// comprobar que todo el montaje funciona (React + TypeScript + Tailwind + datos).
// NO es la app real: las pantallas de verdad (lista de vehículos, detalle, etc.)
// las construiremos en la Fase 2, dentro de las carpetas pages/ y components/.
// ─────────────────────────────────────────────────────────────────────────────
import { MARCAS } from './data/marcas'

function App() {
  return (
    // Contenedor a pantalla completa, centrado, con el fondo oscuro del tema.
    // Las clases (flex, items-center, p-6...) son de Tailwind.
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-white">Revisa</h1>

      <p className="max-w-sm text-gray-400">
        Estructura del proyecto lista ✅. Esto es solo una pantalla de prueba de la
        Fase 1. Las pantallas reales llegan en la Fase 2.
      </p>

      {/* Pequeña prueba de que los datos de marcas se importan correctamente. */}
      <span className="rounded-full bg-estado-aldia/15 px-4 py-1.5 text-sm font-medium text-estado-aldia">
        {MARCAS.length} marcas cargadas
      </span>
    </div>
  )
}

export default App
