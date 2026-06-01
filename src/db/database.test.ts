// ─────────────────────────────────────────────────────────────────────────────
// Tests de la base de datos (Dexie) con una IndexedDB falsa en memoria
// (la prepara src/test/setup.ts con fake-indexeddb). Probamos el flujo real:
// guardar, leer y marcar un mantenimiento como hecho.
// ─────────────────────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach } from 'vitest'
import { db } from './database'

// Antes de cada test, vaciamos las tablas para que las pruebas no se mezclen.
beforeEach(async () => {
  await db.vehiculos.clear()
  await db.mantenimientos.clear()
  await db.historial.clear()
})

describe('base de datos Revisa', () => {
  it('guarda un vehículo y lo recupera por su id', async () => {
    const id = await db.vehiculos.add({
      marca: 'Seat',
      modelo: 'Ibiza',
      anio: 2018,
      kmActuales: 85000,
      fechaCreacion: '2026-06-01',
    })

    const guardado = await db.vehiculos.get(id)
    expect(guardado?.marca).toBe('Seat')
    expect(guardado?.modelo).toBe('Ibiza')
  })

  it('marcar como hecho: crea el historial y borra el mantenimiento activo', async () => {
    const vehiculoId = await db.vehiculos.add({
      marca: 'Seat',
      modelo: 'Ibiza',
      anio: 2018,
      kmActuales: 85000,
      fechaCreacion: '',
    })
    const mantenimientoId = await db.mantenimientos.add({
      vehiculoId,
      tipo: 'Cambio de aceite',
      kmLimite: 90000,
      estado: 'al-dia',
      fechaCreacion: '',
    })

    // Misma operación que hace la pantalla de detalle al pulsar "hecho".
    await db.transaction('rw', db.historial, db.mantenimientos, async () => {
      const m = await db.mantenimientos.get(mantenimientoId)
      await db.historial.add({
        mantenimientoId,
        vehiculoId,
        tipo: m!.tipo,
        fechaRealizado: '2026-06-01',
        kmRealizado: 88000,
      })
      await db.mantenimientos.delete(mantenimientoId)
    })

    // El mantenimiento activo ya no está...
    expect(await db.mantenimientos.count()).toBe(0)
    // ...y aparece una entrada en el historial con su tipo "fotografiado".
    const historial = await db.historial.toArray()
    expect(historial).toHaveLength(1)
    expect(historial[0].tipo).toBe('Cambio de aceite')
    expect(historial[0].kmRealizado).toBe(88000)
  })
})
