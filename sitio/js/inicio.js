import {firebaseConfig} from './config.js';
const aviso=document.getElementById('aviso');
async function iniciar(){
  if(!firebaseConfig.projectId||!firebaseConfig.apiKey)throw Error('Falta conectar esta instalación a Firebase. Completá la configuración web indicada en el README.');
  const {actual,cerrar}=await import('./sesion.js');
  const usuario=await actual();
  const salida=document.getElementById('salir');
  salida.hidden=!usuario;
  salida.onclick=async()=>{try{await cerrar();location.href='/';}catch{aviso.textContent='No se pudo cerrar sesión.';}};
  const pagina=document.body.dataset.pagina;
  if(!usuario && ['panel','admin'].includes(pagina)){location.replace('/html/acceso.html');return;}
  const mod=await import('./paginas/'+pagina+'.js');
  await mod.mostrar(usuario);
}
iniciar().catch(e=>{aviso.textContent=e.code==='permission-denied'?'Acceso denegado por Firebase. Revisá los permisos de la cuenta.':e.message;});
