import { avisar, explicar } from './mensajes.ui.js';
import { destinoTrasAcceso } from '../utilidades/ficha.js';

const pagina = document.body.dataset.pagina;
const controladores = {
  'inicio': () => import('../paginas/inicio.js'),
  'producto': () => import('../paginas/producto.js'),
  'emprendimiento': () => import('../paginas/emprendimiento.js'),
  'acceso': () => import('../paginas/acceso.js'),
  'registro': () => import('../paginas/registro.js'),
  'cuenta': () => import('../paginas/cuenta.js'),
  'panel-admin': () => import('../paginas/panel-admin.js'),
  'panel-emprendedor': () => import('../paginas/panel-emprendedor.js'),
};

async function iniciar() {
  if (pagina === 'inicio' && new URLSearchParams(location.search).has('producto')) {
    location.replace('/html/producto.html' + location.search);
    return;
  }
  const { actual, cerrar } = await import('../servicios/sesion.service.js');
  const usuario = await actual();
  if (!usuario && ['cuenta', 'panel-emprendedor', 'panel-admin'].includes(pagina)) {
    location.replace('/html/acceso.html');
    return;
  }
  if (usuario && ['acceso', 'registro'].includes(pagina)) {
    location.replace(destinoTrasAcceso());
    return;
  }
  const salir = document.getElementById('salir');
  salir.hidden = !usuario;
  salir.onclick = async () => {
    try { await cerrar(); location.href = '/'; }
    catch (error) { avisar(explicar(error)); }
  };
  const controlador = await controladores[pagina]();
  await controlador.mostrar(usuario);
}

iniciar().catch(error => avisar(explicar(error)));
