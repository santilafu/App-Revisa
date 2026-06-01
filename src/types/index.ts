// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Aquí definimos las "formas" de nuestros datos con TypeScript.
// Un "type" o "interface" es como un molde: describe qué campos tiene un objeto
// y de qué tipo es cada uno. Así, si te equivocas (ej. pones texto donde va un
// número), el editor te avisa al instante. Es nuestra red de seguridad.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Estado visual de un mantenimiento. Es un "tipo unión": solo puede valer
 * exactamente uno de estos tres textos. Cada uno tendrá un color asociado:
 *  - 'al-dia'   → verde   (todavía falta bastante)
 *  - 'proximo'  → ámbar   (se acerca la fecha/los km)
 *  - 'vencido'  → rojo    (ya tocaba)
 */
export type EstadoMantenimiento = 'al-dia' | 'proximo' | 'vencido'

/**
 * Un vehículo del usuario.
 * El "id" lleva "?" (es opcional) porque cuando creas el vehículo todavía no
 * existe: lo genera Dexie automáticamente al guardarlo en la base de datos.
 */
export interface Vehiculo {
  id?: number
  marca: string          // Ej. "Seat" (coincide con el "nombre" de data/marcas.ts).
  modelo: string         // Ej. "Ibiza".
  anio: number           // Año del coche, ej. 2018.
  matricula?: string     // Opcional: el usuario puede dejarla en blanco.
  kmActuales: number     // Kilómetros actuales del cuentakilómetros.
  // Guardamos las fechas como texto en formato ISO (ej. "2026-06-01T10:00:00.000Z").
  // Para un principiante es más sencillo de almacenar, leer y depurar que un objeto Date.
  fechaCreacion: string
}

/**
 * Un mantenimiento pendiente de un vehículo (ITV, aceite, seguro...).
 * Puede vencer por FECHA, por KILÓMETROS, o por ambas cosas: por eso los dos
 * límites son opcionales (al menos uno de los dos debería existir).
 */
export interface Mantenimiento {
  id?: number
  vehiculoId: number          // A qué vehículo pertenece (su "id").
  tipo: string                // Ej. "Cambio de aceite", "ITV", "Seguro".
  fechaLimite?: string        // Fecha tope (texto ISO). Opcional.
  kmLimite?: number           // Kilómetros tope. Opcional.
  notas?: string              // Notas libres del usuario. Opcional.
  estado: EstadoMantenimiento // al-dia / proximo / vencido.
  fechaCreacion: string
}

/**
 * Registro en el HISTORIAL: cuando marcas un mantenimiento como "hecho",
 * guardamos aquí cuándo y con cuántos km lo hiciste. Así queda el archivo
 * de todo lo que has cumplido.
 */
export interface HistorialMantenimiento {
  id?: number
  mantenimientoId: number  // Qué mantenimiento se completó.
  vehiculoId: number       // De qué vehículo (para consultarlo fácil).
  fechaRealizado: string   // Cuándo se hizo (texto ISO).
  kmRealizado: number      // Con cuántos km se hizo.
  notas?: string           // Notas opcionales (ej. "Cambiado en el taller X").
}
