import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import { getDocs, getFirestore } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

const proyectoDelGrupo = {
  apiKey: 'AIzaSyDDtmCppdwTHccHga6KPKrM29-64p4XJwE',
  authDomain: 'spark-ca470.firebaseapp.com',
  projectId: 'spark-ca470',
  storageBucket: 'spark-ca470.firebasestorage.app',
  messagingSenderId: '261718118137',
  appId: '1:261718118137:web:ffb7e8227062cbc681dc28',
};

const configuracion = import.meta.env.VITE_FIREBASE_CONFIG;
const app = initializeApp(configuracion ? JSON.parse(configuracion) : proyectoDelGrupo);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function leerFilas(consulta) {
  const resultado = await getDocs(consulta);
  return resultado.docs.map(documento => ({ ...documento.data(), id: documento.id }));
}
