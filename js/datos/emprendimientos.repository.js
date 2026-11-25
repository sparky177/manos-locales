import { db } from '../config/firebase.js';
import { collection, doc, getDoc, query, setDoc, updateDoc, where } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { leerFilas } from '../config/firebase.js';
import { nombreLocalidad } from '../config/catalogos.js';

const tiendas = collection(db, 'emprendimientos');
export const tiendaRef = uid => doc(tiendas, uid);

function conLocalidadCanonica(tienda) {
  return { ...tienda, localidad: nombreLocalidad(tienda.localidad) };
}

export async function miTienda(uid) {
  const tienda = await getDoc(tiendaRef(uid));
  return tienda.exists() ? conLocalidadCanonica({ ...tienda.data(), id: tienda.id }) : null;
}

export const listarTiendas = () => leerFilas(tiendas);
export async function aprobadas() {
  const filas = await leerFilas(query(tiendas, where('estado', '==', 'aprobado')));
  return filas.map(conLocalidadCanonica);
}
export const solicitar = (uid, datos) => setDoc(tiendaRef(uid), { ...datos, estado: 'pendiente' });
export const editarTienda = (uid, datos) => updateDoc(tiendaRef(uid), datos);
export const reenviarSolicitud = uid => updateDoc(tiendaRef(uid), { estado: 'pendiente' });
