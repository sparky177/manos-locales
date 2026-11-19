import { identificar } from '../servicios/sesion.service.js';
import { el, tarea, valores } from '../ui/mensajes.ui.js';

export function conectarFormulario(registro) {
  const formulario = el('credenciales');
  const enviar = el('continuar');
  enviar.disabled = false;
  formulario.onsubmit = tarea(enviar, async () => {
    const { correo, clave } = valores(formulario);
    await identificar(correo, clave, registro);
    location.replace('/html/cuenta.html');
  });
}

export function mostrar() {
  conectarFormulario(false);
}
