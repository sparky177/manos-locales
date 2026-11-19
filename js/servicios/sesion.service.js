import { auth } from '../config/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import { asegurarPerfil } from '../datos/usuarios.repository.js';
import { credenciales } from '../validaciones/cuenta.validator.js';

export const cerrar = () => signOut(auth);

export async function identificar(correo, clave, registro) {
  const datos = credenciales(correo, clave, registro);
  const autenticar = registro ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
  const { user } = await autenticar(auth, datos.correo, datos.clave);
  await asegurarPerfil(user.uid);
}

export async function actual() {
  await auth.authStateReady();
  return auth.currentUser;
}
