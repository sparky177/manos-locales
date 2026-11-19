export const el = id=>document.getElementById(id);
export function nodo(tag,texto,clase){
  const n=document.createElement(tag);
  if(texto!==undefined)n.textContent=texto;
  if(clase)n.className=clase;
  return n;
}
export function opciones(select,pares){for(const [valor,texto] of pares)select.add(new Option(texto,valor));}
export function avisar(texto){el('aviso').textContent=texto;}
export function explicar(error){
  if(error.code==='permission-denied')return 'Firebase rechazó la operación. Revisá la sesión, la aprobación y las reglas publicadas.';
  if(error.code?.startsWith('auth/'))return 'No se pudo completar el acceso. Revisá el correo, la contraseña y la configuración de Authentication. ('+error.code+')';
  return error.message || 'No se pudo completar la operación.';
}
export function tarea(control,accion){
  return async evento=>{
    evento?.preventDefault();
    if(control.disabled)return;
    control.disabled=true;
    try {avisar('');await accion();}catch(e){avisar(explicar(e));}finally{control.disabled=false;}
  };
}
export function boton(texto,accion){const b=nodo('button',texto);b.type='button';b.onclick=tarea(b,accion);return b;}
export const valores=form=>Object.fromEntries(new FormData(form));
