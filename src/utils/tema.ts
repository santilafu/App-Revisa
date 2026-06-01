// ─────────────────────────────────────────────────────────────────────────────
// utils/tema.ts
// Maneja el tema (claro u oscuro) y lo recuerda entre sesiones con localStorage.
// "Aplicar" un tema = poner o quitar la clase "tema-claro" en el <html>; el CSS
// de index.css se encarga del resto.
// ─────────────────────────────────────────────────────────────────────────────
export type Tema = 'oscuro' | 'claro'

const CLAVE = 'revisa-tema' // Nombre con el que guardamos la preferencia.

/** Lee el tema guardado (por defecto, oscuro). */
export function obtenerTema(): Tema {
  return localStorage.getItem(CLAVE) === 'claro' ? 'claro' : 'oscuro'
}

/** Aplica el tema al documento y lo guarda para la próxima vez. */
export function aplicarTema(tema: Tema): void {
  // classList.toggle(clase, true/false) añade o quita la clase según el segundo valor.
  document.documentElement.classList.toggle('tema-claro', tema === 'claro')
  localStorage.setItem(CLAVE, tema)
}
