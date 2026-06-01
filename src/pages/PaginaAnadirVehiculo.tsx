// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaAnadirVehiculo.tsx
// Formulario para crear un vehículo: marca → modelo → año → matrícula → km.
// Al guardar, lo escribe en Dexie y vuelve a la pantalla de Inicio.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { db } from '../db/database'
import { MARCAS } from '../data/marcas'
import { Cabecera } from '../components/Cabecera'
import { Boton } from '../components/Boton'
import { LogoMarca } from '../components/LogoMarca'

// Clase reutilizable para los <input> de texto/número, para no repetirla.
const claseInput =
  'w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30'

export default function PaginaAnadirVehiculo() {
  const navegar = useNavigate()

  // ── ESTADO DEL FORMULARIO ──────────────────────────────────────────────────
  // useState crea una "variable con memoria": cuando cambia, React redibuja.
  // Cada campo del formulario tiene su propio estado. Esto se llama "input
  // controlado": el valor que se ve en pantalla SIEMPRE es el de estas variables.
  const [marcaId, setMarcaId] = useState<string | null>(null) // id de la marca elegida.
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState('')
  const [matricula, setMatricula] = useState('')
  const [km, setKm] = useState('')
  const [guardando, setGuardando] = useState(false) // Para bloquear el botón al guardar.

  // Datos de la marca seleccionada (para mostrar sus modelos). Puede ser undefined.
  const marcaSeleccionada = MARCAS.find((m) => m.id === marcaId)

  // El formulario es válido solo si hay marca, modelo, año y km.
  const formularioValido =
    marcaSeleccionada !== undefined && modelo !== '' && anio !== '' && km !== ''

  // ── GUARDAR ─────────────────────────────────────────────────────────────────
  async function guardarVehiculo() {
    if (!formularioValido || !marcaSeleccionada) return
    setGuardando(true)
    try {
      // db.vehiculos.add(...) inserta una fila nueva. Dexie le pone el "id" solo.
      await db.vehiculos.add({
        marca: marcaSeleccionada.nombre,
        modelo,
        anio: Number(anio),                       // Convertimos texto → número.
        matricula: matricula.trim() || undefined, // Si está vacía, guardamos undefined.
        kmActuales: Number(km),
        fechaCreacion: new Date().toISOString(),   // Fecha de hoy como texto ISO.
      })
      // Volvemos a Inicio: la lista se actualizará sola gracias a useLiveQuery.
      navegar('/')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-full flex-col pb-8"
    >
      <Cabecera titulo="Añadir vehículo" mostrarVolver />

      {/* "onSubmit" se dispara al enviar el formulario. preventDefault evita que la
          página se recargue (comportamiento por defecto de los formularios HTML). */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          guardarVehiculo()
        }}
        className="flex flex-col gap-6 px-5"
      >
        {/* ── PASO 1: MARCA ──────────────────────────────────────────────────── */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">Marca</label>
          {/* Rejilla de logos. Al tocar uno, se selecciona esa marca. */}
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {MARCAS.map((marca) => {
              const seleccionada = marca.id === marcaId
              return (
                <button
                  key={marca.id}
                  type="button" // Importante: NO es submit, solo selecciona.
                  onClick={() => {
                    setMarcaId(marca.id)
                    setModelo('') // Al cambiar de marca, reseteamos el modelo.
                  }}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-colors ${
                    seleccionada ? 'bg-white/15 ring-2 ring-white/60' : 'hover:bg-white/5'
                  }`}
                >
                  <LogoMarca nombre={marca.nombre} color={marca.colorPlaceholder} tamano={40} />
                  <span className="w-full truncate text-center text-[11px] text-gray-400">
                    {marca.nombre}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── PASO 2: MODELO (solo aparece cuando ya hay marca elegida) ───────── */}
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
          </section>
        )}

        {/* ── PASO 3: AÑO ────────────────────────────────────────────────────── */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">Año</label>
          <input
            type="number"
            inputMode="numeric" // En el móvil, abre el teclado numérico.
            placeholder="Ej. 2018"
            min={1950}
            max={2100}
            value={anio}
            onChange={(e) => setAnio(e.target.value)} // Cada tecla actualiza el estado.
            className={claseInput}
          />
        </section>

        {/* ── PASO 4: MATRÍCULA (opcional) ───────────────────────────────────── */}
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Matrícula <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej. 1234 ABC"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value.toUpperCase())} // En mayúsculas.
            className={claseInput}
          />
        </section>

        {/* ── PASO 5: KILÓMETROS ─────────────────────────────────────────────── */}
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

        {/* Botón de guardar. Se desactiva si faltan datos o mientras guarda. */}
        <Boton type="submit" disabled={!formularioValido || guardando} className="mt-2 w-full">
          <span className="flex items-center justify-center gap-2">
            <Check size={18} />
            {guardando ? 'Guardando…' : 'Guardar vehículo'}
          </span>
        </Boton>
      </form>
    </motion.div>
  )
}
