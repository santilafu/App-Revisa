# Logos de marca

Esta carpeta guarda las imágenes de los logos de las marcas.

> ⚠️ Los logos son **marcas registradas**. Añádelos solo si tienes permiso/licencia
> para usarlos.

## Cómo añadir un logo

1. Copia aquí la imagen del logo. Recomendado: **SVG** (se ve nítido a cualquier
   tamaño) o **PNG con fondo transparente**.
2. Nómbrala con el `id` de la marca (ese id está en `src/data/marcas.ts`).
   Por ejemplo, para Seat: `seat.svg`.
3. En `src/data/marcas.ts`, en esa marca, añade la ruta en el campo `logo`:

   ```ts
   { id: 'seat', nombre: 'Seat', colorPlaceholder: '#E30613',
     logo: '/logos/seat.svg',   // ← así
     modelos: ['Ibiza', 'León', ...] },
   ```

¡Y ya está! La app mostrará la imagen en lugar del círculo con iniciales.
Si la ruta está mal o falta el archivo, vuelve automáticamente a las iniciales.
