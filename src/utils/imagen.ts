// ─────────────────────────────────────────────────────────────────────────────
// utils/imagen.ts
// Convierte la foto que elige el usuario en un texto "data URL" (base64) ya
// COMPRIMIDO y reescalado, para no guardar imágenes enormes en la base de datos.
// Técnica: cargamos la imagen, la dibujamos en un <canvas> más pequeño y la
// exportamos como JPEG con calidad reducida.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param archivo  La imagen elegida por el usuario.
 * @param maxLado  Tamaño máximo (en px) del lado más largo. Por defecto 800.
 * @param calidad  Calidad del JPEG, de 0 a 1. Por defecto 0,7 (buen equilibrio).
 * @returns        Una promesa con la imagen como texto "data URL".
 */
export function comprimirImagen(archivo: File, maxLado = 800, calidad = 0.7): Promise<string> {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader()

    lector.onload = () => {
      const img = new Image()

      img.onload = () => {
        // Calculamos el nuevo tamaño manteniendo la proporción (sin deformar).
        let { width, height } = img
        if (width >= height && width > maxLado) {
          height = Math.round((height * maxLado) / width)
          width = maxLado
        } else if (height > maxLado) {
          width = Math.round((width * maxLado) / height)
          height = maxLado
        }

        // Dibujamos la imagen reducida en un lienzo (canvas) invisible.
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          rechazar(new Error('No se pudo procesar la imagen.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        // Exportamos a JPEG comprimido como texto data URL.
        resolver(canvas.toDataURL('image/jpeg', calidad))
      }

      img.onerror = () => rechazar(new Error('La imagen no se pudo cargar.'))
      img.src = lector.result as string
    }

    lector.onerror = () => rechazar(new Error('No se pudo leer el archivo.'))
    lector.readAsDataURL(archivo)
  })
}
