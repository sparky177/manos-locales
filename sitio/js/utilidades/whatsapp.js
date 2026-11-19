export function enlaceContacto(p) {
  return 'https://wa.me/'+p.tienda.whatsapp+'?text='+encodeURIComponent('Hola, vi '+p.nombre+' en Manos Locales. ¿Está disponible?');
}
