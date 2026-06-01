// ─────────────────────────────────────────────────────────────────────────────
// components/Pagina.tsx
// Envoltorio que da a CADA pantalla la misma animación de entrada/salida
// (deslizamiento + fundido). Al centralizarlo aquí, todas las pantallas se animan
// igual y, si quieres cambiar el efecto, lo tocas en un solo sitio.
//
// IMPORTANTE: dentro de "Pagina" NO deben ir elementos "fixed" (como el botón
// flotante o el modal), porque la animación usa "transform" y eso rompe el
// anclaje de los elementos fixed. Esos van FUERA, como hermanos de <Pagina>.
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Tres estados con nombre: cómo entra, cómo se queda y cómo sale.
const variantes = {
  inicial: { opacity: 0, x: 24 },   // Empieza un poco a la derecha y transparente.
  entra: { opacity: 1, x: 0 },      // Se coloca en su sitio, visible.
  sale: { opacity: 0, x: -24 },     // Sale hacia la izquierda al cambiar de pantalla.
}

interface PropsPagina {
  children: ReactNode
  className?: string
}

export function Pagina({ children, className = '' }: PropsPagina) {
  return (
    <motion.div
      variants={variantes}
      initial="inicial"
      animate="entra"
      exit="sale"
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className={`flex min-h-full flex-col ${className}`}
    >
      {children}
    </motion.div>
  )
}
