// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaMantenimiento.tsx
// Formulario para AÑADIR o EDITAR un mantenimiento. Es el MISMO componente para
// los dos casos: si la URL trae un ":mid" (id del mantenimiento), estamos editando;
// si no, estamos creando uno nuevo. Reutilizar el formulario evita duplicar código.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Trash2 } from 'lucide-react'
import { db } from '../db/database'
import type { Mantenimiento } from '../types'
import { TIPOS_MANTENIMIENTO } from '../data/tiposMantenimiento'
import { evaluarMantenimiento } from '../utils/mantenimiento'
import { Cabecera } from '../components/Cabecera'
import { Boton } from '../components/Boton'
import { Pagina } from '../components/Pagina'

const claseInput =
  'w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30'

export default function PaginaMantenimiento() {
  const navegar = useNavigate()
  const { id, mid } = useParams()
  const idNum = Number(id)               // id del vehículo.
  const editando = mid !== undefined     // ¿hay id de mantenimiento? → editar.

  // Necesitamos los km del coche para calcular el estado al guardar.
  const vehiculo = useLiveQuery(() => db.vehiculos.get(idNum), [idNum])
  // Si editamos, cargamos el mantenimiento existente para rellenar el formulario.
  const existente = useLiveQuery(
    () => (editando ? db.mantenimientos.get(Number(mid)) : undefined),
    [mid],
  )

  // Estado de los campos (inputs controlados).
  const [tipo, setTipo] = useState('')
  const [fechaLimite, setFechaLimite] = useState('')
  const [kmLimite, setKmLimite] = useState('')
  const [notas, setNotas] = useState('')

  // Guarda el id del mantenimiento que YA hemos volcado en el formulario.
  const [idCargado, setIdCargado] = useState<number | undefined>(undefined)

  // Cuando llega (o cambia) el mantenimiento a editar, copiamos sus datos a los
  // campos. Se hace durante el render de forma controlada (patrón recomendado por
  // React), en vez de dentro de un useEffect.
  if (existente && existente.id !== idCargado) {
    setIdCargado(existente.id)
    setTipo(existente.tipo)
    setFechaLimite(existente.fechaLimite ?? '')
    setKmLimite(existente.kmLimite != null ? String(existente.kmLimite) : '')
    setNotas(existente.notas ?? '')
  }

  // Regla de validación: hace falta un tipo y AL MENOS un límite (fecha o km).
  const valido = tipo.trim() !== '' && (fechaLimite !== '' || kmLimite !== '')

  async function guardar() {
    if (!valido || !vehiculo) return

    // Campos comunes a crear y editar.
    const datos = {
      vehiculoId: idNum,
      tipo: tipo.trim(),
      fechaLimite: fechaLimite || undefined,
      kmLimite: kmLimite ? Number(kmLimite) : undefined,
      notas: notas.trim() || undefined,
    }

    // Calculamos el estado inicial (aunque luego se recalcula al mostrarlo).
    const estado = evaluarMantenimiento(
      { ...datos, estado: 'al-dia', fechaCreacion: '' } as Mantenimiento,
      vehiculo.kmActuales,
    ).estado

    if (editando) {
      await db.mantenimientos.update(Number(mid), { ...datos, estado })
    } else {
      await db.mantenimientos.add({
        ...datos,
        estado,
        fechaCreacion: new Date().toISOString(),
      })
    }
    navegar(`/vehiculo/${idNum}`)
  }

  async function eliminar() {
    if (!editando) return
    await db.mantenimientos.delete(Number(mid))
    navegar(`/vehiculo/${idNum}`)
  }

  return (
    <Pagina className="pb-8">
      <Cabecera titulo={editando ? 'Editar mantenimiento' : 'Nuevo mantenimiento'} mostrarVolver />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          guardar()
        }}
        className="flex flex-col gap-6 px-5"
      >
        {/* TIPO: campo de texto + sugerencias rápidas (chips). */}
        <section>
          <label htmlFor="tipo" className="mb-2 block text-sm font-medium text-gray-300">
            Tipo
          </label>
          <input
            id="tipo"
            type="text"
            placeholder="Ej. Cambio de aceite"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={claseInput}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {TIPOS_MANTENIMIENTO.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)} // Al tocar una sugerencia, rellena el campo.
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  tipo === t ? 'bg-white text-gray-900' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Aviso: hace falta al menos un límite. */}
        <p className="-mt-2 text-xs text-gray-500">
          Indica al menos un límite: por fecha, por kilómetros, o ambos.
        </p>

        {/* FECHA LÍMITE (opcional). */}
        <section>
          <label htmlFor="fecha-limite" className="mb-2 block text-sm font-medium text-gray-300">
            Fecha límite <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            id="fecha-limite"
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            className={claseInput}
          />
        </section>

        {/* KM LÍMITE (opcional). */}
        <section>
          <label htmlFor="km-limite" className="mb-2 block text-sm font-medium text-gray-300">
            Kilómetros límite <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            id="km-limite"
            type="number"
            inputMode="numeric"
            placeholder="Ej. 90000"
            min={0}
            value={kmLimite}
            onChange={(e) => setKmLimite(e.target.value)}
            className={claseInput}
          />
        </section>

        {/* NOTAS (opcional). */}
        <section>
          <label htmlFor="notas" className="mb-2 block text-sm font-medium text-gray-300">
            Notas <span className="text-gray-500">(opcional)</span>
          </label>
          <textarea
            id="notas"
            rows={3}
            placeholder="Ej. Llevar el coche al taller habitual"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className={`${claseInput} resize-none`}
          />
        </section>

        <Boton type="submit" disabled={!valido} className="mt-2 w-full">
          <span className="flex items-center justify-center gap-2">
            <Check size={18} />
            {editando ? 'Guardar cambios' : 'Añadir mantenimiento'}
          </span>
        </Boton>

        {/* Botón de eliminar: solo cuando estamos editando uno existente. */}
        {editando && (
          <button
            type="button"
            onClick={eliminar}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 font-medium text-estado-vencido transition-colors hover:bg-estado-vencido/10"
          >
            <Trash2 size={18} />
            Eliminar mantenimiento
          </button>
        )}
      </form>
    </Pagina>
  )
}
