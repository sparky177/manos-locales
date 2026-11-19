import { fichaPublica } from '../servicios/ficha.service.js';
import { moneda } from '../utilidades/moneda.js';
import { enlaceContacto } from '../utilidades/whatsapp.js';
import { el, nodo } from '../ui/controles.ui.js';
import { enlace, foto } from '../ui/productos.ui.js';

export async function mostrar() {
  const params = new URLSearchParams(location.search);
  const ficha = await fichaPublica(params.get('tienda'));
  const producto = ficha?.productos.find(p => p.id === params.get('producto'));
  const detalle = el('detalle');
  if (!producto) {
    detalle.textContent = 'Esta publicación ya no está disponible.';
    return;
  }
  document.title = producto.nombre + ' · Manos Locales';
  const informacion = nodo('div', undefined, 'detalle-info');
  const contacto = nodo('a', 'Contactar por WhatsApp', 'accion');
  contacto.href = enlaceContacto(producto);
  contacto.target = '_blank';
  contacto.rel = 'noopener noreferrer';
  informacion.append(nodo('small', producto.categoria), nodo('h1', producto.nombre),
    nodo('strong', moneda(producto.precioCentavos), 'precio'), nodo('p', producto.descripcion),
    nodo('p', producto.stock ? 'Stock disponible · ' + producto.stock : 'Sin stock'),
    enlace(producto.tienda.nombre + ' · ' + producto.tienda.localidad, '/html/emprendimiento.html', {tienda: producto.tienda.id}),
    contacto);
  detalle.replaceChildren(foto(producto), informacion);
}
