import { miTienda } from '../datos/emprendimientos.repository.js';
import { productosDe } from './catalogo.service.js';

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
