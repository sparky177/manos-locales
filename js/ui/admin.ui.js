import { nodo, boton } from './mensajes.ui.js';

export function tarjetaAdmin(tienda, decision, verProductos) {
  const ficha = nodo('article', undefined, 'caja');
  ficha.append(nodo('h3', tienda.nombre), nodo('p', tienda.descripcion), nodo('p', tienda.localidad + ' · ' + tienda.estado));
  ficha.append(nodo('p', 'WhatsApp comercial: ' + tienda.whatsapp));
  if (tienda.estado !== 'aprobado') ficha.append(decision('Aprobar', tienda, 'aprobado'));
  if (tienda.estado === 'pendiente') ficha.append(decision('Rechazar', tienda, 'rechazado'));
  if (tienda.estado === 'aprobado') {
    const lista = nodo('div');
    ficha.append(decision('Suspender', tienda, 'suspendido'), boton('Ver productos', () => verProductos(tienda, lista)), lista);
  }
  return ficha;
}
