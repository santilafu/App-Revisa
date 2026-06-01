// ─────────────────────────────────────────────────────────────────────────────
// utils/mantenimiento.ts
// El "cerebro" del semáforo: decide si un mantenimiento está al día, próximo o
// vencido, y prepara los textos de la cuenta atrás. Tenerlo aquí (y no dentro de
// un componente) nos deja reutilizarlo y probarlo fácilmente.
// ─────────────────────────────────────────────────────────────────────────────
import type { EstadoMantenimiento, Mantenimiento } from '../types'
import { diasHasta } from './fechas'

// Umbrales para el estado "próximo" (ámbar). Al estar aquí como constantes, si un
// día quieres cambiarlos, lo haces en un solo sitio.
export const DIAS_AVISO = 30
export const KM_AVISO = 1000

// Resultado de evaluar un mantenimiento. "null" significa "no aplica" (por ejemplo,
// si el mantenimiento no tiene fecha límite, diasRestantes será null).
export interface Evaluacion {
  estado: EstadoMantenimiento
  diasRestantes: number | null
  kmRestantes: number | null
}

/**
 * Evalúa un mantenimiento comparándolo con la fecha de hoy y los km actuales del
 * vehículo. Regla: gana lo más urgente. Si CUALQUIER límite se pasó → vencido;
 * si CUALQUIER límite está cerca → próximo; si no → al día.
 */
export function evaluarMantenimiento(m: Mantenimiento, kmActuales: number): Evaluacion {
  const diasRestantes = m.fechaLimite ? diasHasta(m.fechaLimite) : null
  const kmRestantes = m.kmLimite != null ? m.kmLimite - kmActuales : null

  const vencidoPorFecha = diasRestantes != null && diasRestantes < 0
  const vencidoPorKm = kmRestantes != null && kmRestantes < 0
  const proximoPorFecha = diasRestantes != null && diasRestantes <= DIAS_AVISO
  const proximoPorKm = kmRestantes != null && kmRestantes <= KM_AVISO

  let estado: EstadoMantenimiento = 'al-dia'
  if (vencidoPorFecha || vencidoPorKm) estado = 'vencido'
  else if (proximoPorFecha || proximoPorKm) estado = 'proximo'

  return { estado, diasRestantes, kmRestantes }
}

/**
 * Convierte la evaluación en frases legibles para la cuenta atrás.
 * Devuelve un array porque puede haber dos (por fecha Y por km).
 */
export function textosCuentaAtras(ev: Evaluacion): string[] {
  const frases: string[] = []

  if (ev.diasRestantes != null) {
    if (ev.diasRestantes < 0) frases.push(`Venció hace ${Math.abs(ev.diasRestantes)} días`)
    else if (ev.diasRestantes === 0) frases.push('Vence hoy')
    else if (ev.diasRestantes === 1) frases.push('Vence mañana')
    else frases.push(`Vence en ${ev.diasRestantes} días`)
  }

  if (ev.kmRestantes != null) {
    const km = Math.abs(ev.kmRestantes).toLocaleString('es-ES')
    if (ev.kmRestantes < 0) frases.push(`Pasado ${km} km`)
    else frases.push(`Faltan ${km} km`)
  }

  return frases
}

/**
 * Peso para ordenar: lo más urgente primero (vencido → próximo → al día).
 */
export function pesoUrgencia(estado: EstadoMantenimiento): number {
  if (estado === 'vencido') return 0
  if (estado === 'proximo') return 1
  return 2
}

// Resumen de los estados de TODOS los mantenimientos de un vehículo.
// Lo usamos en la pantalla de Inicio para el banner y el punto de color.
export interface ResumenEstados {
  vencidos: number
  proximos: number
  alDia: number
  total: number
  masUrgente: EstadoMantenimiento | null // El peor estado presente (o null si no hay nada).
}

export function resumenEstados(mantenimientos: Mantenimiento[], kmActuales: number): ResumenEstados {
  let vencidos = 0
  let proximos = 0
  let alDia = 0
  for (const m of mantenimientos) {
    const estado = evaluarMantenimiento(m, kmActuales).estado
    if (estado === 'vencido') vencidos++
    else if (estado === 'proximo') proximos++
    else alDia++
  }

  let masUrgente: EstadoMantenimiento | null = null
  if (vencidos > 0) masUrgente = 'vencido'
  else if (proximos > 0) masUrgente = 'proximo'
  else if (alDia > 0) masUrgente = 'al-dia'

  return { vencidos, proximos, alDia, total: mantenimientos.length, masUrgente }
}
