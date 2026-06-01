// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaFormularioVehiculo.tsx
// Formulario ÚNICO para AÑADIR o EDITAR un vehículo. Si la URL trae ":id"
// (ej. /vehiculo/5/editar) estamos editando; si no (/anadir), creando.
// Al editar, además, permite ELIMINAR el coche (y, en cascada, sus mantenimientos
// e historial).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Check, Trash2, ImagePlus, X } from 'lucide-react'
import { db } from '../db/database'
import { MARCAS, buscarMarcaPorNombre } from '../data/marcas'
import { Cabecera } from '../components/Cabecera'
import { Boton } from '../components/Boton'
import { LogoMarca } from '../components/LogoMarca'
import { Pagina } from '../components/Pagina'
import { comprimirImagen } from '../utils/imagen'

const claseInput =
  'w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30'

export default function PaginaFormularioVehiculo() {
  const navegar = useNavigate()
  const { id } = useParams()
  const editando = id !== undefined
  const idNum = Number(id)

  // Si editamos, cargamos el vehículo para rellenar el formulario.
  const existente = useLiveQuery(
    () => (editando ? db.vehiculos.get(idNum) : undefined),
    [id],
  )

  // Estado del formulario (inputs controlados).
  const [marcaId, setMarcaId] = useState<string | null>(null)
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [matricula, setMatricula] = useState('')
  const [km, setKm] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [confirmarBorrado, setConfirmarBorrado] = useState(false)
  const [foto, setFoto] = useState<string | undefined>(undefined) // Foto como data URL.

  // Al cargar el vehículo existente, volcamos sus datos en los campos.
  useEffect(() => {
    if (existente) {
      // Recuperamos el id de la marca a partir de su nombre guardado.
      setMarcaId(buscarMarcaPorNombre(existente.marca)?.id ?? null)
      setModelo(existente.modelo)
      setAnio(String(existente.anio))
      setMatricula(existente.matricula ?? '')
      setKm(String(existente.kmActuales))
      setFoto(existente.foto)
    }
  }, [existente])

  // Cuando el usuario elige una imagen, la comprimimos y la guardamos en el estado.
  async function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (archivo) setFoto(await comprimirImagen(archivo))
  }

  const marcaSeleccionada = MARCAS.find((m) => m.id === marcaId)
  const valido = marcaSeleccionada !== undefined && modelo !== '' && anio !== '' && km !== ''

  async function guardar() {
    if (!valido || !marcaSeleccionada) return
    setGuardando(true)
    try {
      // Datos comunes a crear y editar.
      const datos = {
        marca: marcaSeleccionada.nombre,
        modelo,
        anio: Number(anio),
        matricula: matricula.trim() || undefined,
        kmActuales: Number(km),
        foto: foto || undefined,
      }
      if (editando) {
        // update cambia solo los campos indicados (no toca fechaCreacion).
        await db.vehiculos.update(idNum, datos)
        navegar(`/vehiculo/${idNum}`)
      } else {
        await db.vehiculos.add({ ...datos, fechaCreacion: new Date().toISOString() })
        navegar('/')
      }
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    // Transacción: borramos el coche Y todo lo suyo, o nada.
    await db.transaction('rw', db.vehiculos, db.mantenimientos, db.historial, async () => {
      await db.mantenimientos.where('vehiculoId').equals(idNum).delete()
      await db.historial.where('vehiculoId').equals(idNum).delete()
      await db.vehiculos.delete(idNum)
    })
    navegar('/')
  }

  return (
    <Pagina className="pb-8">
      <Cabecera titulo={editando ? 'Editar vehículo' : 'Añadir vehículo'} mostrarVolver />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          guardar()
        }}
        className="flex flex-col gap-6 px-5"
      >
        {/* FOTO (opcional): vista previa + elegir/quitar. */}
        <section className="flex flex-col items-center gap-2">
          <div className="relative">
            {foto ? (
              <img
                src={foto}
                alt="Foto del vehículo"
                className="h-24 w-24 rounded-2xl object-cover"
              />
            ) : (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-white/15 text-gray-500 transition-colors hover:border-white/30">
                <ImagePlus size={24} />
                <span className="text-[11px]">Foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={elegirFoto} />
              </label>
            )}
            {foto && (
              <button
                type="button"
                onClick={() => setFoto(undefined)}
                aria-label="Quitar foto"
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-estado-vencido text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {foto && (
            <label className="cursor-pointer text-xs text-gray-400 transition-colors hover:text-white">
              Cambiar foto
              <input type="file" accept="image/*" className="hidden" onChange={elegirFoto} />
            </label>
          )}
        </section>

        {/* MARCA: rejilla de logos. */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">Marca</label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {MARCAS.map((marca) => {
              const seleccionada = marca.id === marcaId
              return (
                <button
                  key={marca.id}
                  type="button"
                  onClick={() => {
                    setMarcaId(marca.id)
                    setModelo('') // Al cambiar de marca, reseteamos el modelo.
                  }}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-colors ${
                    seleccionada ? 'bg-white/15 ring-2 ring-white/60' : 'hover:bg-white/5'
                  }`}
                >
                  <LogoMarca nombre={marca.nombre} color={marca.colorPlaceholder} logo={marca.logo} tamano={40} />
                  <span className="w-full truncate text-center text-[11px] text-gray-400">
                    {marca.nombre}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* MODELO: aparece al elegir marca. */}
        {marcaSeleccionada && (
          <section>
            <label className="mb-2 block text-sm font-medium text-gray-300">Modelo</label>
            <div className="flex flex-wrap gap-2">
              {marcaSeleccionada.modelos.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModelo(m)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    modelo === m
                      ? 'bg-white text-gray-900'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {/* Si el modelo guardado no está entre los botones, lo mostramos igualmente. */}
            {modelo && !marcaSeleccionada.modelos.includes(modelo) && (
              <p className="mt-2 text-xs text-gray-500">Modelo actual: {modelo}</p>
            )}
          </section>
        )}

        {/* AÑO */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">Año</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Ej. 2018"
            min={1950}
            max={2100}
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className={claseInput}
          />
        </section>

        {/* MATRÍCULA (opcional) */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Matrícula <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej. 1234 ABC"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value.toUpperCase())}
            className={claseInput}
          />
        </section>

        {/* KILÓMETROS ACTUALES */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Kilómetros actuales
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Ej. 85000"
            min={0}
            value={km}
            onChange={(e) => setKm(e.target.value)}
            className={claseInput}
          />
        </section>

        <Boton type="submit" disabled={!valido || guardando} className="mt-2 w-full">
          <span className="flex items-center justify-center gap-2">
            <Check size={18} />
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Guardar vehículo'}
          </span>
        </Boton>

        {/* Zona de eliminar: solo al editar. Pide confirmación antes de borrar. */}
        {editando && (
          <div className="mt-2">
            {!confirmarBorrado ? (
              <button
                type="button"
                onClick={() => setConfirmarBorrado(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-medium text-estado-vencido transition-colors hover:bg-estado-vencido/10"
              >
                <Trash2 size={18} />
                Eliminar vehículo
              </button>
            ) : (
              <div className="rounded-2xl bg-estado-vencido/10 p-4 text-center">
                <p className="text-sm text-gray-300">
                  ¿Seguro? Se borrarán también sus mantenimientos e historial.
                </p>
                <div className="mt-3 flex gap-3">
                  <Boton
                    variante="secundario"
                    onClick={() => setConfirmarBorrado(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Boton>
                  <button
                    type="button"
                    onClick={eliminar}
                    className="flex-1 rounded-2xl bg-estado-vencido py-3 font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Sí, eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </Pagina>
  )
}
