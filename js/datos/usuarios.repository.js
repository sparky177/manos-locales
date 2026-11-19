import { db } from '../config/firebase.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

export async function soyAdmin(uid) {
  return (await getDoc(doc(db, 'administradores', uid))).exists();
}

export async function asegurarPerfil(uid) {
  const perfil = doc(db, 'usuarios', uid);
  if (!(await getDoc(perfil)).exists()) {
    await setDoc(perfil, { creadoEn: serverTimestamp() });
  }
}
