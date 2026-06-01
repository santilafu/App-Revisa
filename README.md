# 🚗 Revisa

**Recordatorios de mantenimiento de vehículos.** Registra tus coches y sus
mantenimientos (ITV, seguro, aceite, filtros, ruedas…), y la app te muestra un
semáforo de color y una cuenta atrás que te avisa cuando toca cada cosa, **por
fecha o por kilómetros**. Al completarlo, pasa al historial.

Es una **PWA** (aplicación web instalable) que funciona **100 % en local**: sin
servidor, sin registro y sin conexión. Tus datos viven en tu dispositivo.

> Proyecto de aprendizaje. Todo el código está **comentado en español** explicando
> el porqué de cada parte.

---

## ✨ Características

- 📇 **Tus vehículos** en tarjetas (marca, modelo, año, km) con buscador y orden.
- 🔧 **Mantenimientos** por fecha límite y/o kilómetros, con notas.
- 🚦 **Semáforo de estado** calculado al vuelo: verde (al día), ámbar (próximo,
  ≤ 30 días o ≤ 1.000 km) y rojo (vencido), con cuenta atrás.
- ✅ **Marcar como hecho** → pasa al **historial** (con fecha y km).
- 🔔 **Aviso al abrir** si tienes mantenimientos vencidos (notificación del navegador).
- 💾 **Copia de seguridad**: exporta e importa todos tus datos en un archivo.
- 📷 **Foto del vehículo** (se comprime y se guarda en local).
- 🌙☀️ **Tema oscuro y claro**.
- 📲 **Instalable** como app en el móvil o el escritorio.

---

## 🛠️ Stack

- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** (v4, vía PostCSS) para los estilos
- **Framer Motion** para las animaciones
- **Dexie.js** (IndexedDB) para guardar datos en local
- **React Router** para la navegación
- **lucide-react** para los iconos
- **vite-plugin-pwa** para la PWA

---

## 🚀 Puesta en marcha

Necesitas **Node.js 20+** y **pnpm**.

```bash
# 1) Instalar dependencias
pnpm install

# 2) Arrancar en modo desarrollo (abre la URL que muestre, p. ej. http://localhost:5173)
pnpm dev
```

### Otros comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente. |
| `pnpm build` | Revisa los tipos y genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve la versión de producción (para probar la PWA instalable). |
| `pnpm lint` | Revisa el código con ESLint. |
| `pnpm generate-pwa-assets` | Regenera los iconos de la PWA desde `public/icono.svg`. |

---

## 📁 Estructura del proyecto

```
src/
├── components/   Piezas reutilizables (tarjetas, botones, cabecera, modal…)
├── pages/        Pantallas (Inicio, formulario de vehículo, detalle, historial, ajustes)
├── db/           database.ts → la base de datos local (Dexie)
├── data/         marcas.ts y tiposMantenimiento.ts (catálogos)
├── utils/        Lógica auxiliar (fechas, estado, copia de seguridad, imagen, tema…)
├── types/        Tipos de TypeScript (el "molde" de los datos)
├── App.tsx       Router: qué pantalla mostrar según la URL
└── main.tsx      Punto de entrada
```

---

## 🗃️ Modelo de datos (Dexie)

- **Vehiculo**: `marca`, `modelo`, `anio`, `matricula?`, `kmActuales`, `foto?`, `fechaCreacion`
- **Mantenimiento**: `vehiculoId`, `tipo`, `fechaLimite?`, `kmLimite?`, `notas?`, `estado`, `fechaCreacion`
- **HistorialMantenimiento**: `mantenimientoId`, `vehiculoId`, `tipo`, `fechaRealizado`, `kmRealizado`, `notas?`

---

## 🏷️ Logos de marca

Por defecto cada marca se muestra con un círculo de color y sus iniciales, porque
los logos son **marcas registradas**. Para usar imágenes reales (con su licencia):

1. Pon la imagen en `public/logos/` con el `id` de la marca (ej. `seat.svg`).
2. En `src/data/marcas.ts`, añade `logo: '/logos/seat.svg'` a esa marca.

Si la imagen falta o falla, la app vuelve sola al círculo con iniciales.

---

## 💾 Copia de seguridad

Desde **Ajustes** (⚙️ en Inicio) puedes **exportar** todos tus datos a un archivo
`.json` e **importarlos** después (reemplaza los datos actuales). Útil como
respaldo o para pasar tus datos a otro dispositivo.

---

## 📦 Estado del proyecto

Aplicación completa y funcional. Se construyó por fases: estructura → inicio y
alta de vehículos → mantenimientos, semáforo e historial → edición/borrado,
transiciones e icono → avisos, copia de seguridad, notificaciones y fotos →
logos, buscador/orden y tema claro → documentación y calidad.

---

## 📄 Licencia y aviso

Código de uso personal y educativo. Los **logos y nombres de marcas** pertenecen a
sus respectivos propietarios; no se incluyen imágenes de logos en este repositorio.
