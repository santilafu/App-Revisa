// ─────────────────────────────────────────────────────────────────────────────
// Tests del componente LogoMarca.
// "render" dibuja el componente en el navegador simulado; "screen" busca cosas en
// lo dibujado, como lo haría una persona o un lector de pantalla.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoMarca } from './LogoMarca'

describe('LogoMarca', () => {
  it('muestra las 2 primeras letras si la marca es de una palabra', () => {
    render(<LogoMarca nombre="Seat" color="#E30613" />)
    expect(screen.getByText('SE')).toBeInTheDocument()
  })

  it('muestra la inicial de cada palabra si la marca tiene varias', () => {
    render(<LogoMarca nombre="Land Rover" color="#005A2B" />)
    expect(screen.getByText('LR')).toBeInTheDocument()
  })

  it('muestra la imagen del logo cuando se le pasa una ruta', () => {
    render(<LogoMarca nombre="Seat" color="#E30613" logo="/logos/seat.svg" />)
    const imagen = screen.getByRole('img', { name: 'Seat' })
    expect(imagen).toHaveAttribute('src', '/logos/seat.svg')
  })
})
