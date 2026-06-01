// ─────────────────────────────────────────────────────────────────────────────
// utils/notificaciones.ts
// Envoltorio sencillo sobre la API de Notificaciones del navegador.
//
// LIMITACIÓN IMPORTANTE: sin un servidor (backend) que envíe "push", una web no
// puede mostrar avisos de forma fiable cuando está CERRADA. Aquí solo mostramos
// una notificación cuando la app está abierta (al entrar y detectar vencidos).
// ─────────────────────────────────────────────────────────────────────────────

// El tipo NotificationPermission es 'default' | 'granted' | 'denied'. Añadimos
// 'no-soportado' para navegadores antiguos que no tienen notificaciones.
export type EstadoPermiso = NotificationPermission | 'no-soportado'

/** ¿El navegador soporta notificaciones? */
export function notificacionesSoportadas(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

/** Devuelve el estado actual del permiso. */
export function permisoActual(): EstadoPermiso {
  if (!notificacionesSoportadas()) return 'no-soportado'
  return Notification.permission
}

/** Pide permiso al usuario (debe llamarse tras un clic suyo). */
export async function pedirPermiso(): Promise<EstadoPermiso> {
  if (!notificacionesSoportadas()) return 'no-soportado'
  return Notification.requestPermission()
}

/** Muestra una notificación, solo si tenemos permiso concedido. */
export function mostrarAviso(titulo: string, cuerpo: string): void {
  if (!notificacionesSoportadas() || Notification.permission !== 'granted') return
  new Notification(titulo, { body: cuerpo, icon: '/pwa-192x192.png' })
}
