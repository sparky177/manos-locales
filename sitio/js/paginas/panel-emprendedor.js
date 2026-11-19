import { miTienda, solicitar, editarTienda } from '../datos/emprendimientos.repository.js';
import { misProductos, publicar, editar, retirar, nuevaReferencia } from '../datos/productos.repository.js';
import { el, nodo, opciones, avisar, tarea, valores, boton } from '../ui/controles.ui.js';
import { imagenes, categorias, rutaImagen } from '../config/catalogos.js';
import { negocio } from '../validaciones/emprendimiento.validator.js';
import { producto } from '../validaciones/producto.validator.js';
import { moneda } from '../utilidades/moneda.js';

function mostrarPerfil(uid, tienda) {
  const formulario = el('negocio');
  el('perfil').hidden = false;
  el('estado').textContent = tienda ? 'Estado del emprendimiento: ' + tienda.estado : 'Solicitá el alta de tu emprendimiento.';
  if (tienda) {
    for (const campo of ['nombre', 'descripcion', 'whatsapp', 'localidad']) {
      formulario.elements[campo].value = tienda[campo];
    }
    el('guardarPerfil').textContent = 'Guardar cambios';
  }
  formulario.onsubmit = tarea(el('guardarPerfil'), async () => {
    const datos = negocio(valores(formulario));
    if (tienda) await editarTienda(uid, datos);
    else await solicitar(uid, datos);
    location.reload();
  });
}

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
    mostrarImagen();
    el('cancelar').hidden = true;
    el('tituloProducto').textContent = 'Publicar producto';
    el('guardarProducto').textContent = 'Publicar';
  }

  function prepararEdicion(item) {
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
      fila.append(nodo('strong', item.nombre), nodo('p', moneda(item.precioCentavos) + ' · Stock ' + item.stock + ' · ' + item.estado));
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
  mostrarImagen();
  formulario.onsubmit = tarea(el('guardarProducto'), async () => {
    const datos = producto(valores(formulario));
    if (enEdicion) await editar(uid, enEdicion, datos);
    else await publicar(uid, siguienteId, datos);
    prepararAlta();
    avisar('Producto guardado.');
    await listar();
  });
  await listar();
}

export async function mostrar(usuario) {
  const tienda = await miTienda(usuario.uid);
  el('identidad').textContent = usuario.email;
  mostrarPerfil(usuario.uid, tienda);
  if (tienda?.estado === 'aprobado') await mostrarInventario(usuario.uid);
}
