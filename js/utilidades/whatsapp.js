function abrirChat(numero, mensaje) {
  return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
}

export function enlaceContacto(p) {
  return abrirChat(p.tienda.whatsapp, 'Hola, vi ' + p.nombre + ' en Manos Locales. ¿Está disponible?');
}

export function contactoNegocio(tienda) {
  return abrirChat(tienda.whatsapp, 'Hola, encontré ' + tienda.nombre + ' en Manos Locales y quería hacer una consulta.');
}
