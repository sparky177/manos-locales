import { db } from '../config/firebase.js';
import { collection, doc, getDoc, query, setDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { leerFilas } from './documentos.js';

const tiendas = collection(db, 'emprendimientos');
export const tiendaRef = uid => doc(tiendas, uid);

export async function miTienda(uid) {
  const tienda = await getDoc(tiendaRef(uid));
  return tienda.exists() ? { ...tienda.data(), id: tienda.id } : null;
}

export const listarTiendas = () => leerFilas(tiendas);
export const aprobadas = () => leerFilas(query(tiendas, where('estado', '==', 'aprobado')));
export const solicitar = (uid, datos) => setDoc(tiendaRef(uid), { ...datos, estado: 'pendiente' });
export const editarTienda = (uid, datos) => updateDoc(tiendaRef(uid), datos);
