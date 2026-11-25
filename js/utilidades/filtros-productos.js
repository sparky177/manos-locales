import { coincideLocalidad, normalizar } from '../config/catalogos.js';

export function limiteEnCentavos(entrada) {
  const importe = entrada.trim();
  if (!importe) return null;
  const conMiles = /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(importe);
  if (!conMiles && !/^\d+(?:[.,]\d{1,2})?$/.test(importe)) return NaN;
  const decimal = conMiles ? importe.replaceAll('.', '') : importe;
  const [pesos, fraccion = ''] = decimal.split(/[.,]/);
  const centavos = Number(pesos + fraccion.padEnd(2, '0'));
  return Number.isSafeInteger(centavos) ? centavos : NaN;
}

export function filtrarProductos(lista, { texto = '', categoria = '', localidad = '', hastaCentavos = null }) {
  const busqueda = normalizar(texto);
  return lista.filter(p =>
    (!categoria || p.categoria === categoria) &&
    coincideLocalidad(p.tienda.localidad, localidad) &&
    (hastaCentavos === null || p.precioCentavos <= hastaCentavos) &&
    normalizar(p.nombre + ' ' + p.tienda.nombre).includes(busqueda));
}

export function ordenarProductos(lista, orden = 'recientes') {
  return [...lista].sort((a, b) => {
    if (a.precioCentavos !== b.precioCentavos) {
      if (orden === 'menor') return a.precioCentavos - b.precioCentavos;
      if (orden === 'mayor') return b.precioCentavos - a.precioCentavos;
    }
    return (b.creadoEn?.toMillis() ?? 0) - (a.creadoEn?.toMillis() ?? 0);
  });
}
