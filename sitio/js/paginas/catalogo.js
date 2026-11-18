import {catalogo} from '../datos.js';
import {el,nodo,opciones} from '../interfaz.js';
import {categorias,filtrar,rutaImagen,moneda,enlaceContacto} from '../dominio.js';
function tarjeta(p,detalle=false){
  const a=nodo('article',undefined,detalle?'':'tarjeta');
  const img=nodo('img');img.src=rutaImagen(p.imagen);img.alt=p.nombre;if(detalle)img.className='ficha';
  a.append(img,nodo('h3',p.nombre),nodo('p',p.tienda.nombre+' · '+p.tienda.localidad),nodo('strong',moneda(p.precioCentavos)),nodo('p',p.stock?p.stock+' unidades disponibles':'Sin stock'));
  const link=nodo('a',detalle?'Contactar por WhatsApp':'Ver producto','accion');
  if(detalle){a.append(nodo('p',p.descripcion),nodo('p',p.tienda.descripcion));link.href=enlaceContacto(p);link.target='_blank';link.rel='noopener noreferrer';}
  else link.href='?'+new URLSearchParams({tienda:p.tienda.id,producto:p.id});
  a.append(link);return a;
}
export async function mostrar(){
  const lista=await catalogo(),params=new URLSearchParams(location.search);
  if(params.has('producto')){
    const p=lista.find(v=>v.tienda.id===params.get('tienda')&&v.id===params.get('producto'));
    el('listado').hidden=true;document.querySelector('.portada').hidden=true;
    el('detalle').hidden=false;
    const volver=nodo('a','Volver al catálogo');volver.href='/';
    el('detalle').append(volver,p?tarjeta(p,true):nodo('p','Esta publicación ya no está disponible.'));return;
  }
  opciones(el('categoria'),categorias.map(c=>[c,c]));
  opciones(el('localidad'),Array.from(new Set(lista.map(p=>p.tienda.localidad))).sort().map(c=>[c,c]));
  function pintar(){const resultados=filtrar(lista,el('buscar').value,el('categoria').value,el('localidad').value);
    el('conteo').textContent=resultados.length?resultados.length+' productos':'No hay productos para esta búsqueda.';
    el('productos').replaceChildren(...resultados.map(p=>tarjeta(p)));}
  for(const id of ['buscar','categoria','localidad'])el(id).addEventListener('input',pintar);
  pintar();
}
