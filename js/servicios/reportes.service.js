import { runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { db } from '../config/firebase.js';
import { contenidoRef, reporteRef, ultimoCasoRef } from '../datos/reportes.repository.js';
import { registrarMedida } from './moderacion.service.js';

export const motivos = ['Información incorrecta', 'Contenido inapropiado', 'Spam o engaño', 'Otro'];

export async function enviarReporte(autor, destino, motivo, detalle) {
  detalle = detalle.trim();
  if (!motivos.includes(motivo) || !detalle || detalle.length > 500) throw Error('Elegí un motivo y escribí un detalle de hasta 500 caracteres.');
  const indice = ultimoCasoRef(destino, autor);
  const nuevo = reporteRef();
  return runTransaction(db, async tx => {
    const ultimo = await tx.get(indice);
    if (ultimo.exists()) {
      const anterior = await tx.get(reporteRef(ultimo.data().reporteId));
      if (anterior.data()?.estado === 'pendiente') return { id: anterior.id, existente: true };
    }
    tx.set(nuevo, { ...destino, autor, motivo, detalle, estado: 'pendiente', creadoEn: serverTimestamp() });
    tx.set(indice, { reporteId: nuevo.id });
    return { id: nuevo.id, existente: false };
  });
}

export async function cerrarReporte(reporte, actor, resultado, revisado = null) {
  resultado = resultado.trim();
  if (!resultado || resultado.length > 250) throw Error('Escribí una explicación de hasta 250 caracteres.');
  const ref = reporteRef(reporte.id);
  await runTransaction(db, async tx => {
    if ((await tx.get(ref)).data()?.estado !== 'pendiente') throw Error('Este caso ya se cerró. Actualizá la bandeja.');
    const cierre = { resultado, resueltoPor: actor, cerradoEn: serverTimestamp(), estado: 'descartado' };
    if (revisado) {
      const estado = reporte.productoId ? 'oculto' : 'suspendido';
      cierre.decisionId = await registrarMedida(tx, contenidoRef(reporte), revisado, estado, resultado, actor);
      cierre.estado = 'resuelto';
    }
    tx.update(ref, cierre);
  });
}
