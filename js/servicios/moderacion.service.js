import { db } from '../config/firebase.js';
import { collection, doc, getDocs, query, runTransaction, serverTimestamp, where } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { revisionRef } from '../datos/revisiones.repository.js';

const decisiones = collection(db, 'decisiones');

export async function registrarMedida(transaccion, referencia, revisado, estado, motivo, actor) {
  const razon = motivo.trim();
  if (!razon || razon.length > 250) throw Error('Escribí un motivo de hasta 250 caracteres.');
  const registro = doc(decisiones);
  const fecha = serverTimestamp();
  const decision = { ruta: referencia.path, estado, motivo: razon, actor, fecha };
  const actual = (await transaccion.get(referencia)).data();
  if (!actual || Object.entries(actual).some(([campo, valor]) =>
    campo === 'creadoEn' ? !valor.isEqual(revisado[campo]) : valor !== revisado[campo])) {
    throw Error('Los datos cambiaron. Actualizá el panel y volvé a revisarlos.');
  }
  transaccion.update(referencia, { estado });
  transaccion.set(registro, decision);
  transaccion.set(revisionRef(referencia), { estado, motivo: razon, fecha, decisionId: registro.id });
  return registro.id;
}

export function moderar(referencia, revisado, estado, motivo, actor) {
  return runTransaction(db, tx => registrarMedida(tx, referencia, revisado, estado, motivo, actor));
}

// Las decisiones anteriores al panel de revisión solo existen en el historial administrativo.
export async function buscarRevisionAnterior(referencia, estadoActual) {
  const historial = await getDocs(query(decisiones, where('ruta', '==', referencia.path)));
  const ultima = historial.docs.sort((a, b) => {
    const anterior = a.data().fecha;
    const posterior = b.data().fecha;
    return posterior.seconds - anterior.seconds || posterior.nanoseconds - anterior.nanoseconds;
  })[0];
  if (!ultima || ultima.data().estado !== estadoActual) throw Error('No hay una decisión histórica que coincida con el estado actual.');
  const { estado, motivo, fecha } = ultima.data();
  return { estado, motivo, fecha, decisionId: ultima.id };
}

export async function compartirRevisionAnterior(referencia, revision) {
  await runTransaction(db, async transaccion => {
    const ref = revisionRef(referencia);
    if ((await transaccion.get(ref)).exists()) throw Error('Ya existe una revisión. Actualizá el panel.');
    if ((await transaccion.get(referencia)).data()?.estado !== revision.estado) throw Error('El estado cambió. Actualizá el panel.');
    transaccion.set(ref, revision);
  });
}
