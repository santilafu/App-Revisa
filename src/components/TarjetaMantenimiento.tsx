// ─────────────────────────────────────────────────────────────────────────────
// components/TarjetaMantenimiento.tsx
// Tarjeta de un mantenimiento dentro del detalle del vehículo.
// Muestra: una barra de color según el estado, el tipo, la cuenta atrás y dos
// acciones → tocar el texto edita; el botón verde lo marca como hecho.
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import type { EstadoMantenimiento, Mantenimiento } from '../types'
import { evaluarMantenimiento, textosCuentaAtras } from '../utils/mantenimiento'
import { EtiquetaEstado } from './EtiquetaEstado'

// Color de la barra lateral según el estado.
const COLOR_BARRA: Record<EstadoMantenimiento, string> = {
  'al-dia': 'bg-estado-aldia',
  'proximo': 'bg-estado-proximo',
  'vencido': 'bg-estado-vencido',
}

interface PropsTarjetaMantenimiento {
  mantenimiento: Mantenimiento
  kmActuales: number       // Para calcular los km restantes.
  onMarcarHecho: () => void // Función que avisa al padre de que se pulsó "hecho".
}

export function TarjetaMantenimiento({
  mantenimiento,
  kmActuales,
  onMarcarHecho,
}: PropsTarjetaMantenimiento) {
  // Calculamos el estado y los textos al vuelo (no se guardan, siempre frescos).
  const evaluacion = evaluarMantenimiento(mantenimiento, kmActuales)
  const frases = textosCuentaAtras(evaluacion)

  return (
    <div className="flex items-stretch overflow-hidden rounded-2xl bg-superficie">
      {/* Barra de color a la izquierda (1,5 de ancho). */}
      <div className={`w-1.5 shrink-0 ${COLOR_BARRA[evaluacion.estado]}`} />

      <div className="flex flex-1 items-center gap-3 py-3 pl-3 pr-3">
        {/* Zona de texto: al tocarla, vamos a la pantalla de editar. */}
        <Link
          to={`/vehiculo/${mantenimiento.vehiculoId}/mantenimiento/${mantenimiento.id}`}
          className="min-w-0 flex-1"
        >
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-white">{mantenimiento.tipo}</p>
            <EtiquetaEstado estado={evaluacion.estado} />
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-400">
            {frases.length > 0 ? frases.join('  ·  ') : 'Sin límite definido'}
          </p>
        </Link>

        {/* Botón redondo verde para marcar como hecho. */}
        <button
          onClick={onMarcarHecho}
          aria-label="Marcar como hecho"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-estado-aldia/15 text-estado-aldia transition-colors hover:bg-estado-aldia/25"
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  )
}
