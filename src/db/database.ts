// ─────────────────────────────────────────────────────────────────────────────
// db/database.ts
// Aquí configuramos la base de datos LOCAL del navegador con Dexie.js.
//
// ¿Qué es esto? El navegador tiene una pequeña base de datos integrada llamada
// IndexedDB. Es potente pero incómoda de usar a mano. Dexie es una librería que
// la envuelve y la hace fácil y agradable. Todo se guarda EN EL MÓVIL del usuario:
// sin servidor, sin login, sin internet. Si cierra y vuelve a abrir, sus datos
// siguen ahí.
// ─────────────────────────────────────────────────────────────────────────────
import Dexie, { type Table } from 'dexie'
import type { Vehiculo, Mantenimiento, HistorialMantenimiento } from '../types'

/**
 * Creamos nuestra base de datos como una CLASE que hereda de Dexie.
 * Dentro declaramos nuestras "tablas" (en IndexedDB se llaman almacenes).
 * Cada "Table<Tipo, number>" significa: una tabla cuyos registros tienen la
 * forma "Tipo" y cuya clave principal (id) es un número.
 */
export class RevisaDB extends Dexie {
  // El "!" le promete a TypeScript que Dexie rellenará estas propiedades.
  vehiculos!: Table<Vehiculo, number>
  mantenimientos!: Table<Mantenimiento, number>
  historial!: Table<HistorialMantenimiento, number>

  constructor() {
    // 'RevisaDB' es el nombre con el que se guarda la base de datos en el navegador.
    super('RevisaDB')

    // version(1) = el "esquema" o estructura inicial. Si en el futuro añadimos o
    // cambiamos campos, crearemos version(2), version(3)... y Dexie migra los datos.
    //
    // En cada tabla declaramos solo los campos por los que querremos BUSCAR o
    // ORDENAR (los llamados índices). No hace falta listar todos los campos.
    //   '++id'  → clave principal numérica que se incrementa sola (1, 2, 3...).
    //   resto   → índices para hacer consultas rápidas.
    this.version(1).stores({
      vehiculos: '++id, marca, modelo, anio',
      mantenimientos: '++id, vehiculoId, tipo, estado, fechaLimite, kmLimite',
      historial: '++id, mantenimientoId, vehiculoId, fechaRealizado',
    })
  }
}

/**
 * Creamos UNA sola instancia de la base de datos y la exportamos.
 * En el resto de la app simplemente haremos `import { db } from '.../db/database'`
 * y usaremos `db.vehiculos`, `db.mantenimientos`, etc. (eso será en la Fase 2).
 */
export const db = new RevisaDB()
