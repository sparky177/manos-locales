import { el, tarea, valores } from './mensajes.ui.js';

export function mostrarPerfil(tienda, alGuardar) {
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
    await alGuardar(valores(formulario));
    location.reload();
  });
}
