import { iniciarPanel } from '../ui/panel.ui.js';
import { asegurarPerfil, soyAdmin } from '../datos/usuarios.repository.js';
import { el } from '../ui/mensajes.ui.js';
import { misReportes } from '../datos/reportes.repository.js';
import { tarjetaReporte } from '../ui/reportes.ui.js';
import { mostrarMisFavoritos } from '../ui/favoritos.ui.js';

export async function mostrar(usuario) {
  iniciarPanel('perfil');
  el('identidad').textContent = usuario.email;
  await asegurarPerfil(usuario.uid);
  el('admin').hidden = !(await soyAdmin(usuario.uid));
  await Promise.all([mostrarMisFavoritos(usuario.uid, el('mis-favoritos')), mostrarReportes(usuario.uid)]);
}

async function mostrarReportes(uid) {
  const casos = await misReportes(uid);
  el('mis-reportes').replaceChildren(...casos.map(tarjetaReporte));
  if (!casos.length) el('mis-reportes').textContent = 'Todavía no enviaste reportes.';
  if (location.hash.startsWith('#reporte-')) el(location.hash.slice(1))?.scrollIntoView();
}
