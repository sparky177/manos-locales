export function iniciarPanel(inicial) {
  const panel = document.querySelector('.panel-lateral');
  const secciones = [...panel.querySelectorAll(':scope > [data-seccion]')].filter(s => !s.hidden);
  const nav = document.createElement('nav');
  nav.className = 'menu-panel';
  nav.id = 'secciones-panel';
  nav.setAttribute('aria-label', 'Secciones del panel');
  const menu = document.createElement('button');
  menu.className = 'movil';
  menu.textContent = '☰ Menú';
  menu.setAttribute('aria-controls', nav.id);
  function abrir(abierto) {
    nav.classList.toggle('abierto', abierto);
    menu.setAttribute('aria-expanded', String(abierto));
  }
  menu.onclick = () => abrir(!nav.classList.contains('abierto'));
  for (const seccion of secciones) {
    const enlace = document.createElement('a');
    enlace.href = '#' + seccion.dataset.seccion;
    enlace.textContent = seccion.dataset.titulo;
    enlace.onclick = () => abrir(false);
    nav.append(enlace);
  }
  panel.prepend(menu, nav);
  function mostrar() {
    const hash = location.hash.slice(1);
    const destino = hash.startsWith('reporte-') ? 'reportes' : hash;
    const activa = secciones.find(s => s.dataset.seccion === destino)?.dataset.seccion ?? inicial;
    secciones.forEach((s, i) => {
      s.hidden = s.dataset.seccion !== activa;
      if (s.hidden) nav.children[i].removeAttribute('aria-current');
      else nav.children[i].setAttribute('aria-current', 'page');
    });
    abrir(false);
  }
  window.addEventListener('hashchange', mostrar);
  mostrar();
}
