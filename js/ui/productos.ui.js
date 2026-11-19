import { nodo } from './mensajes.ui.js';
import { moneda } from '../utilidades/moneda.js';
import { rutaImagen } from '../datos/archivos.repository.js';

export function enlace(texto, ruta, parametros, clase) {
  const link = nodo('a', texto, clase);
  const consulta = new URLSearchParams(parametros).toString();
  link.href = ruta + (consulta ? '?' + consulta : '');
  return link;
}

export function foto(producto) {
  const imagen = nodo('img');
  imagen.src = rutaImagen(producto.imagen);
  imagen.alt = producto.nombre;
  return imagen;
}

export function tarjeta(producto) {
  const articulo = nodo('article', undefined, 'tarjeta');
  const ficha = enlace(producto.nombre, '/html/producto.html', {
    tienda: producto.tienda.id, producto: producto.id
  });
  const titulo = nodo('h3');
  titulo.append(ficha);
  const cuerpo = nodo('div', undefined, 'tarjeta-cuerpo');
  cuerpo.append(nodo('small', producto.categoria), titulo, nodo('strong', moneda(producto.precioCentavos)),
    nodo('p', producto.tienda.nombre + ' · ' + producto.tienda.localidad));
  articulo.append(foto(producto), cuerpo);
  return articulo;
}
