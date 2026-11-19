import { aprobadas } from '../datos/emprendimientos.repository.js';
import { publicados, publicar, editar } from '../datos/productos.repository.js';

import { producto } from '../validaciones/producto.validator.js';

export function guardarProducto(uid, id, esEdicion, formulario) {
  const datos = producto(formulario);
  return esEdicion ? editar(uid, id, datos) : publicar(uid, id, datos);
}

export async function productosDe(tienda) {
  const productos = await publicados(tienda.id);
  return productos.map(producto => ({ ...producto, tienda }));
}

export async function catalogo() {
  const tiendas = await aprobadas();
  const grupos = await Promise.all(tiendas.map(productosDe));
  return grupos.flat().sort((a, b) => (b.creadoEn?.toMillis() || 0) - (a.creadoEn?.toMillis() || 0));
}
