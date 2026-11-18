import {miTienda,misProductos,solicitar,editarTienda,publicar,editar,retirar,nuevaReferencia} from '../datos.js';
import {el,nodo,opciones,avisar,tarea,valores,boton} from '../interfaz.js';
import {imagenes,categorias,negocio,producto,rutaImagen,moneda} from '../dominio.js';
export async function mostrar(usuario){
  const uid=usuario.uid,tienda=await miTienda(uid),perfil=el('negocio'),form=el('producto');
  el('perfil').hidden=false;el('estado').textContent=tienda?'Estado del emprendimiento: '+tienda.estado:'Solicitá el alta de tu emprendimiento.';
  if(tienda){for(const k of ['nombre','descripcion','whatsapp','localidad'])perfil.elements[k].value=tienda[k];
    el('guardarPerfil').textContent='Guardar cambios';}
  perfil.onsubmit=tarea(el('guardarPerfil'),async()=>{const v=negocio(valores(perfil));await (tienda?editarTienda(uid,v):solicitar(uid,v));location.reload();});
  if(tienda?.estado!=='aprobado')return;
  el('gestion').hidden=false;
  opciones(el('categorias'),categorias.map(c=>[c,c]));opciones(el('imagenes'),Object.entries(imagenes));
  const foto=()=>{el('muestra').src=rutaImagen(el('imagenes').value);};el('imagenes').onchange=foto;foto();
  let actual=null,idNuevo=nuevaReferencia(uid);
  function reiniciar(){actual=null;idNuevo=nuevaReferencia(uid);form.reset();foto();el('cancelar').hidden=true;el('tituloProducto').textContent='Publicar producto';el('guardarProducto').textContent='Publicar';}
  el('cancelar').onclick=reiniciar;
  async function listar(){
    const filas=await misProductos(uid);el('inventario').replaceChildren();
    if(!filas.length)el('inventario').append(nodo('p','Todavía no publicaste productos.'));
    for(const p of filas){
      const fila=nodo('article',undefined,'fila');fila.append(nodo('strong',p.nombre),nodo('p',moneda(p.precioCentavos)+' · Stock '+p.stock+' · '+p.estado));
      if(p.estado==='publicado')fila.append(boton('Editar',()=>{actual=p.id;for(const k of ['nombre','descripcion','categoria','stock','imagen'])form.elements[k].value=p[k];
        form.elements.precio.value=(p.precioCentavos/100).toFixed(2);foto();el('cancelar').hidden=false;el('guardarProducto').textContent='Guardar cambios';el('tituloProducto').textContent='Editar producto';form.elements.nombre.focus();}),
        boton('Retirar',async()=>{if(!confirm('¿Retirar este producto del catálogo?'))return;await retirar(uid,p.id);reiniciar();await listar();}));
      el('inventario').append(fila);
    }
  }
  form.onsubmit=tarea(el('guardarProducto'),async()=>{const datos=producto(valores(form));await (actual?editar(uid,actual,datos):publicar(uid,idNuevo,datos));reiniciar();avisar('Producto guardado.');await listar();});
  await listar();
}
