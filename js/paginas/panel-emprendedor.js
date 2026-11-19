import { miTienda } from '../datos/emprendimientos.repository.js';
import { misProductos, retirar, nuevaReferencia } from '../datos/productos.repository.js';
import { el, nodo, opciones, avisar, tarea, valores, boton } from '../ui/mensajes.ui.js';
import { imagenes, categorias } from '../config/catalogos.js';
import { guardarPerfil } from '../servicios/emprendimientos.service.js';
import { mostrarPerfil } from '../ui/emprendimiento.ui.js';
import { rutaImagen } from '../datos/archivos.repository.js';
import { guardarProducto } from '../servicios/productos.service.js';
import { moneda } from '../utilidades/moneda.js';

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
  if (tienda?.estado === 'aprobado') await mostrarInventario(usuario.uid);
}
