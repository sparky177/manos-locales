import { categorias, imagenes } from '../config/catalogos.js';

export function producto(form) {
  const nombre=form.nombre.trim(), descripcion=form.descripcion.trim(), precio=String(form.precio).replace(',','.');
  const precioCentavos=Math.round(Number(precio)*100), stock=Number(form.stock);
  if (!nombre || nombre.length>80 || !descripcion || descripcion.length>500) throw Error('Revisá el nombre y la descripción.');
  if (!/^\d+(\.\d{1,2})?$/.test(precio)||precioCentavos<1||precioCentavos>999999999) throw Error('Ingresá un precio positivo con hasta dos decimales.');
  if (!/^\d+$/.test(String(form.stock))|| stock>99999) throw Error('Ingresá un stock entero entre 0 y 99999.');
  if (!categorias.includes(form.categoria)||!Object.hasOwn(imagenes,form.imagen)) throw Error('Elegí una categoría y una imagen de la galería.');
  return {nombre,descripcion,precioCentavos,stock,categoria:form.categoria,imagen:form.imagen};
}
