import { localidades, nombreLocalidad } from '../config/catalogos.js';

export function negocio(form, localidadAnterior) {
  const result=Object.fromEntries(['nombre','descripcion','localidad','whatsapp'].map(k=>[k,form[k].trim()]));
  if(!result.nombre||result.nombre.length>80||!result.descripcion||result.descripcion.length>500||!result.localidad||result.localidad.length>80) throw Error('Completá los datos del emprendimiento.');
  result.localidad = nombreLocalidad(result.localidad);
  if (!localidades.includes(result.localidad) && result.localidad !== nombreLocalidad(localidadAnterior)) throw Error('Elegí una localidad de la lista.');
  if(!/^[1-9][0-9]{7,14}$/.test(result.whatsapp)) throw Error('Ingresá el WhatsApp con código de país, solo números.');
  return result;
}
