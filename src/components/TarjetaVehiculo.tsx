// ─────────────────────────────────────────────────────────────────────────────
// components/TarjetaVehiculo.tsx
// La tarjeta que representa a UN vehículo en la lista de Inicio.
// Muestra su foto (o el logo provisional), datos y un punto de color con el
// estado de su mantenimiento más urgente.
// ─────────────────────────────────────────────────────────────────────────────
import { Gauge } from 'lucide-react'
import type { EstadoMantenimiento, Vehiculo } from '../types'
import { buscarMarcaPorNombre } from '../data/marcas'
import { LogoMarca } from './LogoMarca'

// Color del puntito indicador según el estado más urgente del vehículo.
const COLOR_PUNTO: Record<EstadoMantenimiento, string> = {
  'al-dia': 'bg-estado-aldia',
  'proximo': 'bg-estado-proximo',
  'vencido': 'bg-estado-vencido',
}

interface PropsTarjetaVehiculo {
  vehiculo: Vehiculo
  // Estado más urgente de sus mantenimientos (o null si no tiene ninguno).
  estado?: EstadoMantenimiento | null
}

export function TarjetaVehiculo({ vehiculo, estado = null }: PropsTarjetaVehiculo) {
  const marca = buscarMarcaPorNombre(vehiculo.marca)
  const color = marca?.colorPlaceholder ?? '#6b7280'

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-superficie p-4">
      {/* Avatar: si el coche tiene foto, la mostramos; si no, el logo de la marca. */}
      {vehiculo.foto ? (
        <img
          src={vehiculo.foto}
          alt={`${vehiculo.marca} ${vehiculo.modelo}`}
          className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <LogoMarca nombre={vehiculo.marca} color={color} tamano={52} />
      )}

      {/* Bloque de texto: marca + modelo arriba, año y km debajo. */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">
          {vehiculo.marca} {vehiculo.modelo}
        </p>
        <div className="mt-0.5 flex items-center gap-3 text-sm text-gray-400">
          <span>{vehiculo.anio}</span>
          <span className="flex items-center gap-1">
            <Gauge size={14} />
            {/* toLocaleString('es-ES') pone el separador de miles: 12.500 km */}
            {vehiculo.kmActuales.toLocaleString('es-ES')} km
          </span>
        </div>
        {/* La matrícula solo se muestra si el usuario la rellenó. */}
        {vehiculo.matricula && (
          <p className="mt-1 inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium tracking-wider text-gray-300">
            {vehiculo.matricula}
          </p>
        )}
      </div>

      {/* Punto de color con el estado más urgente (si hay mantenimientos). */}
      {estado && <span className={`h-3 w-3 shrink-0 rounded-full ${COLOR_PUNTO[estado]}`} />}
    </div>
  )
}
