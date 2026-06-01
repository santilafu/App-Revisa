// ─────────────────────────────────────────────────────────────────────────────
// pages/PaginaAjustes.tsx
// Ajustes de la app: copia de seguridad (exportar / importar) y activar avisos.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useState } from 'react'
import { Download, Upload, Bell, BellRing, BellOff } from 'lucide-react'
import { exportarDatos, importarDatos } from '../utils/backup'
import { permisoActual, pedirPermiso, type EstadoPermiso } from '../utils/notificaciones'
import { Pagina } from '../components/Pagina'
import { Cabecera } from '../components/Cabecera'
import { Boton } from '../components/Boton'

export default function PaginaAjustes() {
  // Mensaje de feedback (verde si va bien, rojo si hay error).
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null)
  // Archivo que el usuario quiere importar, a la espera de confirmación.
  const [archivoImportar, setArchivoImportar] = useState<File | null>(null)
  const [permiso, setPermiso] = useState<EstadoPermiso>(permisoActual())

  // Referencia al <input file> oculto, para abrirlo desde un botón normal.
  const inputArchivo = useRef<HTMLInputElement>(null)

  async function alExportar() {
    await exportarDatos()
    setMensaje({ texto: 'Copia de seguridad descargada.', error: false })
  }

  async function alConfirmarImportar() {
    if (!archivoImportar) return
    try {
      await importarDatos(archivoImportar)
      setMensaje({ texto: 'Datos importados correctamente.', error: false })
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : 'Error al importar.', error: true })
    } finally {
      setArchivoImportar(null)
      if (inputArchivo.current) inputArchivo.current.value = '' // Permite reelegir el mismo archivo.
    }
  }

  async function alActivarAvisos() {
    setPermiso(await pedirPermiso())
  }

  return (
    <Pagina className="pb-8">
      <Cabecera titulo="Ajustes" mostrarVolver />

      <div className="flex flex-col gap-6 px-5">
        {/* ── COPIA DE SEGURIDAD ─────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-superficie p-5">
          <h2 className="font-semibold text-white">Copia de seguridad</h2>
          <p className="mt-1 text-sm text-gray-400">
            Tus datos viven solo en este dispositivo. Descarga una copia para no
            perderlos o para pasarlos a otro móvil.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Boton onClick={alExportar} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <Download size={18} />
                Exportar datos
              </span>
            </Boton>

            <Boton
              variante="secundario"
              onClick={() => inputArchivo.current?.click()}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Upload size={18} />
                Importar datos
              </span>
            </Boton>

            {/* input oculto: se abre al pulsar el botón de arriba. */}
            <input
              ref={inputArchivo}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => setArchivoImportar(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Confirmación: importar REEMPLAZA los datos actuales. */}
          {archivoImportar && (
            <div className="mt-4 rounded-xl bg-estado-vencido/10 p-4">
              <p className="text-sm text-gray-300">
                Importar <span className="font-medium text-white">{archivoImportar.name}</span>{' '}
                reemplazará TODOS tus datos actuales. ¿Continuar?
              </p>
              <div className="mt-3 flex gap-3">
                <Boton
                  variante="secundario"
                  onClick={() => setArchivoImportar(null)}
                  className="flex-1"
                >
                  Cancelar
                </Boton>
                <button
                  type="button"
                  onClick={alConfirmarImportar}
                  className="flex-1 rounded-2xl bg-estado-vencido py-3 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Importar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── NOTIFICACIONES ─────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-superficie p-5">
          <h2 className="font-semibold text-white">Avisos</h2>
          <p className="mt-1 text-sm text-gray-400">
            Al abrir la app, te avisará si tienes mantenimientos vencidos. (Con la
            app cerrada no es posible sin un servidor.)
          </p>

          <div className="mt-4">
            {permiso === 'no-soportado' && (
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <BellOff size={18} /> Tu navegador no admite notificaciones.
              </p>
            )}
            {permiso === 'granted' && (
              <p className="flex items-center gap-2 text-sm text-estado-aldia">
                <BellRing size={18} /> Avisos activados.
              </p>
            )}
            {permiso === 'denied' && (
              <p className="flex items-center gap-2 text-sm text-estado-vencido">
                <BellOff size={18} /> Avisos bloqueados (cámbialo en los permisos del navegador).
              </p>
            )}
            {permiso === 'default' && (
              <Boton onClick={alActivarAvisos} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  <Bell size={18} />
                  Activar avisos
                </span>
              </Boton>
            )}
          </div>
        </section>

        {/* Mensaje de feedback. */}
        {mensaje && (
          <p
            className={`text-center text-sm ${
              mensaje.error ? 'text-estado-vencido' : 'text-estado-aldia'
            }`}
          >
            {mensaje.texto}
          </p>
        )}
      </div>
    </Pagina>
  )
}
