import { avisar, explicar } from './ui/controles.ui.js';

const pagina = document.body.dataset.pagina;
const destinos = {
  inicio: 'inicio', producto: 'producto', emprendimiento: 'emprendimiento',
  acceso: 'acceso', registro: 'acceso', cuenta: 'cuenta',
  'panel-admin': 'panel-admin', 'panel-emprendedor': 'panel-emprendedor'
};

async function iniciar() {
  if (pagina === 'inicio' && new URLSearchParams(location.search).has('producto')) {
    location.replace('/html/producto.html' + location.search);
    return;
  }
  const { actual, cerrar } = await import('./servicios/sesion.service.js');
  const usuario = await actual();
  if (!usuario && ['cuenta', 'panel-emprendedor', 'panel-admin'].includes(pagina)) {
    location.replace('/html/acceso.html');
    return;
  }
  if (usuario && ['acceso', 'registro'].includes(pagina)) {
    location.replace('/html/cuenta.html');
    return;
  }
  const salir = document.getElementById('salir');
  salir.hidden = !usuario;
  salir.onclick = async () => {
    try { await cerrar(); location.href = '/'; }
    catch (error) { avisar(explicar(error)); }
  };
  const controlador = await import('./paginas/' + destinos[pagina] + '.js');
  await controlador.mostrar(usuario);
}

iniciar().catch(error => avisar(explicar(error)));
