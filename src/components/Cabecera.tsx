// ─────────────────────────────────────────────────────────────────────────────
// components/Cabecera.tsx
// La barra superior de cada pantalla: un título y, opcionalmente, una flecha
// para volver atrás. Reutilizarla da un aspecto uniforme a toda la app.
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react' // Icono de flecha, de la librería lucide-react.

interface PropsCabecera {
  titulo: string
  mostrarVolver?: boolean // Si es true, dibuja la flecha de "atrás".
}

export function Cabecera({ titulo, mostrarVolver = false }: PropsCabecera) {
  // useNavigate nos da una función para movernos entre pantallas por código.
  const navegar = useNavigate()

  return (
    <header className="flex items-center gap-3 px-5 pb-4 pt-6">
      {mostrarVolver && (
        <button
          // navegar(-1) significa "vuelve a la pantalla anterior" (como el atrás del navegador).
          onClick={() => navegar(-1)}
          aria-label="Volver" // Texto para lectores de pantalla (accesibilidad).
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="text-2xl font-bold text-white">{titulo}</h1>
    </header>
  )
}
