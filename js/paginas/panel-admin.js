import { tarjetaAdmin } from '../ui/admin.ui.js';
import { soyAdmin } from '../datos/usuarios.repository.js';
import { listarTiendas } from '../datos/emprendimientos.repository.js';
import { misProductos } from '../datos/productos.repository.js';
import { moderar } from '../servicios/moderacion.service.js';
import { el, nodo, avisar, boton } from '../ui/mensajes.ui.js';

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

  async function cargar() {
    const tiendas = await listarTiendas();
    const contenedor = el('solicitudes');
    contenedor.replaceChildren(...tiendas.map(tienda => tarjetaAdmin(tienda, decision, verProductos)));
    if (!tiendas.length) contenedor.append(nodo('p', 'Todavía no hay solicitudes.'));
  }

  await cargar();
}
