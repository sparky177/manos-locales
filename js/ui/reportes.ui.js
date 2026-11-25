import { avisar, boton, nodo, opciones, tarea } from './mensajes.ui.js';
import { contenidoActual } from '../datos/reportes.repository.js';
import { motivos, cerrarReporte, enviarReporte } from '../servicios/reportes.service.js';
import { rutaFicha } from '../utilidades/ficha.js';
import { moneda } from '../utilidades/moneda.js';
import { foto } from './productos.ui.js';

export function formularioReporte(usuario, destino) {
  const seccion = nodo('details', undefined, 'caja');
  seccion.id = 'reportar';
  seccion.open = location.hash === '#reportar';
  seccion.append(nodo('summary', destino.productoId ? 'Reportar producto' : 'Reportar emprendimiento'));
  if (!usuario) {
    const ingresar = nodo('a', 'Ingresá para enviar un reporte');
    ingresar.href = '/html/acceso.html' + location.search;
    seccion.append(ingresar);
    return seccion;
  }
  const formulario = nodo('form');
  const categoria = nodo('label', 'Motivo');
  const select = nodo('select');
  select.required = true;
  opciones(select, [['', 'Elegí un motivo'], ...motivos.map(m => [m, m])]);
  categoria.append(select);
  const explicacion = nodo('label', '¿Qué problema encontraste?');
  const detalle = nodo('textarea');
  detalle.required = true;
  detalle.maxLength = 500;
  explicacion.append(detalle);
  const enviar = nodo('button', 'Enviar reporte');
  formulario.append(categoria, explicacion, enviar);
  const respuesta = nodo('p');
  respuesta.setAttribute('role', 'status');
  formulario.onsubmit = tarea(enviar, async () => {
    const caso = await enviarReporte(usuario.uid, destino, select.value, detalle.value);
    formulario.hidden = true;
    respuesta.textContent = caso.existente ? 'Ya tenés un reporte pendiente sobre esta ficha. ' : 'Reporte enviado. ';
    const enlace = nodo('a', 'Ver mi reporte');
    enlace.href = '/html/cuenta.html#reporte-' + caso.id;
    respuesta.append(enlace);
  });
  seccion.append(formulario, respuesta);
  return seccion;
}

export function tarjetaReporte(r) {
  const ficha = nodo('article', undefined, 'caja');
  ficha.id = 'reporte-' + r.id;
  const tipo = r.productoId ? 'Producto' : 'Emprendimiento';
  ficha.append(nodo('h3', tipo + ' · ' + r.nombre),
    nodo('p', r.creadoEn.toDate().toLocaleDateString('es-AR') + ' · ' + r.estado),
    nodo('strong', r.motivo), nodo('p', r.detalle));
  if (r.resultado) ficha.append(nodo('p', 'Resultado: ' + r.resultado));
  return ficha;
}

export function tarjetaAdministrativa(r, adminUid, actualizar) {
  const ficha = tarjetaReporte(r);
  const enlace = nodo('a', 'Abrir ficha pública');
  enlace.href = rutaFicha(r.tiendaId, r.productoId);
  enlace.target = '_blank';
  enlace.rel = 'noopener';
  const acciones = nodo('div');
  function resolver(etiqueta, contenido) {
    return boton(etiqueta, async () => {
      const mensaje = contenido ? 'Explicá la medida. El titular y quien reportó podrán leerla. Omití los datos de quien reportó.'
        : 'Explicá a quien reportó por qué se cierra el caso.';
      const razon = prompt(mensaje + ' (Hasta 250 caracteres)');
      if (razon === null) return;
      await cerrarReporte(r, adminUid, razon, contenido);
      await actualizar();
      avisar('Reporte cerrado.');
    });
  }
  ficha.append(enlace, boton('Revisar caso', async () => {
    const actual = await contenidoActual(r);
    acciones.replaceChildren();
    if (actual) {
      acciones.append(nodo('h4', actual.nombre), nodo('p', actual.descripcion));
      if (r.productoId) {
        const imagen = foto(actual);
        imagen.width = 96;
        acciones.append(imagen, nodo('p', actual.categoria + ' · ' + moneda(actual.precioCentavos) + ' · Stock ' + actual.stock));
      } else acciones.append(nodo('p', actual.localidad + ' · WhatsApp ' + actual.whatsapp));
    }
    if (actual?.estado === (r.productoId ? 'publicado' : 'aprobado')) {
      acciones.append(resolver(r.productoId ? 'Ocultar producto y resolver' : 'Suspender emprendimiento y resolver', actual));
    } else acciones.append(nodo('p', 'La ficha ya no está publicada.'));
    acciones.append(resolver('Descartar reporte', null));
  }), acciones);
  return ficha;
}
