import { fichaPublica } from './emprendimientos.service.js';
import { misFavoritos } from '../datos/favoritos.repository.js';

export async function productosFavoritos(uid) {
  const guardados = await misFavoritos(uid);
  // Consultamos cada tienda una vez aunque tenga varios productos guardados.
  const tiendas = new Map();
  for (const { tiendaId } of guardados) {
    if (!tiendas.has(tiendaId)) tiendas.set(tiendaId, fichaPublica(tiendaId));
  }
  return Promise.all(guardados.map(async favorito => {
    const ficha = await tiendas.get(favorito.tiendaId);
    const producto = ficha?.productos.find(item => item.id === favorito.productoId);
    return { favorito, producto };
  }));
}
