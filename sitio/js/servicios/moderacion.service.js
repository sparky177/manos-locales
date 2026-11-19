import { db } from '../config/firebase.js';
import { collection, doc, serverTimestamp, writeBatch } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { tiendaRef } from '../datos/emprendimientos.repository.js';
import { productoRef } from '../datos/productos.repository.js';

export async function moderar(uid, productoId, estado, motivo, actor) {
  const razon = motivo.trim();
  if (!razon || razon.length > 250) throw Error('Escribí un motivo de hasta 250 caracteres.');
  const referencia = productoId ? productoRef(uid, productoId) : tiendaRef(uid);
  const lote = writeBatch(db);
  lote.update(referencia, { estado });
  lote.set(doc(collection(db, 'decisiones')), {
    ruta: referencia.path, estado, motivo: razon, actor, fecha: serverTimestamp()
  });
  await lote.commit();
}
