import { identificar } from '../servicios/sesion.service.js';
import { el, tarea, valores } from '../ui/controles.ui.js';

export function mostrar() {
  const formulario = el('credenciales');
  const enviar = el('continuar');
  enviar.disabled = false;
  formulario.onsubmit = tarea(enviar, async () => {
    const { correo, clave } = valores(formulario);
    await identificar(correo.trim(), clave, document.body.dataset.pagina === 'registro');
    location.replace('/html/cuenta.html');
  });
}
