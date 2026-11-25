import { identificar } from '../servicios/sesion.service.js';
import { el, tarea, valores } from '../ui/mensajes.ui.js';
import { destinoTrasAcceso } from '../utilidades/ficha.js';

export function conectarFormulario(registro) {
  const formulario = el('credenciales');
  const enviar = el('continuar');
  const alternativa = el('alternar-acceso');
  alternativa.search = location.search;
  enviar.disabled = false;
  formulario.onsubmit = tarea(enviar, async () => {
    const { correo, clave } = valores(formulario);
    await identificar(correo, clave, registro);
    location.replace(destinoTrasAcceso());
  });
}

export function mostrar() {
  conectarFormulario(false);
}
