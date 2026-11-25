export const categorias = ['Alimentos','Artesanías','Textil','Bienestar'];
export const imagenes = {alfajores:'Alfajores',brownie:'Brownie',cookies:'Cookies',lemon:'Lemon pie',trufas:'Trufas',budin:'Budín',general:'Manos Locales'};

export const normalizar = s => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export const localidades = [
  '28 de Noviembre', 'Bajo Caracoles', 'Caleta Olivia', 'Cañadón Seco', 'Comandante Luis Piedra Buena',
  'El Calafate', 'El Chaltén', 'El Turbio', 'Fitz Roy', 'Gobernador Gregores', 'Jaramillo',
  'Julia Dufour', 'Koluel Kaike', 'Lago Posadas', 'Las Heras', 'Los Antiguos', 'Mina 3',
  'Perito Moreno', 'Pico Truncado', 'Puerto Deseado', 'Puerto San Julián', 'Puerto Santa Cruz',
  'Río Gallegos', 'Río Turbio', 'Rospentek', 'Tellier', 'Tres Lagos'
];

const nombres = new Map(localidades.map(nombre => [normalizar(nombre), nombre]));
for (const [variante, nombre] of [
  ['Veintiocho de Noviembre', '28 de Noviembre'], ['Piedrabuena', 'Comandante Luis Piedra Buena'],
  ['Piedra Buena', 'Comandante Luis Piedra Buena'], ['Comandante Luis Piedrabuena', 'Comandante Luis Piedra Buena'],
  ['Koluel Kayke', 'Koluel Kaike'], ['Hipólito Yrigoyen', 'Lago Posadas'],
  ['Yacimientos Río Turbio', 'Río Turbio'], ['El Turbio (Est. Gobernador Mayer)', 'El Turbio']
]) nombres.set(normalizar(variante), nombre);

export function nombreLocalidad(valor = '') {
  const limpio = valor.trim().replace(/\s+/g, ' ');
  return nombres.get(normalizar(limpio)) ?? limpio;
}

export function opcionesLocalidad(anteriores = []) {
  const opciones = new Map(localidades.map(nombre => [normalizar(nombre), nombre]));
  for (const valor of anteriores) {
    const nombre = nombreLocalidad(valor);
    const clave = normalizar(nombre);
    if (nombre && !opciones.has(clave)) opciones.set(clave, nombre);
  }
  return [...opciones.values()].sort((a, b) => a.localeCompare(b, 'es-AR'));
}

export function coincideLocalidad(guardada, seleccionada) {
  return !seleccionada || normalizar(nombreLocalidad(guardada)) === normalizar(nombreLocalidad(seleccionada));
}

export function filtrarNegocios(tiendas, texto, localidad) {
  const consulta = normalizar(texto);
  return tiendas.filter(tienda => normalizar(tienda.nombre).includes(consulta)
    && coincideLocalidad(tienda.localidad, localidad));
}
