import { avisar, el, nodo, opciones, tarea, valores } from './mensajes.ui.js';
import { opcionesLocalidad } from '../config/catalogos.js';
import { enlace } from './productos.ui.js';

export function tarjetaNegocio(tienda) {
  const tarjeta = nodo('article', undefined, 'tarjeta tarjeta-cuerpo');
  const titulo = nodo('h3');
  titulo.append(enlace(tienda.nombre, '/html/emprendimiento.html', { tienda: tienda.id }));
  tarjeta.append(nodo('small', tienda.localidad), titulo, nodo('p', tienda.descripcion));
  return tarjeta;
}

export function mostrarPerfil(tienda, alGuardar) {
  const formulario = el('negocio');
  el('perfil').hidden = false;
  el('estado').textContent = tienda ? 'Estado del emprendimiento: ' + tienda.estado : 'Solicitá el alta de tu emprendimiento.';
  const localidad = tienda?.localidad ?? '';
  opciones(formulario.elements.localidad, opcionesLocalidad([localidad]).map(nombre => [nombre, nombre]));
  formulario.elements.localidad.value = localidad;
  if (tienda) {
    for (const campo of ['nombre', 'descripcion', 'whatsapp']) {
      formulario.elements[campo].value = tienda[campo];
    }
    el('guardarPerfil').textContent = 'Guardar cambios';
  }
  formulario.onsubmit = tarea(el('guardarPerfil'), async () => {
    await alGuardar(valores(formulario));
    location.reload();
  });
}

export function mostrarRevision(tienda, revision, alReenviar) {
  const mensaje = el('dictamen');
  mensaje.hidden = false;
  if (tienda.estado === 'pendiente') {
    mensaje.textContent = 'Tu solicitud está pendiente de revisión por administración.';
    return;
  }
  const indicaciones = {
    aprobado: '',
    rechazado: 'Revisá los datos, guardá las correcciones y volvé a enviar la solicitud.',
    suspendido: 'Administración debe revisar la suspensión para reactivar el emprendimiento.'
  };
  const partes = [];
  if (revision?.estado === tienda.estado) {
    const fecha = revision.fecha.toDate().toLocaleDateString('es-AR');
    partes.push('Decisión del ' + fecha + ': ' + revision.motivo);
  } else if (tienda.estado === 'rechazado' || tienda.estado === 'suspendido') {
    partes.push('El motivo de esta decisión anterior todavía no está disponible en tu panel.');
  }
  if (indicaciones[tienda.estado]) partes.push(indicaciones[tienda.estado]);
  mensaje.textContent = partes.join(' ');
  mensaje.hidden = !partes.length;
  if (tienda.estado !== 'rechazado') return;

  const reenviar = el('reenviar');
  reenviar.hidden = false;
  reenviar.onclick = tarea(reenviar, async () => {
    const campos = valores(el('negocio'));
    if (Object.entries(campos).some(([campo, valor]) => valor !== tienda[campo])) {
      avisar('Guardá los cambios del formulario antes de reenviar.');
      return;
    }
    await alReenviar();
    location.reload();
  });
}
