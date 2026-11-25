import { catalogo } from '../servicios/productos.service.js';
import { aprobadas } from '../datos/emprendimientos.repository.js';
import { filtrarNegocios, categorias, opcionesLocalidad } from '../config/catalogos.js';
import { filtrarProductos, limiteEnCentavos, ordenarProductos } from '../utilidades/filtros-productos.js';
import { el, opciones } from '../ui/mensajes.ui.js';
import { tarjeta } from '../ui/productos.ui.js';
import { tarjetaNegocio } from '../ui/emprendimiento.ui.js';
import { prepararControlFavorito } from '../ui/favoritos.ui.js';
import { iniciarCarrusel } from '../ui/carrusel.ui.js';

export async function mostrar(usuario) {
  const params = new URLSearchParams(location.search);
  const negocios = params.get('vista') === 'emprendimientos';
  const buscando = params.has('q');
  const consulta = params.get('q') ?? '';
  el('buscar').value = consulta;
  el('portada').hidden = buscando;
  el('volver-inicio').hidden = !buscando;
  el('abrir-filtros').hidden = buscando;
  el('filtros').hidden = !buscando;
  el('alternar-filtros').hidden = !buscando;
  el('zona-resultados').classList.toggle('con-filtros', buscando);
  const ruta = vista => {
    const p = new URLSearchParams();
    if (vista) p.set('vista', 'emprendimientos');
    if (buscando) p.set('q', consulta);
    return '/?' + p + '#listado';
  };
  el('ver-negocios').href = ruta(true);
  el('ver-productos').href = ruta(false);
  if (negocios) {
    const vista = document.createElement('input');
    vista.type = 'hidden';
    vista.name = 'vista';
    vista.value = 'emprendimientos';
    el('buscar').form.append(vista);
    el('abrir-filtros').href = '/?q=&vista=emprendimientos';
  }
  if (buscando) el('titulo-listado').textContent = consulta ? 'Resultados para «' + consulta + '»' : 'Resultados del catálogo';
  else iniciarCarrusel(el('foto-portada'));
  el('alternar-filtros').onclick = () => {
    const abierto = el('filtros').classList.toggle('abierto');
    el('alternar-filtros').setAttribute('aria-expanded', String(abierto));
  };
  const tipo = negocios ? 'emprendimiento' : 'producto';
  el(negocios ? 'ver-negocios' : 'ver-productos').setAttribute('aria-current', 'page');
  el('campo-categoria').hidden = negocios;
  el('campo-precio').hidden = negocios;
  el('campo-orden').hidden = negocios || !buscando;
  if (negocios) el('buscar').placeholder = 'Nombre del emprendimiento';
  else opciones(el('categoria'), categorias.map(nombre => [nombre, nombre]));
  el('sin-resultados').textContent = 'No hay ' + tipo + 's para esta búsqueda.';
  const lista = negocios ? await aprobadas() : await catalogo();
  let controlFavorito = null;
  if (negocios) lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es-AR'));
  const localidades = opcionesLocalidad(lista.map(item => negocios ? item.localidad : item.tienda.localidad));
  opciones(el('localidad'), localidades.map(nombre => [nombre, nombre]));

  function pintar() {
    const texto = consulta;
    const localidad = el('localidad').value;
    const categoria = el('categoria').value;
    const orden = el('orden').value;
    const hastaCentavos = limiteEnCentavos(el('hasta').value);
    const cantidadFiltros = [categoria, localidad, el('hasta').value].filter(Boolean).length;
    el('alternar-filtros').textContent = cantidadFiltros ? 'Filtros (' + cantidadFiltros + ')' : 'Filtros';
    const invalido = !negocios && Number.isNaN(hastaCentavos);
    el('error-precio').hidden = !invalido;
    el('hasta').setAttribute('aria-invalid', String(invalido));
    el('limpiar').hidden = !(texto || localidad || categoria || hastaCentavos !== null || orden !== 'recientes');
    let resultados = negocios ? filtrarNegocios(lista, texto, localidad)
      : filtrarProductos(lista, { texto, categoria, localidad, hastaCentavos });
    if (!negocios && orden !== 'recientes') resultados = ordenarProductos(resultados, orden);
    el('conteo').textContent = invalido ? 'Revisá el precio máximo.' : resultados.length + ' ' + tipo + (resultados.length === 1 ? '' : 's');
    el('vacio').hidden = invalido || resultados.length > 0;
    el('resultados').replaceChildren(...resultados.map(item => negocios ? tarjetaNegocio(item) : tarjeta(item, controlFavorito)));
  }
  el('filtros').addEventListener('input', pintar);
  el('filtros').addEventListener('submit', evento => evento.preventDefault());
  el('orden').onchange = pintar;
  el('limpiar').onclick = () => {
    if (consulta) { location.href = negocios ? '/?q=&vista=emprendimientos' : '/?q='; return; }
    el('filtros').reset(); el('orden').value = 'recientes'; pintar();
  };
  pintar();
  if (!negocios) {
    controlFavorito = await prepararControlFavorito(usuario, pintar);
    pintar();
  }
}
