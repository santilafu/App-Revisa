// ─────────────────────────────────────────────────────────────────────────────
// components/ModalCompletar.tsx
// Ventana emergente (modal) que aparece al pulsar "hecho". Pregunta la fecha en
// que se realizó, los km y unas notas, antes de pasar el mantenimiento al historial.
//
// Usa Framer Motion para entrar/salir con animación. La salida (exit) la coordina
// <AnimatePresence> desde la pantalla que lo abre.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import { hoyComoYYYYMMDD } from '../utils/fechas'
import { Boton } from './Boton'

const claseInput =
  'w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30'

// Forma de los datos que devolvemos al confirmar.
export interface DatosCompletar {
  fechaRealizado: string
  kmRealizado: number
  notas: string
}

interface PropsModalCompletar {
  tipo: string         // Nombre del mantenimiento, para el título.
  kmActuales: number   // Para rellenar el campo de km por defecto.
  onCerrar: () => void
  onConfirmar: (datos: DatosCompletar) => void
}

export function ModalCompletar({ tipo, kmActuales, onCerrar, onConfirmar }: PropsModalCompletar) {
  // Rellenamos por defecto con la fecha de hoy y los km actuales del coche.
  const [fecha, setFecha] = useState(hoyComoYYYYMMDD())
  const [km, setKm] = useState(String(kmActuales))
  const [notas, setNotas] = useState('')

  return (
    // Capa oscura que cubre toda la pantalla. Al hacer clic FUERA del panel, cierra.
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCerrar}
    >
      {/* El panel sube desde abajo. stopPropagation evita que un clic dentro cierre. */}
      <motion.div
        className="w-full max-w-md rounded-3xl bg-superficie p-5"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white">Completar mantenimiento</h2>
        <p className="mb-4 text-sm text-gray-400">{tipo}</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Fecha realizada</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={claseInput}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Kilómetros</label>
            <input
              type="number"
              inputMode="numeric"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className={claseInput}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Notas <span className="text-gray-500">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Cambiado en el taller de Juan"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className={`${claseInput} resize-none`}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Boton variante="secundario" onClick={onCerrar} className="flex-1">
            Cancelar
          </Boton>
          <Boton
            onClick={() =>
              onConfirmar({ fechaRealizado: fecha, kmRealizado: Number(km), notas })
            }
            className="flex-1"
          >
            Confirmar
          </Boton>
        </div>
      </motion.div>
    </motion.div>
  )
}
