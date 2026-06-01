// ─────────────────────────────────────────────────────────────────────────────
// Tests de utils/mantenimiento.ts — la lógica del semáforo (al día / próximo /
// vencido), que es el corazón de la app.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  evaluarMantenimiento,
  resumenEstados,
  textosCuentaAtras,
  pesoUrgencia,
} from './mantenimiento'
import type { Mantenimiento } from '../types'

// Pequeña ayuda para crear un mantenimiento de prueba con solo los campos que
// nos interesan en cada caso. El resto se rellena con valores por defecto.
function crear(parcial: Partial<Mantenimiento>): Mantenimiento {
  return { vehiculoId: 1, tipo: 'Prueba', estado: 'al-dia', fechaCreacion: '', ...parcial }
}

describe('evaluarMantenimiento', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 1, 12, 0, 0)) // hoy = 1 jun 2026
  })
  afterEach(() => vi.useRealTimers())

  it('marca VENCIDO si la fecha ya pasó', () => {
    expect(evaluarMantenimiento(crear({ fechaLimite: '2026-05-01' }), 0).estado).toBe('vencido')
  })

  it('marca VENCIDO si se ha pasado de kilómetros', () => {
    expect(evaluarMantenimiento(crear({ kmLimite: 1000 }), 1500).estado).toBe('vencido')
  })

  it('marca PRÓXIMO si faltan 30 días o menos', () => {
    expect(evaluarMantenimiento(crear({ fechaLimite: '2026-06-20' }), 0).estado).toBe('proximo')
  })

  it('marca PRÓXIMO si faltan 1000 km o menos', () => {
    expect(evaluarMantenimiento(crear({ kmLimite: 10500 }), 10000).estado).toBe('proximo')
  })

  it('marca AL DÍA si falta mucho', () => {
    expect(evaluarMantenimiento(crear({ fechaLimite: '2027-01-01' }), 0).estado).toBe('al-dia')
  })

  it('gana lo más urgente entre fecha y kilómetros', () => {
    // Fecha lejana (al día) pero km ya pasados (vencido) → debe ganar "vencido".
    const m = crear({ fechaLimite: '2027-01-01', kmLimite: 1000 })
    expect(evaluarMantenimiento(m, 2000).estado).toBe('vencido')
  })
})

describe('resumenEstados', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 1, 12, 0, 0))
  })
  afterEach(() => vi.useRealTimers())

  it('cuenta cada estado y elige el más urgente', () => {
    const lista = [
      crear({ fechaLimite: '2026-05-01' }), // vencido
      crear({ fechaLimite: '2026-06-20' }), // próximo
      crear({ fechaLimite: '2027-01-01' }), // al día
    ]
    const r = resumenEstados(lista, 0)
    expect(r.vencidos).toBe(1)
    expect(r.proximos).toBe(1)
    expect(r.alDia).toBe(1)
    expect(r.total).toBe(3)
    expect(r.masUrgente).toBe('vencido')
  })

  it('sin mantenimientos, no hay estado más urgente', () => {
    expect(resumenEstados([], 0).masUrgente).toBeNull()
  })
})

describe('pesoUrgencia y textosCuentaAtras', () => {
  it('pesoUrgencia ordena vencido < próximo < al día', () => {
    expect(pesoUrgencia('vencido')).toBeLessThan(pesoUrgencia('proximo'))
    expect(pesoUrgencia('proximo')).toBeLessThan(pesoUrgencia('al-dia'))
  })

  it('textosCuentaAtras genera frases legibles', () => {
    const frases = textosCuentaAtras({ estado: 'proximo', diasRestantes: 1, kmRestantes: 500 })
    expect(frases).toContain('Vence mañana')
    expect(frases.some((f) => f.includes('500'))).toBe(true)
  })
})
