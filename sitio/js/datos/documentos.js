import { getDocs } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

export async function leerFilas(consulta) {
  const resultado = await getDocs(consulta);
  return resultado.docs.map(documento => ({ ...documento.data(), id: documento.id }));
}
