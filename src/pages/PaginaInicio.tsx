// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaInicio.tsx
// Pantalla principal: lista de vehículos + resumen de avisos (próximos/vencidos)
// y un punto de color por coche según su mantenimiento más urgente.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Car, Plus, Settings, Search } from 'lucide-react'
import { db } from '../db/database'
import type { EstadoMantenimiento } from '../types'
import { resumenEstados, pesoUrgencia } from '../utils/mantenimiento'
import { permisoActual, mostrarAviso } from '../utils/notificaciones'
import { Cabecera } from '../components/Cabecera'
import { TarjetaVehiculo } from '../components/TarjetaVehiculo'
import { Boton } from '../components/Boton'
import { Pagina } from '../components/Pagina'

// Animación en cascada: el contenedor hace aparecer las tarjetas una tras otra.
const variantesLista = { oculto: {}, visible: { transition: { staggerChildren: 0.08 } } }
const variantesTarjeta = { oculto: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

export default function PaginaInicio() {
  // Leemos vehículos Y mantenimientos a la vez para poder calcular los avisos.
  const datos = useLiveQuery(async () => {
    const vehiculos = await db.vehiculos.toArray()
    const mantenimientos = await db.mantenimientos.toArray()
    return { vehiculos, mantenimientos }
  })

  // Para cada vehículo, calculamos el estado más urgente de sus mantenimientos.
  // Guardamos el resultado en un Map (id del vehículo → estado) para usarlo abajo.
  const estadoPorVehiculo = new Map<number, EstadoMantenimiento | null>()
  let totalVencidos = 0
  let totalProximos = 0
  if (datos) {
    for (const v of datos.vehiculos) {
      const suyos = datos.mantenimientos.filter((m) => m.vehiculoId === v.id)
      const resumen = resumenEstados(suyos, v.kmActuales)
      estadoPorVehiculo.set(v.id!, resumen.masUrgente)
      totalVencidos += resumen.vencidos
      totalProximos += resumen.proximos
    }
  }

  // Notificación al abrir: si hay vencidos y el permiso está dado, avisamos UNA
  // vez por sesión (usamos sessionStorage como marca para no repetir).
  useEffect(() => {
    if (!datos) return
    if (totalVencidos > 0 && permisoActual() === 'granted' && !sessionStorage.getItem('revisa-avisado')) {
      mostrarAviso('Revisa', `Tienes ${totalVencidos} mantenimiento(s) vencido(s).`)
      sessionStorage.setItem('revisa-avisado', '1')
    }
  }, [datos, totalVencidos])

  const vehiculos = datos?.vehiculos
  const hayAvisos = totalVencidos > 0 || totalProximos > 0

  // ── Buscador y orden ────────────────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<'recientes' | 'nombre' | 'urgencia'>('recientes')

  // "Peso" de urgencia de un vehículo (vencido=0 … sin nada=3) para ordenar.
  const pesoDe = (id?: number) => {
    const estado = id != null ? estadoPorVehiculo.get(id) : null
    return estado ? pesoUrgencia(estado) : 3
  }

  // Lista final: filtrada por el texto del buscador y ordenada según la elección.
  const termino = busqueda.trim().toLowerCase()
  const listaMostrada = (vehiculos ?? [])
    .filter((v) => `${v.marca} ${v.modelo} ${v.matricula ?? ''}`.toLowerCase().includes(termino))
    .sort((a, b) => {
      if (orden === 'nombre') return `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`)
      if (orden === 'urgencia') return pesoDe(a.id) - pesoDe(b.id)
      return b.fechaCreacion.localeCompare(a.fechaCreacion) // recientes
    })

  return (
    <>
      <Pagina className="pb-28">
        <Cabecera
          titulo="Mis vehículos"
          // Icono de ajustes a la derecha de la cabecera.
          accion={
            <Link
              to="/ajustes"
              aria-label="Ajustes"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
            >
              <Settings size={20} />
            </Link>
          }
        />

        {/* Banner-resumen de avisos (solo si hay próximos o vencidos). */}
        {vehiculos && vehiculos.length > 0 && hayAvisos && (
          <div className="mx-5 mb-4 flex items-center gap-4 rounded-2xl bg-superficie px-4 py-3 text-sm">
            {totalVencidos > 0 && (
              <span className="flex items-center gap-2 font-medium text-estado-vencido">
                <span className="h-2.5 w-2.5 rounded-full bg-estado-vencido" />
                {totalVencidos} vencido{totalVencidos !== 1 && 's'}
              </span>
            )}
            {totalProximos > 0 && (
              <span className="flex items-center gap-2 font-medium text-estado-proximo">
                <span className="h-2.5 w-2.5 rounded-full bg-estado-proximo" />
                {totalProximos} próximo{totalProximos !== 1 && 's'}
              </span>
            )}
          </div>
        )}

        {/* CASO 1: cargando → no mostramos nada (evita parpadeos). */}
        {vehiculos === undefined && null}

        {/* CASO 2: sin vehículos → estado vacío con llamada a la acción. */}
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
            <Link to="/anadir">
              <Boton>Añadir vehículo</Boton>
            </Link>
          </div>
        )}

        {/* CASO 3: hay vehículos → buscador, orden y lista. */}
        {vehiculos && vehiculos.length > 0 && (
          <>
            <div className="mb-4 flex flex-col gap-3 px-5">
              {/* Buscador. El icono es decorativo (pointer-events-none). */}
              <div className="relative">
                <Search
                  size={18}
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  aria-label="Buscar vehículos"
                  placeholder="Buscar por marca, modelo o matrícula"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                />
              </div>
              {/* Botones de orden. */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Ordenar:</span>
                {(
                  [
                    ['recientes', 'Recientes'],
                    ['nombre', 'Nombre'],
                    ['urgencia', 'Urgencia'],
                  ] as const
                ).map(([valor, etiqueta]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setOrden(valor)}
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      orden === valor
                        ? 'bg-white text-gray-900'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>

            {listaMostrada.length === 0 ? (
              <p className="px-5 text-center text-sm text-gray-500">
                Ningún vehículo coincide con la búsqueda.
              </p>
            ) : (
              <motion.ul
                variants={variantesLista}
                initial="oculto"
                animate="visible"
                className="flex flex-col gap-3 px-5"
              >
                {listaMostrada.map((vehiculo) => (
                  <motion.li key={vehiculo.id} variants={variantesTarjeta}>
                    <Link to={`/vehiculo/${vehiculo.id}`} className="block active:scale-[0.98]">
                      <TarjetaVehiculo
                        vehiculo={vehiculo}
                        estado={estadoPorVehiculo.get(vehiculo.id!) ?? null}
                      />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </>
        )}
      </Pagina>

      {/* Botón flotante "+" — FUERA de <Pagina> (el transform rompería su anclaje fixed). */}
      <Link
        to="/anadir"
        aria-label="Añadir vehículo"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg shadow-black/40 transition-transform active:scale-95"
      >
        <Plus size={26} />
      </Link>
    </>
  )
}
