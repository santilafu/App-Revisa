// ─────────────────────────────────────────────────────────────────────────────
// App.tsx — el componente raíz. Ahora es el "ROUTER": decide qué pantalla mostrar
// según la dirección (URL) en la que estés.
//   "/"        → PaginaInicio (lista de vehículos)
//   "/anadir"  → PaginaAnadirVehiculo (formulario)
// (En la Fase 3 añadiremos "/vehiculo/:id" para el detalle.)
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaInicio from './pages/PaginaInicio'
import PaginaAnadirVehiculo from './pages/PaginaAnadirVehiculo'

function App() {
  return (
    // BrowserRouter activa la navegación por URL en toda la app.
    <BrowserRouter>
      {/* Contenedor tipo móvil: una columna centrada con ancho máximo (max-w-md),
          para que en pantallas grandes se vea como una app de teléfono. */}
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
        {/* Routes elige UNA ruta según la URL actual. */}
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/anadir" element={<PaginaAnadirVehiculo />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
