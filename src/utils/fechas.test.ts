// ─────────────────────────────────────────────────────────────────────────────
// Tests de utils/fechas.ts
// Un "test" comprueba que una función devuelve lo que esperamos. Si en el futuro
// alguien rompe la lógica sin querer, estos tests fallarán y avisarán.
//
// Fijamos la fecha de "hoy" con relojes falsos (vi.useFakeTimers) para que los
// resultados sean siempre los mismos, sin depender del día real.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { diasHasta, formatearFechaCorta, hoyComoYYYYMMDD } from './fechas'

describe('utils/fechas', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Fijamos "hoy" = 1 de junio de 2026 (mediodía, hora local).
    vi.setSystemTime(new Date(2026, 5, 1, 12, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers() // Restauramos el reloj real tras cada test.
  })

  it('hoyComoYYYYMMDD devuelve la fecha de hoy con formato AAAA-MM-DD', () => {
    expect(hoyComoYYYYMMDD()).toBe('2026-06-01')
  })

  it('diasHasta cuenta días futuros, hoy y pasados', () => {
    expect(diasHasta('2026-06-01')).toBe(0) // hoy
    expect(diasHasta('2026-06-11')).toBe(10) // dentro de 10 días
    expect(diasHasta('2026-05-25')).toBe(-7) // hace 7 días
  })

  it('formatearFechaCorta convierte AAAA-MM-DD en DD/MM/AAAA', () => {
    expect(formatearFechaCorta('2026-08-01')).toBe('01/08/2026')
  })
})
