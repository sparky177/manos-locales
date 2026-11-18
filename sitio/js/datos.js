import {db} from './firebase.js';
import {collection,doc,getDoc,getDocs,query,where,setDoc,updateDoc,serverTimestamp,writeBatch} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
const tiendas=collection(db,'emprendimientos');
const tiendaRef=uid=>doc(tiendas,uid);
const mercaderia=uid=>collection(tiendaRef(uid),'productos');
const filas=async consulta=>(await getDocs(consulta)).docs.map(d=>({...d.data(),id:d.id}));
export async function miTienda(uid){const d=await getDoc(tiendaRef(uid));return d.exists()?{...d.data(),id:d.id}:null;}
export const soyAdmin=async uid=>(await getDoc(doc(db,'administradores',uid))).exists();
export async function asegurarPerfil(uid){const ref=doc(db,'usuarios',uid);if(!(await getDoc(ref)).exists())await setDoc(ref,{creadoEn:serverTimestamp()});}
export const solicitar=(uid,datos)=>setDoc(tiendaRef(uid),{...datos,estado:'pendiente'});
export const editarTienda=(uid,datos)=>updateDoc(tiendaRef(uid),datos);
export const listarTiendas=()=>filas(tiendas);
export const misProductos=uid=>filas(mercaderia(uid));
export async function catalogo(){
  const aprobadas=await filas(query(tiendas,where('estado','==','aprobado')));
  const grupos=await Promise.all(aprobadas.map(async tienda=>(await filas(query(mercaderia(tienda.id),where('estado','==','publicado')))).map(p=>({...p,tienda}))));
  return grupos.flat().sort((a,b)=>(b.creadoEn?.toMillis()||0)-(a.creadoEn?.toMillis()||0));
}
export const nuevaReferencia=uid=>doc(mercaderia(uid)).id;
export const publicar=(uid,id,datos)=>setDoc(doc(mercaderia(uid),id),{...datos,estado:'publicado',creadoEn:serverTimestamp()});
export const editar=(uid,id,datos)=>updateDoc(doc(mercaderia(uid),id),datos);
export const retirar=(uid,id)=>updateDoc(doc(mercaderia(uid),id),{estado:'archivado'});
export async function moderar(uid,productoId,estado,motivo,actor){
  if(!motivo.trim()||motivo.trim().length>250) throw Error('Escribí un motivo de hasta 250 caracteres.');
  const ref=productoId?doc(mercaderia(uid),productoId):tiendaRef(uid);
  const lote=writeBatch(db);
  lote.update(ref,{estado});
  lote.set(doc(collection(db,'decisiones')),{ruta:ref.path,estado,motivo:motivo.trim(),actor,fecha:serverTimestamp()});
  await lote.commit();
}
