// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaInicio.tsx
// Pantalla principal: la lista de vehículos del usuario.
// ─────────────────────────────────────────────────────────────────────────────
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Car, Plus } from 'lucide-react'
import { db } from '../db/database'
import { Cabecera } from '../components/Cabecera'
import { TarjetaVehiculo } from '../components/TarjetaVehiculo'
import { Boton } from '../components/Boton'

// ── Animación en cascada (stagger) ──────────────────────────────────────────
// En Framer Motion, las "variants" son estados con nombre. El contenedor coordina
// a sus hijos: "staggerChildren: 0.08" hace que cada tarjeta aparezca 0,08 s
// después de la anterior → efecto de cascada.
const variantesLista = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
// Cada tarjeta empieza invisible y un poco más abajo, y sube hasta su sitio.
const variantesTarjeta = {
  oculto: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function PaginaInicio() {
  // useLiveQuery LEE la base de datos y se mantiene "vivo": si añades o borras un
  // vehículo, esta lista se vuelve a dibujar sola. Mientras carga, vale undefined.
  const vehiculos = useLiveQuery(() => db.vehiculos.toArray())

  return (
    // motion.div con fade de entrada: la pantalla aparece suavemente.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-full flex-col pb-28" // pb-28: hueco para el botón flotante.
    >
      <Cabecera titulo="Mis vehículos" />

      {/* CASO 1: todavía cargando (undefined). No mostramos nada para evitar parpadeos. */}
      {vehiculos === undefined && null}

      {/* CASO 2: cargó pero no hay ningún vehículo → estado vacío con llamada a la acción. */}
      {vehiculos?.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-gray-500">
            <Car size={36} />
          </div>
          <div>
            <p className="font-semibold text-white">Aún no tienes vehículos</p>
            <p className="mt-1 text-sm text-gray-400">
              Añade tu primer coche para empezar a controlar sus mantenimientos.
            </p>
          </div>
          {/* Link es como un enlace: lleva a la pantalla "/anadir". */}
          <Link to="/anadir">
            <Boton>Añadir vehículo</Boton>
          </Link>
        </div>
      )}

      {/* CASO 3: hay vehículos → los mostramos en lista, con la cascada. */}
      {vehiculos && vehiculos.length > 0 && (
        <motion.ul
          variants={variantesLista}
          initial="oculto"
          animate="visible"
          className="flex flex-col gap-3 px-5"
        >
          {vehiculos.map((vehiculo) => (
            // "key" ayuda a React a identificar cada elemento de la lista.
            <motion.li key={vehiculo.id} variants={variantesTarjeta}>
              {/* Al tocar la tarjeta, vamos al detalle de ese vehículo. */}
              <Link to={`/vehiculo/${vehiculo.id}`} className="block active:scale-[0.98]">
                <TarjetaVehiculo vehiculo={vehiculo} />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Botón flotante "+" (abajo a la derecha) para añadir, siempre visible. */}
      <Link
        to="/anadir"
        aria-label="Añadir vehículo"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg shadow-black/40 transition-transform active:scale-95"
      >
        <Plus size={26} />
      </Link>
    </motion.div>
  )
}
