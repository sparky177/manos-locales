import { avisar, boton, explicar, nodo } from './mensajes.ui.js';
import { claveFavorito, guardarFavorito, misFavoritos, quitarFavorito } from '../datos/favoritos.repository.js';
import { tarjeta } from './productos.ui.js';
import { productosFavoritos } from '../servicios/favoritos.service.js';

export async function prepararControlFavorito(usuario, alCambiar) {
  if (!usuario) return producto => {
    const acceso = nodo('a', 'Ingresá para guardar', 'accion secundaria control-favorito');
    acceso.href = '/html/acceso.html?' + new URLSearchParams({ tienda: producto.tienda.id, producto: producto.id, accion: 'favorito' });
    return acceso;
  };
  let guardados;
  try {
    guardados = new Set((await misFavoritos(usuario.uid)).map(f => f.id));
  } catch (error) {
    avisar('Favoritos: ' + explicar(error));
    return null;
  }
  return producto => {
    const id = claveFavorito(producto.tienda.id, producto.id);
    const control = boton('', async () => {
      if (guardados.has(id)) {
        await quitarFavorito(usuario.uid, id);
        guardados.delete(id);
      } else {
        await guardarFavorito(usuario.uid, producto.tienda.id, producto.id);
        guardados.add(id);
      }
      pintar();
      alCambiar?.();
      avisar(guardados.has(id) ? 'Producto guardado en Mis favoritos.' : 'Producto quitado de Mis favoritos.');
    });
    function pintar() {
      control.textContent = guardados.has(id) ? 'Quitar de favoritos' : 'Guardar en favoritos';
      control.setAttribute('aria-label', control.textContent + ': ' + producto.nombre);
    }
    control.className = 'secundaria control-favorito';
    pintar();
    return control;
  };
}

export async function mostrarMisFavoritos(uid, contenedor) {
  const filas = await productosFavoritos(uid);
  function pintar() {
    contenedor.replaceChildren(...filas.map(({ favorito, producto }) => {
      const ficha = producto ? tarjeta(producto) : nodo('article', 'Producto no disponible', 'caja');
      const quitar = boton('Quitar de favoritos', async () => {
        await quitarFavorito(uid, favorito.id);
        const indice = filas.findIndex(fila => fila.favorito.id === favorito.id);
        if (indice !== -1) filas.splice(indice, 1);
        pintar();
        avisar('Producto quitado de Mis favoritos.');
      });
      quitar.className = 'secundaria control-favorito';
      ficha.append(quitar);
      return ficha;
    }));
    if (!filas.length) contenedor.textContent = 'Todavía no guardaste productos en favoritos.';
  }
  pintar();
}
