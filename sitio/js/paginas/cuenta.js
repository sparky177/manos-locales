import { asegurarPerfil, soyAdmin } from '../datos/usuarios.repository.js';
import { el } from '../ui/controles.ui.js';

export async function mostrar(usuario) {
  el('identidad').textContent = usuario.email;
  await asegurarPerfil(usuario.uid);
  el('admin').hidden = !(await soyAdmin(usuario.uid));
}
