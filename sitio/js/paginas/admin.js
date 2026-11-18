import {soyAdmin,listarTiendas,misProductos,moderar} from '../datos.js';
import {el,nodo,avisar,boton} from '../interfaz.js';
export async function mostrar(usuario){
  if(!(await soyAdmin(usuario.uid))){avisar('Esta cuenta no tiene permiso de administración.');return;}
  el('moderacion').hidden=false;
  async function cargar(){
    const tiendas=await listarTiendas();el('solicitudes').replaceChildren();
    if(!tiendas.length)el('solicitudes').append(nodo('p','Todavía no hay solicitudes.'));
    for(const t of tiendas){
      const fila=nodo('article',undefined,'caja');fila.append(nodo('h3',t.nombre),nodo('p',t.descripcion),nodo('p',t.localidad+' · '+t.estado));
      function accion(texto,estado,pid=null){return boton(texto,async()=>{
        const motivo=prompt('Motivo de la decisión (hasta 250 caracteres)');if(motivo===null)return;
        await moderar(t.id,pid,estado,motivo,usuario.uid);await cargar();avisar('Decisión guardada.');
      });}
      if(t.estado!=='aprobado')fila.append(accion('Aprobar','aprobado'));
      if(t.estado==='pendiente')fila.append(accion('Rechazar','rechazado'));
      if(t.estado==='aprobado'){
        fila.append(accion('Suspender','suspendido'));
        fila.append(boton('Ver productos',async()=>{const productos=await misProductos(t.id);const lista=nodo('div');
          for(const p of productos){const row=nodo('div',p.nombre+' · '+p.estado,'fila');if(p.estado==='publicado')row.append(accion('Ocultar','oculto',p.id));lista.append(row);}
          if(!productos.length)lista.textContent='Sin productos.';fila.querySelector('.productos')?.remove();lista.className='productos';fila.append(lista);}));
      }
      el('solicitudes').append(fila);
    }
  }
  await cargar();
}
