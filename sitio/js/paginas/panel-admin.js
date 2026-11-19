import { soyAdmin } from '../datos/usuarios.repository.js';
import { listarTiendas } from '../datos/emprendimientos.repository.js';
import { misProductos } from '../datos/productos.repository.js';
import { moderar } from '../servicios/moderacion.service.js';
import { el, nodo, avisar, boton } from '../ui/controles.ui.js';

export async function mostrar(usuario) {
  if (!(await soyAdmin(usuario.uid))) {
    avisar('Esta cuenta no tiene permiso de administración.');
    return;
  }
  el('moderacion').hidden = false;

  function decision(etiqueta, tienda, estado, productoId = null) {
    return boton(etiqueta, async () => {
      const motivo = prompt('Motivo de la decisión (hasta 250 caracteres)');
      if (motivo === null) return;
      await moderar(tienda.id, productoId, estado, motivo, usuario.uid);
      await cargar();
      avisar('Decisión guardada.');
    });
  }

  async function verProductos(tienda, lista) {
    const productos = await misProductos(tienda.id);
    lista.replaceChildren();
    if (!productos.length) lista.textContent = 'Sin productos.';
    for (const item of productos) {
      const fila = nodo('div', item.nombre + ' · ' + item.estado, 'fila');
      if (item.estado === 'publicado') fila.append(decision('Ocultar', tienda, 'oculto', item.id));
      lista.append(fila);
    }
  }

  function tarjeta(tienda) {
    const ficha = nodo('article', undefined, 'caja');
    ficha.append(nodo('h3', tienda.nombre), nodo('p', tienda.descripcion), nodo('p', tienda.localidad + ' · ' + tienda.estado));
    if (tienda.estado !== 'aprobado') ficha.append(decision('Aprobar', tienda, 'aprobado'));
    if (tienda.estado === 'pendiente') ficha.append(decision('Rechazar', tienda, 'rechazado'));
    if (tienda.estado === 'aprobado') {
      const lista = nodo('div');
      ficha.append(decision('Suspender', tienda, 'suspendido'), boton('Ver productos', () => verProductos(tienda, lista)), lista);
    }
    return ficha;
  }

  async function cargar() {
    const tiendas = await listarTiendas();
    const contenedor = el('solicitudes');
    contenedor.replaceChildren(...tiendas.map(tarjeta));
    if (!tiendas.length) contenedor.append(nodo('p', 'Todavía no hay solicitudes.'));
  }

  await cargar();
}
