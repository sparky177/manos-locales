import { collection, doc, getDoc, query, where } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { db, leerFilas } from '../config/firebase.js';
import { tiendaRef } from './emprendimientos.repository.js';
import { productoRef } from './productos.repository.js';

const reportes = collection(db, 'reportes');
export const reporteRef = id => id ? doc(reportes, id) : doc(reportes);
export const contenidoRef = ({ tiendaId, productoId }) =>
  productoId ? productoRef(tiendaId, productoId) : tiendaRef(tiendaId);
export const ultimoCasoRef = (destino, autor) => doc(contenidoRef(destino), 'reporteActivo', autor);

async function listar(campo, valor) {
  const filas = await leerFilas(query(reportes, where(campo, '==', valor)));
  return filas.sort((a, b) => b.creadoEn.toMillis() - a.creadoEn.toMillis());
}
export const misReportes = uid => listar('autor', uid);
export const reportesPendientes = () => listar('estado', 'pendiente');
export async function contenidoActual(reporte) {
  const referencia = contenidoRef(reporte);
  const documento = await getDoc(referencia);
  if (!documento.exists()) return null;
  if (reporte.productoId && (await getDoc(tiendaRef(reporte.tiendaId))).data()?.estado !== 'aprobado') return null;
  return documento.data();
}
