// ─────────────────────────────────────────────────────────────────────────────
// Tests del componente EtiquetaEstado: que cada estado muestre su texto correcto.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EtiquetaEstado } from './EtiquetaEstado'

describe('EtiquetaEstado', () => {
  it('muestra "Al día" para el estado al-dia', () => {
    render(<EtiquetaEstado estado="al-dia" />)
    expect(screen.getByText('Al día')).toBeInTheDocument()
  })

  it('muestra "Próximo" para el estado proximo', () => {
    render(<EtiquetaEstado estado="proximo" />)
    expect(screen.getByText('Próximo')).toBeInTheDocument()
  })

  it('muestra "Vencido" para el estado vencido', () => {
    render(<EtiquetaEstado estado="vencido" />)
    expect(screen.getByText('Vencido')).toBeInTheDocument()
  })
})
