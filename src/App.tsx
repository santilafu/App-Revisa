// ─────────────────────────────────────────────────────────────────────────────
// App.tsx — el componente raíz y ROUTER de la app.
// Ahora, además de elegir la pantalla según la URL, coordina la ANIMACIÓN de
// transición entre pantallas con <AnimatePresence>.
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PaginaInicio from './pages/PaginaInicio'
import PaginaFormularioVehiculo from './pages/PaginaFormularioVehiculo'
import PaginaDetalleVehiculo from './pages/PaginaDetalleVehiculo'
import PaginaMantenimiento from './pages/PaginaMantenimiento'
import PaginaHistorial from './pages/PaginaHistorial'
import PaginaAjustes from './pages/PaginaAjustes'

/**
 * Componente con las rutas. Está separado de App porque necesita useLocation(),
 * que solo funciona DENTRO de <BrowserRouter>.
 */
function Rutas() {
  // useLocation nos dice en qué URL estamos. La usamos como "key" para que
  // AnimatePresence sepa que ha cambiado la pantalla y dispare la animación.
  const location = useLocation()

  return (
    // mode="wait": espera a que la pantalla actual termine de SALIR antes de que
    // entre la nueva. Así no se solapan.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/ajustes" element={<PaginaAjustes />} />
        <Route path="/anadir" element={<PaginaFormularioVehiculo />} />
        {/* ":id" y ":mid" son comodines: trozos variables de la URL. */}
        <Route path="/vehiculo/:id" element={<PaginaDetalleVehiculo />} />
        <Route path="/vehiculo/:id/editar" element={<PaginaFormularioVehiculo />} />
        <Route path="/vehiculo/:id/mantenimiento/nuevo" element={<PaginaMantenimiento />} />
        <Route path="/vehiculo/:id/mantenimiento/:mid" element={<PaginaMantenimiento />} />
        <Route path="/vehiculo/:id/historial" element={<PaginaHistorial />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    // basename = la subcarpeta donde se sirve la app. import.meta.env.BASE_URL vale
    // "/" en desarrollo y "/App-Revisa/" al compilar para GitHub Pages. Le quitamos
    // la barra final para que React Router lo entienda bien.
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {/* Contenedor tipo móvil: columna centrada con ancho máximo. */}
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
        <Rutas />
      </div>
    </BrowserRouter>
  )
}

export default App
