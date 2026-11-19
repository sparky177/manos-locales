import { imagenes } from '../config/catalogos.js';

// Firestore guarda el id de la imagen. El navegador obtiene el archivo de la galería local.
export function rutaImagen(id) {
  const nombre = Object.hasOwn(imagenes, id) ? id : 'general';
  const extension = nombre === 'general' ? '.svg' : '.png';
  return '/assets/imagenes/' + nombre + extension;
}
