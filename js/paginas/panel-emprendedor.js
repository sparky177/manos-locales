import { miTienda, reenviarSolicitud, tiendaRef } from '../datos/emprendimientos.repository.js';
import { ultimaRevision } from '../datos/revisiones.repository.js';
import { misProductos, retirar, nuevaReferencia, productoRef, solicitarRevision } from '../datos/productos.repository.js';
import { estadoProducto } from '../ui/productos.ui.js';
import { el, nodo, opciones, avisar, tarea, valores, boton } from '../ui/mensajes.ui.js';
import { imagenes, categorias } from '../config/catalogos.js';
import { guardarPerfil } from '../servicios/emprendimientos.service.js';
import { mostrarPerfil, mostrarRevision } from '../ui/emprendimiento.ui.js';
import { rutaImagen } from '../datos/archivos.repository.js';
import { guardarProducto } from '../servicios/productos.service.js';
import { moneda } from '../utilidades/moneda.js';
import { iniciarPanel } from '../ui/panel.ui.js';

async function mostrarInventario(uid) {
  const formulario = el('producto');
  let enEdicion = null;
  let siguienteId = nuevaReferencia(uid);

  el('gestion').hidden = false;
  opciones(el('categorias'), categorias.map(categoria => [categoria, categoria]));
  opciones(el('imagenes'), Object.entries(imagenes));

  function mostrarImagen() {
    el('muestra').src = rutaImagen(el('imagenes').value);
  }

  function prepararAlta() {
    enEdicion = null;
    siguienteId = nuevaReferencia(uid);
    formulario.reset();
    el('lista-inventario').hidden = false;
    el('editor-producto').hidden = true;
    mostrarImagen();
    el('cancelar').hidden = true;
    el('tituloProducto').textContent = 'Publicar producto';
    el('guardarProducto').textContent = 'Publicar';
  }

  function prepararEdicion(item) {
    el('editor-producto').hidden = false;
    el('lista-inventario').hidden = true;
    enEdicion = item.id;
    for (const campo of ['nombre', 'descripcion', 'categoria', 'stock', 'imagen']) {
      formulario.elements[campo].value = item[campo];
    }
    formulario.elements.precio.value = (item.precioCentavos / 100).toFixed(2);
    mostrarImagen();
    el('cancelar').hidden = false;
    el('guardarProducto').textContent = 'Guardar cambios';
    el('tituloProducto').textContent = 'Editar producto';
    formulario.elements.nombre.focus();
  }

  async function listar() {
    const inventario = el('inventario');
    const productos = await misProductos(uid);
    inventario.replaceChildren();
    if (!productos.length) inventario.append(nodo('p', 'Todavía no publicaste productos.'));
    for (const item of productos) {
      const fila = nodo('article', undefined, 'fila');
      fila.append(nodo('strong', item.nombre), nodo('p', moneda(item.precioCentavos) + ' · Stock ' + item.stock + ' · ' + estadoProducto(item.estado)));
      if (item.estado === 'oculto' || item.estado === 'pendiente_revision') {
        const revision = await ultimaRevision(productoRef(uid, item.id));
        fila.append(nodo('p', revision ? 'Motivo de administración: ' + revision.motivo : 'El motivo anterior todavía no está disponible.'));
      }
      if (item.estado === 'oculto') {
        fila.append(boton('Editar', () => prepararEdicion(item)), boton('Solicitar revisión', async () => {
          if (enEdicion === item.id) {
            avisar('Guardá o cancelá la edición antes de solicitar revisión.');
            return;
          }
          await solicitarRevision(uid, item.id);
          await listar();
          avisar('Solicitud enviada. Administración revisará este producto.');
        }));
      }
      if (item.estado === 'publicado') {
        fila.append(boton('Editar', () => prepararEdicion(item)), boton('Retirar', async () => {
          if (!confirm('¿Retirar este producto del catálogo?')) return;
          await retirar(uid, item.id);
          prepararAlta();
          await listar();
        }));
      }
      inventario.append(fila);
    }
  }

  el('imagenes').onchange = mostrarImagen;
  el('cancelar').onclick = prepararAlta;
  el('nuevo-producto').onclick = () => {
    prepararAlta();
    el('lista-inventario').hidden = true;
    el('editor-producto').hidden = false;
    el('cancelar').hidden = false;
    formulario.elements.nombre.focus();
  };
  mostrarImagen();
  formulario.onsubmit = tarea(el('guardarProducto'), async () => {
    await guardarProducto(uid, enEdicion ?? siguienteId, enEdicion !== null, valores(formulario));
    prepararAlta();
    avisar('Producto guardado.');
    await listar();
  });
  await listar();
}

export async function mostrar(usuario) {
  const tienda = await miTienda(usuario.uid);
  el('identidad').textContent = usuario.email;
  mostrarPerfil(tienda, campos => guardarPerfil(usuario.uid, tienda, campos));
  if (tienda) {
    const revision = tienda.estado === 'pendiente' ? null : await ultimaRevision(tiendaRef(usuario.uid));
    mostrarRevision(tienda, revision, () => reenviarSolicitud(usuario.uid));
  }
  const aprobado = tienda?.estado === 'aprobado';
  if (aprobado) await mostrarInventario(usuario.uid);
  iniciarPanel(aprobado ? 'productos' : 'negocio');
}
