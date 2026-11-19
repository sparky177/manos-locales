import { catalogo } from '../servicios/productos.service.js';
import { filtrar, categorias } from '../config/catalogos.js';
import { el, opciones } from '../ui/mensajes.ui.js';
import { tarjeta } from '../ui/productos.ui.js';

export async function mostrar() {
  const lista = await catalogo();
  opciones(el('categoria'), categorias.map(nombre => [nombre, nombre]));
  const localidades = [...new Set(lista.map(p => p.tienda.localidad))].sort();
  opciones(el('localidad'), localidades.map(nombre => [nombre, nombre]));

  function pintar() {
    const resultados = filtrar(lista, el('buscar').value, el('categoria').value, el('localidad').value);
    el('conteo').textContent = resultados.length === 1 ? '1 producto' : resultados.length + ' productos';
    el('vacio').hidden = resultados.length > 0;
    el('productos').replaceChildren(...resultados.map(tarjeta));
  }
  el('filtros').addEventListener('input', pintar);
  el('filtros').addEventListener('submit', evento => evento.preventDefault());
  el('limpiar').onclick = () => { el('filtros').reset(); pintar(); el('buscar').focus(); };
  pintar();
}
