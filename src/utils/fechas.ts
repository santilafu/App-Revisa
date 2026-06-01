// ─────────────────────────────────────────────────────────────────────────────
// utils/fechas.ts
// Pequeñas funciones de ayuda para trabajar con fechas. Las guardamos como texto
// "AAAA-MM-DD" (el mismo formato que usa el <input type="date">), así es fácil
// guardarlas en la base de datos y compararlas.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve la fecha de HOY en formato "AAAA-MM-DD" según la hora local del móvil.
 * Construimos el texto a mano para no liarnos con zonas horarias.
 */
export function hoyComoYYYYMMDD(): string {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0') // getMonth() va de 0 a 11.
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

/**
 * Calcula cuántos DÍAS faltan hasta una fecha "AAAA-MM-DD".
 * - Positivo  → la fecha es futura (ej. 12 = faltan 12 días).
 * - 0         → es hoy.
 * - Negativo  → ya pasó (ej. -3 = fue hace 3 días).
 */
export function diasHasta(fechaYYYYMMDD: string): number {
  const [anio, mes, dia] = fechaYYYYMMDD.slice(0, 10).split('-').map(Number)
  // Creamos las dos fechas a medianoche local para comparar solo el día.
  const limite = new Date(anio, mes - 1, dia)
  const ahora = new Date()
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  const msPorDia = 1000 * 60 * 60 * 24
  return Math.round((limite.getTime() - hoy.getTime()) / msPorDia)
}

/**
 * Convierte "2026-08-01" en "01/08/2026" para mostrarlo de forma bonita.
 */
export function formatearFechaCorta(fechaYYYYMMDD: string): string {
  const [anio, mes, dia] = fechaYYYYMMDD.slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}
