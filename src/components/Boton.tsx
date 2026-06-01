// ─────────────────────────────────────────────────────────────────────────────
// components/Boton.tsx
// Botón reutilizable con feedback al pulsar (se "encoge" un poco gracias a
// Framer Motion). Tener UN solo botón reutilizable mantiene la app coherente:
// si un día cambiamos el estilo, se cambia aquí y afecta a todas las pantallas.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PropsBoton {
  children: ReactNode                       // Lo que va dentro del botón (texto, icono...).
  onClick?: () => void                      // Qué hacer al pulsar. Opcional.
  type?: 'button' | 'submit'                // 'submit' = envía un formulario.
  variante?: 'primario' | 'secundario'      // Estilo: destacado o discreto.
  disabled?: boolean                        // Si está desactivado (no se puede pulsar).
  className?: string                         // Clases extra opcionales (ej. "w-full").
}

export function Boton({
  children,
  onClick,
  type = 'button',
  variante = 'primario',
  disabled = false,
  className = '',
}: PropsBoton) {
  // Según la variante, elegimos unos colores u otros.
  const estilosVariante =
    variante === 'primario'
      ? 'bg-white text-gray-900 hover:bg-gray-100' // Botón principal: blanco, destaca.
      : 'bg-white/10 text-white hover:bg-white/15'  // Secundario: translúcido, discreto.

  return (
    // motion.button es un <button> normal con superpoderes de animación.
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // whileTap: mientras lo mantienes pulsado, se reduce al 96% de su tamaño.
      // Es ese pequeño "clic" táctil que hace que la app se sienta viva.
      whileTap={{ scale: 0.96 }}
      className={`rounded-2xl px-5 py-3 text-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${estilosVariante} ${className}`}
    >
      {children}
    </motion.button>
  )
}
