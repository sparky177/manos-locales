import { fichaPublica } from '../servicios/emprendimientos.service.js';
import { el } from '../ui/mensajes.ui.js';
import { tarjeta } from '../ui/productos.ui.js';

export async function mostrar() {
  const ficha = await fichaPublica(new URLSearchParams(location.search).get('tienda'));
  if (!ficha) {
    el('aviso').textContent = 'Este emprendimiento no está disponible.';
    return;
  }
  document.title = ficha.tienda.nombre + ' · Manos Locales';
  el('nombre').textContent = ficha.tienda.nombre;
  el('localidad').textContent = ficha.tienda.localidad;
  el('descripcion').textContent = ficha.tienda.descripcion;
  el('tienda').hidden = false;
  el('productos').replaceChildren(...ficha.productos.map(tarjeta));
  el('vacio').hidden = ficha.productos.length > 0;
}
