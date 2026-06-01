// ─────────────────────────────────────────────────────────────────────────────
// components/LogoMarca.tsx
// Logo de una marca. Si recibe la ruta de una imagen ("logo"), la muestra dentro
// de un círculo blanco. Si no, dibuja un círculo de color con las INICIALES
// (placeholder provisional, porque los logos reales son marcas registradas).
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'

interface PropsLogoMarca {
  nombre: string   // Nombre de la marca, ej. "Seat".
  color: string    // Color de fondo del círculo provisional (hex).
  tamano?: number  // Diámetro en píxeles. Opcional: por defecto 48.
  logo?: string    // Ruta de la imagen del logo (opcional).
}

/** Iniciales para el placeholder (ver explicación en cada caso). */
function obtenerIniciales(nombre: string): string {
  const palabras = nombre.split(/[\s-]+/).filter(Boolean)
  if (palabras.length >= 2) return (palabras[0][0] + palabras[1][0]).toUpperCase()
  return nombre.slice(0, 2).toUpperCase()
}

/** Elige texto negro o blanco según lo claro/oscuro que sea el color de fondo. */
function colorDeTextoLegible(hexFondo: string): string {
  const hex = hexFondo.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminancia > 0.6 ? '#111827' : '#ffffff'
}

export function LogoMarca({ nombre, color, tamano = 48, logo }: PropsLogoMarca) {
  // Si la imagen falla al cargar (ruta mal o archivo inexistente), volvemos
  // al placeholder de iniciales sin romper nada.
  const [errorImagen, setErrorImagen] = useState(false)

  // CASO 1: hay logo y carga bien → mostramos la imagen sobre fondo blanco.
  if (logo && !errorImagen) {
    return (
      <div
        // El fondo blanco se fija con estilo en línea (no con la clase bg-white)
        // para que el modo claro/oscuro NO lo altere: un logo necesita su fondo.
        style={{ width: tamano, height: tamano, backgroundColor: '#ffffff' }}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full p-1.5"
      >
        <img
          src={logo}
          alt={nombre}
          onError={() => setErrorImagen(true)}
          className="h-full w-full object-contain"
        />
      </div>
    )
  }

  // CASO 2: sin logo (o falló) → círculo de color con iniciales.
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        backgroundColor: color,
        color: colorDeTextoLegible(color),
        fontSize: tamano * 0.36,
      }}
      className="flex shrink-0 select-none items-center justify-center rounded-full font-bold"
    >
      {obtenerIniciales(nombre)}
    </div>
  )
}
