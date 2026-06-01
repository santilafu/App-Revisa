// ─────────────────────────────────────────────────────────────────────────────
// utils/backup.ts
// Copia de seguridad: exportar TODOS los datos a un archivo .json e importarlos
// de vuelta. Como la app guarda todo en local, esto sirve de respaldo y para
// pasar tus datos a otro dispositivo.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from '../db/database'
import type { Vehiculo, Mantenimiento, HistorialMantenimiento } from '../types'

// Forma del archivo de copia. "app" y "version" nos ayudan a validar al importar.
interface CopiaSeguridad {
  app: 'Revisa'
  version: number
  exportado: string
  vehiculos: Vehiculo[]
  mantenimientos: Mantenimiento[]
  historial: HistorialMantenimiento[]
}

/**
 * Lee las tres tablas, las mete en un objeto, lo convierte a texto JSON y fuerza
 * la descarga de un archivo en el navegador.
 */
export async function exportarDatos(): Promise<void> {
  const datos: CopiaSeguridad = {
    app: 'Revisa',
    version: 1,
    exportado: new Date().toISOString(),
    vehiculos: await db.vehiculos.toArray(),
    mantenimientos: await db.mantenimientos.toArray(),
    historial: await db.historial.toArray(),
  }

  // Un Blob es un "archivo en memoria". Creamos una URL temporal para descargarlo.
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `revisa-backup-${datos.exportado.slice(0, 10)}.json`
  enlace.click()
  URL.revokeObjectURL(url) // Liberamos la URL temporal.
}

/**
 * Lee un archivo de copia, lo valida y REEMPLAZA todos los datos actuales.
 * Usa una transacción: si algo falla, no queda nada a medias.
 */
export async function importarDatos(archivo: File): Promise<void> {
  const texto = await archivo.text()
  const datos = JSON.parse(texto) as Partial<CopiaSeguridad>

  // Validación básica: que sea de Revisa y traiga la lista de vehículos.
  if (datos?.app !== 'Revisa' || !Array.isArray(datos.vehiculos)) {
    throw new Error('El archivo no parece una copia de seguridad de Revisa.')
  }

  await db.transaction('rw', db.vehiculos, db.mantenimientos, db.historial, async () => {
    // Vaciamos las tablas y volcamos los datos del archivo.
    await db.vehiculos.clear()
    await db.mantenimientos.clear()
    await db.historial.clear()
    // bulkAdd respeta los "id" que vienen en el archivo (claves entrantes).
    await db.vehiculos.bulkAdd(datos.vehiculos ?? [])
    await db.mantenimientos.bulkAdd(datos.mantenimientos ?? [])
    await db.historial.bulkAdd(datos.historial ?? [])
  })
}
