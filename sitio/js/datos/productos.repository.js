import { collection, doc, query, serverTimestamp, setDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { tiendaRef } from './emprendimientos.repository.js';
import { leerFilas } from './documentos.js';

const productos = uid => collection(tiendaRef(uid), 'productos');
export const productoRef = (uid, id) => doc(productos(uid), id);
export const misProductos = uid => leerFilas(productos(uid));
export const publicados = uid => leerFilas(query(productos(uid), where('estado', '==', 'publicado')));
export const nuevaReferencia = uid => doc(productos(uid)).id;

export function publicar(uid, id, datos) {
  return setDoc(productoRef(uid, id), { ...datos, estado: 'publicado', creadoEn: serverTimestamp() });
}

export const editar = (uid, id, datos) => updateDoc(productoRef(uid, id), datos);
export const retirar = (uid, id) => updateDoc(productoRef(uid, id), { estado: 'archivado' });
