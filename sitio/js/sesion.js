import {auth} from './firebase.js';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {asegurarPerfil} from './datos.js';
export const cerrar=()=>signOut(auth);
export async function identificar(correo,clave,registro){
  const operacion=registro?createUserWithEmailAndPassword:signInWithEmailAndPassword;
  const {user}=await operacion(auth,correo,clave);
  await asegurarPerfil(user.uid);
}
export async function actual(){await auth.authStateReady();return auth.currentUser;}
