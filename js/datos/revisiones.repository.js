import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

export const revisionRef = referencia => doc(referencia, 'revision', 'actual');

export async function ultimaRevision(referencia) {
  const revision = await getDoc(revisionRef(referencia));
  return revision.exists() ? revision.data() : null;
}
