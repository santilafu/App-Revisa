// ─────────────────────────────────────────────────────────────────────────────
// components/LogoMarca.tsx
// Logo PROVISIONAL de una marca: un círculo de color con sus iniciales.
// (Recuerda: los logos reales son marcas registradas; los pondremos más tarde.)
// Este componente es "reutilizable": lo usaremos en la tarjeta del coche y en el
// selector de marcas del formulario.
// ─────────────────────────────────────────────────────────────────────────────

// Las "props" son los datos que recibe un componente desde fuera, como los
// argumentos de una función. Aquí definimos su forma con TypeScript.
interface PropsLogoMarca {
  nombre: string  // Nombre de la marca, ej. "Seat".
  color: string   // Color de fondo del círculo (hex), ej. "#E30613".
  tamano?: number // Diámetro en píxeles. Opcional: si no se pasa, vale 48.
}

/**
 * Calcula las iniciales de una marca para mostrarlas en el círculo.
 * - Si tiene varias palabras ("Land Rover" / "Mercedes-Benz") → 1ª letra de las 2 primeras: "LR", "MB".
 * - Si es una sola palabra ("Seat") → sus 2 primeras letras: "SE".
 */
function obtenerIniciales(nombre: string): string {
  // Partimos el nombre por espacios o guiones.
  const palabras = nombre.split(/[\s-]+/).filter(Boolean)
  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[1][0]).toUpperCase()
  }
  return nombre.slice(0, 2).toUpperCase()
}

/**
 * Decide si sobre un color de fondo se lee mejor texto NEGRO o BLANCO.
 * Calcula la "luminancia" (cuánto brilla el color): si es muy claro (amarillos,
 * etc.), usamos texto negro; si es oscuro, texto blanco. Así siempre se lee.
 */
function colorDeTextoLegible(hexFondo: string): string {
  const hex = hexFondo.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Fórmula estándar de luminancia percibida (el ojo ve más el verde).
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminancia > 0.6 ? '#111827' : '#ffffff' // claro → negro, oscuro → blanco
}

export function LogoMarca({ nombre, color, tamano = 48 }: PropsLogoMarca) {
  return (
    <div
      // Usamos "style" (estilo en línea) para lo que es dinámico: el color y el
      // tamaño dependen de datos, así que no pueden ser clases fijas de Tailwind.
      style={{
        width: tamano,
        height: tamano,
        backgroundColor: color,
        color: colorDeTextoLegible(color),
        fontSize: tamano * 0.36, // El texto escala con el tamaño del círculo.
      }}
      // Las clases de Tailwind sí son fijas: redondo, centrado y en negrita.
      className="flex shrink-0 select-none items-center justify-center rounded-full font-bold"
    >
      {obtenerIniciales(nombre)}
    </div>
  )
}
