export const categorias = ['Alimentos','Artesanías','Textil','Bienestar'];
export const imagenes = {alfajores:'Alfajores',brownie:'Brownie',cookies:'Cookies',lemon:'Lemon pie',trufas:'Trufas',budin:'Budín',general:'Manos Locales'};
export const rutaImagen = id => '/assets/'+id+(id==='general'?'.svg':'.png');
export const moneda = centavos => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS'}).format(centavos/100);
export const normalizar = s => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filtrar(lista, texto, categoria, localidad) {
  const q=normalizar(texto);
  return lista.filter(p=>(!categoria||p.categoria===categoria)&&(!localidad||p.tienda.localidad===localidad)&&
    normalizar(p.nombre+' '+p.tienda.nombre).includes(q));
}
export function producto(form) {
  const nombre=form.nombre.trim(), descripcion=form.descripcion.trim(), precio=String(form.precio).replace(',','.');
  const precioCentavos=Math.round(Number(precio)*100), stock=Number(form.stock);
  if (!nombre || nombre.length>80 || !descripcion || descripcion.length>500) throw Error('Revisá el nombre y la descripción.');
  if (!/^\d+(\.\d{1,2})?$/.test(precio)||precioCentavos<1||precioCentavos>999999999) throw Error('Ingresá un precio positivo con hasta dos decimales.');
  if (!/^\d+$/.test(String(form.stock))|| stock>99999) throw Error('Ingresá un stock entero entre 0 y 99999.');
  if (!categorias.includes(form.categoria)||!Object.hasOwn(imagenes,form.imagen)) throw Error('Elegí una categoría y una imagen de la galería.');
  return {nombre,descripcion,precioCentavos,stock,categoria:form.categoria,imagen:form.imagen};
}
export function negocio(form) {
  const result=Object.fromEntries(['nombre','descripcion','localidad','whatsapp'].map(k=>[k,form[k].trim()]));
  if(!result.nombre||result.nombre.length>80||!result.descripcion||result.descripcion.length>500||!result.localidad||result.localidad.length>80) throw Error('Completá los datos del emprendimiento.');
  if(!/^[1-9][0-9]{7,14}$/.test(result.whatsapp)) throw Error('Ingresá el WhatsApp con código de país, solo números.');
  return result;
}
export function enlaceContacto(p) {
  return 'https://wa.me/'+p.tienda.whatsapp+'?text='+encodeURIComponent('Hola, vi '+p.nombre+' en Manos Locales. ¿Está disponible?');
}
