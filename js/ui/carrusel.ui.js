const fotos = [
  ['/assets/imagenes/alfajores.png', 'Alfajores artesanales'],
  ['/assets/imagenes/portada/tejido.jpg', 'Gorro tejido de lana'],
  ['/assets/imagenes/portada/impresion.jpg', 'Florero en una impresora 3D']
];

export function iniciarCarrusel(control) {
  const movimiento = matchMedia('(prefers-reduced-motion: reduce)');
  const imagen = control.querySelector('img');
  let actual = 0;
  let pausado = false;
  let intervalo;
  function avanzar() {
    actual = (actual + 1) % fotos.length;
    [imagen.src, imagen.alt] = fotos[actual];
  }
  function actualizar() {
    clearInterval(intervalo);
    const etiqueta = movimiento.matches ? 'Ver la siguiente foto' : pausado ? 'Reanudar carrusel' : 'Pausar carrusel';
    control.setAttribute('aria-label', etiqueta);
    control.title = etiqueta;
    if (!pausado && !movimiento.matches && !document.hidden) intervalo = setInterval(avanzar, 6500);
  }
  control.onclick = () => {
    if (movimiento.matches) avanzar();
    else pausado = !pausado;
    actualizar();
  };
  movimiento.addEventListener('change', actualizar);
  document.addEventListener('visibilitychange', actualizar);
  actualizar();
}
