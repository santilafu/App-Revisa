// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaDetalleVehiculo.tsx
// Detalle de un vehículo: su resumen + la lista de mantenimientos ordenados por
// urgencia. Desde aquí se añade, se edita (tocando uno) y se marca como hecho.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, History, Wrench, Pencil } from 'lucide-react'
import { db } from '../db/database'
import type { Mantenimiento } from '../types'
import { buscarMarcaPorNombre } from '../data/marcas'
import { useLiveQuery } from 'dexie-react-hooks'
import { evaluarMantenimiento, pesoUrgencia } from '../utils/mantenimiento'
import { Cabecera } from '../components/Cabecera'
import { LogoMarca } from '../components/LogoMarca'
import { TarjetaMantenimiento } from '../components/TarjetaMantenimiento'
import { ModalCompletar, type DatosCompletar } from '../components/ModalCompletar'
import { Pagina } from '../components/Pagina'

const variantesLista = { oculto: {}, visible: { transition: { staggerChildren: 0.06 } } }
const variantesTarjeta = { oculto: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }

export default function PaginaDetalleVehiculo() {
  // useParams lee el ":id" de la URL. Llega como texto, lo pasamos a número.
  const { id } = useParams()
  const idNum = Number(id)

  // Leemos el vehículo y sus mantenimientos. El "[idNum]" le dice a useLiveQuery
  // que rehaga la consulta si cambia el id.
  const vehiculo = useLiveQuery(() => db.vehiculos.get(idNum), [idNum])
  const mantenimientos = useLiveQuery(
    () => db.mantenimientos.where('vehiculoId').equals(idNum).toArray(),
    [idNum],
  )

  // Guarda qué mantenimiento estamos completando (para abrir el modal). null = cerrado.
  const [completando, setCompletando] = useState<Mantenimiento | null>(null)

  // Mientras carga el vehículo, no mostramos nada (evita parpadeos).
  if (!vehiculo) return null

  const marca = buscarMarcaPorNombre(vehiculo.marca)
  const color = marca?.colorPlaceholder ?? '#6b7280'

  // Ordenamos los mantenimientos: primero los más urgentes (vencidos arriba).
  const ordenados = [...(mantenimientos ?? [])].sort((a, b) => {
    const ea = evaluarMantenimiento(a, vehiculo.kmActuales).estado
    const eb = evaluarMantenimiento(b, vehiculo.kmActuales).estado
    return pesoUrgencia(ea) - pesoUrgencia(eb)
  })

  // ── Marcar como hecho: pasa el mantenimiento al historial ────────────────────
  async function confirmarCompletado(datos: DatosCompletar) {
    if (!completando || !vehiculo) return
    const m = completando

    // Una TRANSACCIÓN agrupa varias operaciones: o se hacen TODAS o NINGUNA.
    // Así nunca queda la base de datos a medias (ej. borrado sin guardar historial).
    await db.transaction('rw', db.historial, db.mantenimientos, db.vehiculos, async () => {
      // 1) Guardamos el registro en el historial (con la "foto" del tipo).
      await db.historial.add({
        mantenimientoId: m.id!,
        vehiculoId: m.vehiculoId,
        tipo: m.tipo,
        fechaRealizado: datos.fechaRealizado,
        kmRealizado: datos.kmRealizado,
        notas: datos.notas.trim() || undefined,
      })
      // 2) Borramos el mantenimiento de la lista activa.
      await db.mantenimientos.delete(m.id!)
      // 3) Si has metido más km de los que el coche tenía, actualizamos sus km.
      if (datos.kmRealizado > vehiculo.kmActuales) {
        await db.vehiculos.update(vehiculo.id!, { kmActuales: datos.kmRealizado })
      }
    })

    setCompletando(null) // Cerramos el modal.
  }

  return (
    <>
      <Pagina className="pb-28">
        <Cabecera titulo="Vehículo" mostrarVolver />

      {/* Resumen del vehículo. */}
      <div className="mx-5 mb-6 flex items-center gap-4 rounded-2xl bg-superficie p-5">
        {/* Si el coche tiene foto, la mostramos; si no, el logo de la marca. */}
        {vehiculo.foto ? (
          <img
            src={vehiculo.foto}
            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <LogoMarca nombre={vehiculo.marca} color={color} logo={marca?.logo} tamano={64} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-white">
            {vehiculo.marca} {vehiculo.modelo}
          </p>
          <p className="text-sm text-gray-400">
            {vehiculo.anio} · {vehiculo.kmActuales.toLocaleString('es-ES')} km
          </p>
          {vehiculo.matricula && (
            <p className="mt-1 inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium tracking-wider text-gray-300">
              {vehiculo.matricula}
            </p>
          )}
        </div>
        {/* Botón para editar los datos y los km del vehículo. */}
        <Link
          to={`/vehiculo/${idNum}/editar`}
          aria-label="Editar vehículo"
          className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
        >
          <Pencil size={18} />
        </Link>
      </div>

      {/* Cabecera de la sección + enlace al historial. */}
      <div className="mb-3 flex items-center justify-between px-5">
        <h2 className="font-semibold text-white">Mantenimientos</h2>
        <Link
          to={`/vehiculo/${idNum}/historial`}
          className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <History size={16} />
          Historial
        </Link>
      </div>

      {/* Lista de mantenimientos o estado vacío. */}
      {ordenados.length === 0 ? (
        <div className="mx-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
          <Wrench size={28} className="text-gray-500" />
          <p className="text-sm text-gray-400">
            No hay mantenimientos. Añade el primero (ITV, aceite, ruedas…).
          </p>
        </div>
      ) : (
        <motion.ul
          variants={variantesLista}
          initial="oculto"
          animate="visible"
          className="flex flex-col gap-3 px-5"
        >
          {ordenados.map((m) => (
            <motion.li key={m.id} variants={variantesTarjeta}>
              <TarjetaMantenimiento
                mantenimiento={m}
                kmActuales={vehiculo.kmActuales}
                onMarcarHecho={() => setCompletando(m)}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}

      </Pagina>

      {/* Botón flotante para añadir un mantenimiento — FUERA de <Pagina>. */}
      <Link
        to={`/vehiculo/${idNum}/mantenimiento/nuevo`}
        aria-label="Añadir mantenimiento"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg shadow-black/40 transition-transform active:scale-95"
      >
        <Plus size={26} />
      </Link>

      {/* El modal solo existe cuando "completando" tiene un mantenimiento.
          AnimatePresence permite que se anime también al SALIR (al cerrarse).
          Va FUERA de <Pagina> para que el overlay cubra toda la pantalla. */}
      <AnimatePresence>
        {completando && (
          <ModalCompletar
            tipo={completando.tipo}
            kmActuales={vehiculo.kmActuales}
            onCerrar={() => setCompletando(null)}
            onConfirmar={confirmarCompletado}
          />
        )}
      </AnimatePresence>
    </>
  )
}
