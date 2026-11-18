import {identificar} from '../sesion.js';
import {soyAdmin,asegurarPerfil} from '../datos.js';
import {el,tarea,valores} from '../interfaz.js';
export async function mostrar(usuario){
  if(usuario){el('cuenta').hidden=true;el('identidad').textContent=usuario.email;el('panel').hidden=false;
    await asegurarPerfil(usuario.uid);el('admin').hidden=!(await soyAdmin(usuario.uid));return;}
  const f=el('cuenta');f.querySelector('button').disabled=false;f.onsubmit=tarea(f.querySelector('button'),async()=>{
    const v=valores(f);await identificar(v.correo,v.clave,v.accion==='registrar');location.reload();
  });
}
