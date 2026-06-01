// ─────────────────────────────────────────────────────────────────────────────
// components/EtiquetaEstado.tsx
// La "pastilla" de color que indica el estado de un mantenimiento.
// Verde = al día, ámbar = próximo, rojo = vencido (los colores que definimos en
// index.css con @theme).
// ─────────────────────────────────────────────────────────────────────────────
import type { EstadoMantenimiento } from '../types'

// Un "Record" es un objeto-diccionario: para cada estado posible, guardamos su
// texto y sus clases de color. Así evitamos escribir varios "if".
const CONFIG: Record<EstadoMantenimiento, { texto: string; clases: string }> = {
  'al-dia': { texto: 'Al día', clases: 'bg-estado-aldia/15 text-estado-aldia' },
  'proximo': { texto: 'Próximo', clases: 'bg-estado-proximo/15 text-estado-proximo' },
  'vencido': { texto: 'Vencido', clases: 'bg-estado-vencido/15 text-estado-vencido' },
}

export function EtiquetaEstado({ estado }: { estado: EstadoMantenimiento }) {
  const { texto, clases } = CONFIG[estado]
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${clases}`}>
      {texto}
    </span>
  )
}
