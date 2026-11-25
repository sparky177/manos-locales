export function rutaFicha(tiendaId, productoId) {
  const parametros = new URLSearchParams({ tienda: tiendaId });
  if (productoId) parametros.set('producto', productoId);
  const pagina = productoId ? 'producto' : 'emprendimiento';
  return '/html/' + pagina + '.html?' + parametros;
}

export function destinoTrasAcceso() {
  const p = new URLSearchParams(location.search);
  const destino = p.get('accion') === 'favorito' ? '#favorito' : '#reportar';
  return p.get('tienda') ? rutaFicha(p.get('tienda'), p.get('producto')) + destino : '/html/cuenta.html';
}
