// ─────────────────────────────────────────────────────────────────────────────
// components/TarjetaVehiculo.tsx
// La tarjeta que representa a UN vehículo en la lista de Inicio.
// Es un componente "de presentación": solo recibe los datos y los pinta bonito,
// no contiene lógica de base de datos.
// ─────────────────────────────────────────────────────────────────────────────
import { Gauge } from 'lucide-react' // Icono de cuentakilómetros.
import type { Vehiculo } from '../types'
import { buscarMarcaPorNombre } from '../data/marcas'
import { LogoMarca } from './LogoMarca'

interface PropsTarjetaVehiculo {
  vehiculo: Vehiculo
}

export function TarjetaVehiculo({ vehiculo }: PropsTarjetaVehiculo) {
  // Buscamos la marca en el catálogo para obtener su color.
  // Si no la encontramos (raro), usamos un gris neutro por defecto.
  const marca = buscarMarcaPorNombre(vehiculo.marca)
  const color = marca?.colorPlaceholder ?? '#6b7280'

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-superficie p-4">
      {/* Logo provisional de la marca. */}
      <LogoMarca nombre={vehiculo.marca} color={color} tamano={52} />

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
    </div>
  )
}
