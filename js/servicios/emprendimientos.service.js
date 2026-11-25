import { miTienda, editarTienda, solicitar } from '../datos/emprendimientos.repository.js';
import { productosDe } from './productos.service.js';

import { negocio } from '../validaciones/emprendimiento.validator.js';

export function guardarPerfil(uid, tienda, formulario) {
  const datos = negocio(formulario, tienda?.localidad);
  return tienda ? editarTienda(uid, datos) : solicitar(uid, datos);
}

export async function fichaPublica(uid) {
  if (!uid || uid.includes('/')) return null;
  try {
    const tienda = await miTienda(uid);
    if (tienda?.estado !== 'aprobado') return null;
    return { tienda, productos: await productosDe(tienda) };
  } catch (error) {
    if (error.code === 'permission-denied') return null;
    throw error;
  }
}
