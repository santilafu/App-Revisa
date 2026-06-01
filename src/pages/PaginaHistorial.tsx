// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaHistorial.tsx
// Lista de mantenimientos YA REALIZADOS de un vehículo, del más reciente al más
// antiguo. Cada entrada se guardó al pulsar "hecho" en el detalle.
// ─────────────────────────────────────────────────────────────────────────────
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { CheckCircle2, Gauge } from 'lucide-react'
import { db } from '../db/database'
import { formatearFechaCorta } from '../utils/fechas'
import { Cabecera } from '../components/Cabecera'
import { Pagina } from '../components/Pagina'

const variantesLista = { oculto: {}, visible: { transition: { staggerChildren: 0.06 } } }
const variantesItem = { oculto: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }

export default function PaginaHistorial() {
  const { id } = useParams()
  const idNum = Number(id)

  // Leemos el historial del vehículo y lo ordenamos de más nuevo a más antiguo.
  const historial = useLiveQuery(async () => {
    const registros = await db.historial.where('vehiculoId').equals(idNum).toArray()
    // sort con localeCompare al revés (b vs a) → fechas más recientes primero.
    return registros.sort((a, b) => b.fechaRealizado.localeCompare(a.fechaRealizado))
  }, [idNum])

  return (
    <Pagina className="pb-8">
      <Cabecera titulo="Historial" mostrarVolver />

      {/* Estado vacío. */}
      {historial?.length === 0 && (
        <div className="mx-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
          <CheckCircle2 size={28} className="text-gray-500" />
          <p className="text-sm text-gray-400">
            Aún no has completado ningún mantenimiento. Cuando marques uno como
            hecho, aparecerá aquí.
          </p>
        </div>
      )}

      {/* Lista de registros. */}
      {historial && historial.length > 0 && (
        <motion.ul
          variants={variantesLista}
          initial="oculto"
          animate="visible"
          className="flex flex-col gap-3 px-5"
        >
          {historial.map((registro) => (
            <motion.li
              key={registro.id}
              variants={variantesItem}
              className="flex items-center gap-3 rounded-2xl bg-superficie p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-estado-aldia/15 text-estado-aldia">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{registro.tipo}</p>
                <div className="mt-0.5 flex items-center gap-3 text-sm text-gray-400">
                  <span>{formatearFechaCorta(registro.fechaRealizado)}</span>
                  <span className="flex items-center gap-1">
                    <Gauge size={14} />
                    {registro.kmRealizado.toLocaleString('es-ES')} km
                  </span>
                </div>
                {registro.notas && (
                  <p className="mt-1 text-sm text-gray-500">{registro.notas}</p>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </Pagina>
  )
}
