import test from 'node:test';
import assert from 'node:assert/strict';
import {producto} from '../../js/validaciones/producto.validator.js';
import {negocio} from '../../js/validaciones/emprendimiento.validator.js';
import {filtrarNegocios, opcionesLocalidad} from '../../js/config/catalogos.js';
import {filtrarProductos, limiteEnCentavos, ordenarProductos} from '../../js/utilidades/filtros-productos.js';
import {enlaceContacto, contactoNegocio} from '../../js/utilidades/whatsapp.js';
const form={nombre:'Alfajores',descripcion:'Caja de cuatro',categoria:'Alimentos',imagen:'alfajores',precio:'6800,25',stock:'0'};
test('el selector ofrece localidades sin resultados y reúne variantes de perfiles anteriores', () => {
  const opciones = opcionesLocalidad(['RIO  GALLEGOS', 'Rio Gallegos', 'Piedrabuena', 'Paraje anterior', 'paraje anterior']);
  assert.ok(opciones.includes('Río Turbio'));
  assert.ok(opciones.includes('Comandante Luis Piedra Buena'));
  assert.equal(opciones.filter(nombre => nombre === 'Río Gallegos').length, 1);
  assert.ok(!opciones.includes('Rio Gallegos') && !opciones.includes('Piedrabuena'));
  assert.equal(opciones.filter(nombre => nombre.toLowerCase() === 'paraje anterior').length, 1);
  const tienda = { nombre: 'Tejidos', localidad: 'RIO  GALLEGOS' };
  const item = { nombre: 'Bufanda', tienda };
  assert.deepEqual(filtrarNegocios([tienda], '', 'Río Gallegos'), [tienda]);
  assert.deepEqual(filtrarProductos([item], { localidad: 'Río Gallegos' }), [item]);
  assert.deepEqual(filtrarProductos([item], { localidad: 'Río Turbio' }), []);
});

test('el alta usa la lista provincial y editar admite conservar una localidad anterior', () => {
  const datos = { nombre: 'Taller', descripcion: 'Tejidos', whatsapp: '5490000000000', localidad: 'el chalten' };
  assert.equal(negocio(datos).localidad, 'El Chaltén');
  const anterior = { ...datos, localidad: 'Paraje anterior' };
  assert.throws(() => negocio(anterior), /localidad/);
  assert.equal(negocio(anterior, 'Paraje anterior').localidad, 'Paraje anterior');
});
test('un negocio sin productos se encuentra por nombre y localidad y recibe una consulta general', () => {
  const tienda = { nombre: 'Rincón & Sur', localidad: 'El Chaltén', whatsapp: '5490000000000' };
  assert.deepEqual(filtrarNegocios([tienda], 'RINCON', 'El Chaltén'), [tienda]);
  assert.deepEqual(filtrarNegocios([tienda], 'sur', 'Río Gallegos'), []);
  const url = new URL(contactoNegocio(tienda));
  assert.equal(url.origin + url.pathname, 'https://wa.me/' + tienda.whatsapp);
  assert.ok(url.searchParams.get('text').includes(tienda.nombre));
});
test('convierte precio exacto a centavos y conserva stock cero',()=>{const p=producto(form);assert.equal(p.precioCentavos,680025);assert.equal(p.stock,0);});
test('rechaza valores fuera del contrato',()=>{for(const cambio of [{precio:'0'},{precio:'1.001'},{stock:'-1'},{stock:'1.5'},{imagen:'foto-externa'},{categoria:'Otra'}])assert.throws(()=>producto({...form,...cambio}));});
test('combina texto, localidad, categoría y límite inclusivo en centavos', () => {
  const p = { ...form, precioCentavos: 200000, tienda: { nombre: 'Rincón', localidad: 'El Chaltén' } };
  const criterios = { texto: 'rincon', categoria: 'Alimentos', localidad: 'El Chaltén', hastaCentavos: limiteEnCentavos('2.000') };
  const lista = [p, { ...p, precioCentavos: 200001 }, { ...p, categoria: 'Textil' },
    { ...p, tienda: { ...p.tienda, localidad: 'Río Gallegos' } }, { ...p, tienda: { ...p.tienda, nombre: 'Taller' } }];
  assert.deepEqual(filtrarProductos(lista, criterios), [p]);
  assert.deepEqual(filtrarProductos(lista, { hastaCentavos: limiteEnCentavos('') }), lista);
  assert.deepEqual(filtrarProductos(lista, { hastaCentavos: limiteEnCentavos('0') }), []);
});

test('interpreta pesos y centavos y distingue campo vacío de importe inválido', () => {
  for (const importe of ['2000,50', '2.000,50', '2000.50']) assert.equal(limiteEnCentavos(importe), 200050);
  assert.equal(limiteEnCentavos('0,01'), 1);
  assert.equal(limiteEnCentavos(' '), null);
  for (const importe of ['-5','2,005','abc','2.00.0']) assert.ok(Number.isNaN(limiteEnCentavos(importe)));
});

test('ordena por precio en ambos sentidos, desempata por fecha y conserva la lista original', () => {
  const item = (precioCentavos, fecha) => ({ precioCentavos, creadoEn: { toMillis: () => fecha } });
  const barato = item(100, 4), anterior = item(300, 2), reciente = item(300, 3);
  const lista = [anterior, barato, reciente];
  assert.deepEqual(ordenarProductos(lista, 'menor'), [barato, reciente, anterior]);
  assert.deepEqual(ordenarProductos(lista, 'mayor'), [reciente, anterior, barato]);
  assert.deepEqual(ordenarProductos(lista), [barato, reciente, anterior]);
  assert.deepEqual(lista, [anterior, barato, reciente]);
});
test('el contacto incluye el producto sin alterar su stock',()=>{const p={...form,nombre:'Pan & té',tienda:{whatsapp:'5490000000000'}};const url=new URL(enlaceContacto(p));assert.equal(url.hostname,'wa.me');assert.ok(url.searchParams.get('text').includes('Pan & té'));assert.equal(p.stock,'0');});
test('rechaza WhatsApp sin formato internacional numérico',()=>{assert.throws(()=>negocio({nombre:'Tienda',descripcion:'Artesanías',localidad:'Río Gallegos',whatsapp:'hola'}));});
