import { collection, doc, deleteDoc, setDoc } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { db, leerFilas } from '../config/firebase.js';

const favoritos = uid => collection(db, 'usuarios', uid, 'favoritos');

// El separador distingue productos del mismo ID en dos tiendas diferentes.
export const claveFavorito = (tiendaId, productoId) => tiendaId.replaceAll('%', '%25').replaceAll(':', '%3A') + ':' + productoId;
export const misFavoritos = uid => leerFilas(favoritos(uid));
export const quitarFavorito = (uid, id) => deleteDoc(doc(favoritos(uid), id));
export function guardarFavorito(uid, tiendaId, productoId) {
  return setDoc(doc(favoritos(uid), claveFavorito(tiendaId, productoId)), { tiendaId, productoId });
}
