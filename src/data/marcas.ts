// ─────────────────────────────────────────────────────────────────────────────
// data/marcas.ts
// Catálogo de marcas y algunos modelos comunes en España.
//
// IMPORTANTE sobre los logos: los logos de las marcas son MARCAS REGISTRADAS.
// Por eso, de momento, NO usamos imágenes: cada marca tiene un "colorPlaceholder"
// con el que dibujaremos (en la Fase 2) un círculo de color con las INICIALES.
// Cuando consigas las imágenes reales con licencia, añadiremos aquí un campo
// "logo" con la ruta del archivo y listo.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Forma de cada marca del catálogo.
 */
export interface Marca {
  id: string                 // Identificador corto y único, ej. "seat".
  nombre: string             // Nombre visible, ej. "Seat".
  colorPlaceholder: string   // Color de fondo del círculo provisional (hex).
  modelos: string[]          // Algunos modelos populares de esa marca.
  // logo?: string           // ← (Futuro) ruta de la imagen real del logo.
}

/**
 * Lista de marcas. Está ordenada alfabéticamente para que sea fácil de leer.
 * No pretende ser exhaustiva: cubre las marcas más vistas en España.
 */
export const MARCAS: Marca[] = [
  { id: 'alfa-romeo', nombre: 'Alfa Romeo', colorPlaceholder: '#981E32', modelos: ['Giulia', 'Stelvio', 'Giulietta', 'Tonale'] },
  { id: 'audi', nombre: 'Audi', colorPlaceholder: '#BB0A30', modelos: ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5'] },
  { id: 'bmw', nombre: 'BMW', colorPlaceholder: '#0066B1', modelos: ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5'] },
  { id: 'citroen', nombre: 'Citroën', colorPlaceholder: '#DA291C', modelos: ['C1', 'C3', 'C4', 'C5 Aircross', 'Berlingo'] },
  { id: 'cupra', nombre: 'Cupra', colorPlaceholder: '#937C56', modelos: ['Formentor', 'León', 'Ateca', 'Born'] },
  { id: 'dacia', nombre: 'Dacia', colorPlaceholder: '#646B52', modelos: ['Sandero', 'Duster', 'Logan', 'Jogger', 'Spring'] },
  { id: 'ds', nombre: 'DS', colorPlaceholder: '#1B1B1B', modelos: ['DS3', 'DS4', 'DS7'] },
  { id: 'fiat', nombre: 'Fiat', colorPlaceholder: '#8E1F2F', modelos: ['500', 'Panda', 'Tipo', '500X', '500L'] },
  { id: 'ford', nombre: 'Ford', colorPlaceholder: '#1C3F94', modelos: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mondeo', 'Transit'] },
  { id: 'honda', nombre: 'Honda', colorPlaceholder: '#CC0000', modelos: ['Civic', 'Jazz', 'CR-V', 'HR-V'] },
  { id: 'hyundai', nombre: 'Hyundai', colorPlaceholder: '#002C5F', modelos: ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe'] },
  { id: 'jaguar', nombre: 'Jaguar', colorPlaceholder: '#9E1B32', modelos: ['XE', 'XF', 'F-Pace', 'E-Pace'] },
  { id: 'jeep', nombre: 'Jeep', colorPlaceholder: '#3C4A2E', modelos: ['Renegade', 'Compass', 'Wrangler', 'Cherokee'] },
  { id: 'kia', nombre: 'Kia', colorPlaceholder: '#05141F', modelos: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro', 'Stonic'] },
  { id: 'land-rover', nombre: 'Land Rover', colorPlaceholder: '#005A2B', modelos: ['Defender', 'Discovery', 'Range Rover', 'Evoque'] },
  { id: 'lexus', nombre: 'Lexus', colorPlaceholder: '#1A1A1A', modelos: ['UX', 'NX', 'RX', 'IS'] },
  { id: 'mazda', nombre: 'Mazda', colorPlaceholder: '#101010', modelos: ['Mazda2', 'Mazda3', 'CX-3', 'CX-5', 'MX-5'] },
  { id: 'mercedes-benz', nombre: 'Mercedes-Benz', colorPlaceholder: '#00A19B', modelos: ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'GLA', 'GLC'] },
  { id: 'mini', nombre: 'Mini', colorPlaceholder: '#1A1A1A', modelos: ['Cooper', 'Countryman', 'Clubman'] },
  { id: 'mitsubishi', nombre: 'Mitsubishi', colorPlaceholder: '#E60012', modelos: ['ASX', 'Outlander', 'Space Star'] },
  { id: 'nissan', nombre: 'Nissan', colorPlaceholder: '#C3002F', modelos: ['Micra', 'Qashqai', 'Juke', 'X-Trail', 'Leaf'] },
  { id: 'opel', nombre: 'Opel', colorPlaceholder: '#F7B500', modelos: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland'] },
  { id: 'peugeot', nombre: 'Peugeot', colorPlaceholder: '#0F4C81', modelos: ['208', '308', '2008', '3008', '5008', '508'] },
  { id: 'porsche', nombre: 'Porsche', colorPlaceholder: '#B12B28', modelos: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'] },
  { id: 'renault', nombre: 'Renault', colorPlaceholder: '#FFD500', modelos: ['Clio', 'Mégane', 'Captur', 'Kadjar', 'Scénic', 'Twingo'] },
  { id: 'seat', nombre: 'Seat', colorPlaceholder: '#E30613', modelos: ['Ibiza', 'León', 'Arona', 'Ateca', 'Toledo', 'Alhambra'] },
  { id: 'skoda', nombre: 'Skoda', colorPlaceholder: '#4BA82E', modelos: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'] },
  { id: 'smart', nombre: 'Smart', colorPlaceholder: '#E8A200', modelos: ['ForTwo', 'ForFour'] },
  { id: 'ssangyong', nombre: 'SsangYong', colorPlaceholder: '#003F87', modelos: ['Tivoli', 'Korando', 'Rexton'] },
  { id: 'subaru', nombre: 'Subaru', colorPlaceholder: '#013C74', modelos: ['Impreza', 'Forester', 'XV', 'Outback'] },
  { id: 'suzuki', nombre: 'Suzuki', colorPlaceholder: '#E10A1D', modelos: ['Swift', 'Vitara', 'S-Cross', 'Ignis'] },
  { id: 'tesla', nombre: 'Tesla', colorPlaceholder: '#CC0000', modelos: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { id: 'toyota', nombre: 'Toyota', colorPlaceholder: '#EB0A1E', modelos: ['Aygo', 'Yaris', 'Corolla', 'C-HR', 'RAV4', 'Hilux'] },
  { id: 'volkswagen', nombre: 'Volkswagen', colorPlaceholder: '#001E50', modelos: ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'Touran'] },
  { id: 'volvo', nombre: 'Volvo', colorPlaceholder: '#003057', modelos: ['XC40', 'XC60', 'XC90', 'V40', 'S60'] },
]
