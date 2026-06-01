// ─────────────────────────────────────────────────────────────────────────────
// Tests del componente TarjetaVehiculo: que muestre bien los datos del coche.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TarjetaVehiculo } from './TarjetaVehiculo'
import type { Vehiculo } from '../types'

// Un vehículo de ejemplo para las pruebas.
const vehiculo: Vehiculo = {
  id: 1,
  marca: 'Seat',
  modelo: 'Ibiza',
  anio: 2018,
  matricula: '1234 ABC',
  kmActuales: 85000,
  fechaCreacion: '2026-06-01',
}

describe('TarjetaVehiculo', () => {
  it('muestra marca y modelo, año, km y matrícula', () => {
    render(<TarjetaVehiculo vehiculo={vehiculo} />)
    expect(screen.getByText('Seat Ibiza')).toBeInTheDocument()
    expect(screen.getByText('2018')).toBeInTheDocument()
    expect(screen.getByText('1234 ABC')).toBeInTheDocument()
    // El separador de miles depende del idioma; aceptamos punto o coma.
    expect(screen.getByText(/85[.,]000 km/)).toBeInTheDocument()
  })

  it('si no hay foto, muestra el logo con iniciales en vez de una imagen', () => {
    render(<TarjetaVehiculo vehiculo={vehiculo} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('SE')).toBeInTheDocument()
  })

  it('si hay foto, muestra la imagen del vehículo', () => {
    render(<TarjetaVehiculo vehiculo={{ ...vehiculo, foto: 'data:image/png;base64,AAAA' }} />)
    expect(screen.getByRole('img', { name: 'Seat Ibiza' })).toBeInTheDocument()
  })
})
