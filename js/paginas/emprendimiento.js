import { fichaPublica } from '../servicios/emprendimientos.service.js';
import { el } from '../ui/mensajes.ui.js';
import { tarjeta } from '../ui/productos.ui.js';
import { contactoNegocio } from '../utilidades/whatsapp.js';

import { formularioReporte } from '../ui/reportes.ui.js';
import { prepararControlFavorito } from '../ui/favoritos.ui.js';

export async function mostrar(usuario) {
  const ficha = await fichaPublica(new URLSearchParams(location.search).get('tienda'));
  if (!ficha) {
    el('aviso').textContent = 'Este emprendimiento no está disponible.';
    return;
  }
  document.title = ficha.tienda.nombre + ' · Manos Locales';
  el('nombre').textContent = ficha.tienda.nombre;
  el('localidad').textContent = ficha.tienda.localidad;
  el('descripcion').textContent = ficha.tienda.descripcion;
  el('contactar').href = contactoNegocio(ficha.tienda);
  el('tienda').hidden = false;
  el('contactar').after(formularioReporte(usuario, { tiendaId: ficha.tienda.id, productoId: '', nombre: ficha.tienda.nombre }));
  el('productos').replaceChildren(...ficha.productos.map(item => tarjeta(item)));
  el('vacio').hidden = ficha.productos.length > 0;
  if (ficha.productos.length) {
    const controlFavorito = await prepararControlFavorito(usuario);
    el('productos').replaceChildren(...ficha.productos.map(item => tarjeta(item, controlFavorito)));
  }
}
