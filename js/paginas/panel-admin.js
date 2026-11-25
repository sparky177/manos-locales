import { tarjetaAdmin } from '../ui/admin.ui.js';
import { soyAdmin } from '../datos/usuarios.repository.js';
import { listarTiendas, tiendaRef } from '../datos/emprendimientos.repository.js';
import { ultimaRevision } from '../datos/revisiones.repository.js';
import { misProductos, productoRef } from '../datos/productos.repository.js';
import { estadoProducto, foto } from '../ui/productos.ui.js';
import { moneda } from '../utilidades/moneda.js';
import { buscarRevisionAnterior, compartirRevisionAnterior, moderar } from '../servicios/moderacion.service.js';
import { el, nodo, avisar, boton } from '../ui/mensajes.ui.js';
import { reportesPendientes } from '../datos/reportes.repository.js';
import { tarjetaAdministrativa } from '../ui/reportes.ui.js';
import { iniciarPanel } from '../ui/panel.ui.js';

export async function mostrar(usuario) {
  if (!(await soyAdmin(usuario.uid))) {
    avisar('Esta cuenta no tiene permiso de administración.');
    return;
  }
  el('moderacion').hidden = false;
  iniciarPanel('solicitudes');

  function decision(etiqueta, revisado, estado, referencia = tiendaRef(revisado.id), actualizar = cargar) {
    return boton(etiqueta, async () => {
      const motivo = prompt('Explicale el motivo al titular del emprendimiento (hasta 250 caracteres).');
      if (motivo === null) return;
      await moderar(referencia, revisado, estado, motivo, usuario.uid);
      await actualizar();
      avisar('Decisión guardada.');
    });
  }

  function recuperar(referencia, estado, actualizar) {
    return boton('Recuperar motivo anterior', async () => {
      const revision = await buscarRevisionAnterior(referencia, estado);
      if (!confirm('¿Compartir este motivo con el titular?\n\n' + revision.motivo)) return;
      await compartirRevisionAnterior(referencia, revision);
      await actualizar();
      avisar('El motivo ya está disponible para el titular.');
    });
  }

  async function verProductos(tienda, lista) {
    const productos = await misProductos(tienda.id);
    lista.replaceChildren();
    if (!productos.length) lista.textContent = 'Sin productos.';
    for (const item of productos) {
      const ref = productoRef(tienda.id, item.id);
      const actualizar = () => verProductos(tienda, lista);
      const fila = nodo('article', undefined, 'fila');
      fila.append(nodo('strong', item.nombre + ' · ' + estadoProducto(item.estado)), nodo('p', item.descripcion),
        nodo('p', item.categoria + ' · ' + moneda(item.precioCentavos) + ' · Stock ' + item.stock));
      const imagen = foto(item);
      imagen.width = 96;
      fila.append(imagen);
      if (item.estado === 'publicado') fila.append(decision('Ocultar', item, 'oculto', ref, actualizar));
      if (['oculto', 'pendiente_revision'].includes(item.estado)) {
        const revision = await ultimaRevision(ref);
        if (revision) fila.append(nodo('p', 'Último motivo: ' + revision.motivo));
        else if (item.estado === 'oculto') fila.append(recuperar(ref, item.estado, actualizar));
      }
      if (item.estado === 'pendiente_revision') {
        fila.append(decision('Volver a publicar', item, 'publicado', ref, actualizar),
          decision('Mantener oculto', item, 'oculto', ref, actualizar));
      }
      lista.append(fila);
    }
  }

  async function cargar() {
    const tiendas = await listarTiendas();
    const contenedor = el('solicitudes');
    const fichas = await Promise.all(tiendas.map(async tienda => {
      const ficha = tarjetaAdmin(tienda, decision, verProductos);
      const ref = tiendaRef(tienda.id);
      if (['rechazado', 'suspendido'].includes(tienda.estado) && !(await ultimaRevision(ref))) {
        ficha.append(recuperar(ref, tienda.estado, cargar));
      }
      return ficha;
    }));
    const pendientes = fichas.filter((_, i) => tiendas[i].estado === 'pendiente');
    el('pendientes').replaceChildren(...pendientes);
    if (!pendientes.length) el('pendientes').textContent = 'No hay solicitudes pendientes.';
    function filtrar() {
      const texto = el('buscar-tienda').value.trim().toLocaleLowerCase('es-AR');
      const visibles = fichas.filter((_, i) => tiendas[i].estado !== 'pendiente'
        && tiendas[i].nombre.toLocaleLowerCase('es-AR').includes(texto));
      contenedor.replaceChildren(...visibles);
      if (!visibles.length) contenedor.textContent = 'No hay emprendimientos para mostrar.';
    }
    el('buscar-tienda').oninput = filtrar;
    filtrar();
  }

  async function cargarPanel() {
    await cargar();
    const pendientes = await reportesPendientes();
    el('reportes').replaceChildren(...pendientes.map(r => tarjetaAdministrativa(r, usuario.uid, cargarPanel)));
    if (!pendientes.length) el('reportes').textContent = 'No hay reportes pendientes.';
  }
  await cargarPanel();
}
