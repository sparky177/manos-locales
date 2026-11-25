import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

// Proyecto de demostración y dos emuladores locales. Los fixtures duran una ejecución.
const proyecto = 'demo-manos-locales';
const documentos = 'http://127.0.0.1:8080/v1/projects/' + proyecto + '/databases/(default)/documents';
const identidad = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo';

async function cuenta() {
  const respuesta = await fetch(identidad, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: randomUUID() + '@example.test', password: randomUUID(), returnSecureToken: true }),
  });
  assert.equal(respuesta.status, 200, 'Debe estar activo el emulador de Authentication');
  return respuesta.json();
}

async function escribir(ruta, datos, token) {
  const fields = Object.fromEntries(Object.entries(datos).map(([campo, texto]) => [campo, { stringValue: texto }]));
  return fetch(documentos + '/' + ruta, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ fields }),
  });
}

test('favoritos privados por cuenta, sin duplicados y solo para productos visibles', async () => {
  const [comprador, otra] = await Promise.all([cuenta(), cuenta()]);
  const tiendaId = randomUUID();
  const productoId = 'bufanda';
  const tienda = 'emprendimientos/' + tiendaId;
  const producto = tienda + '/productos/' + productoId;
  const lista = 'usuarios/' + comprador.localId + '/favoritos';
  const favorito = lista + '/' + tiendaId + ':' + productoId;
  const datos = { tiendaId, productoId };
  const consultar = (ruta, persona, method = 'GET') => fetch(documentos + '/' + ruta,
    { method, headers: persona ? { Authorization: 'Bearer ' + persona.idToken } : {} });
  await escribir(tienda, { estado: 'aprobado' }, 'owner');
  await escribir(producto, { estado: 'publicado' }, 'owner');
  assert.equal((await escribir(favorito, datos, otra.idToken)).status, 403);
  assert.equal((await escribir(favorito, datos, comprador.idToken)).status, 200);
  assert.equal((await escribir(favorito, datos, comprador.idToken)).status, 200);
  assert.equal((await escribir(lista + '/duplicado', datos, comprador.idToken)).status, 403);
  const respuesta = await consultar(lista, comprador);
  assert.equal(respuesta.status, 200);
  assert.equal((await respuesta.json()).documents.length, 1);
  for (const cuentaAjena of [otra, null]) {
    assert.equal((await consultar(lista, cuentaAjena)).status, 403);
    assert.equal((await consultar(favorito, cuentaAjena)).status, 403);
    assert.equal((await consultar(favorito, cuentaAjena, 'DELETE')).status, 403);
  }
  assert.equal((await escribir(favorito, { ...datos, nombre: 'Copia' }, comprador.idToken)).status, 403);
  await escribir(producto, { estado: 'oculto' }, 'owner');
  assert.equal((await consultar(producto, comprador)).status, 403);
  assert.equal((await consultar(favorito, comprador, 'DELETE')).status, 200);
  for (const estado of ['oculto','archivado','pendiente_revision']) {
    await escribir(producto, { estado }, 'owner');
    assert.equal((await escribir(favorito, datos, comprador.idToken)).status, 403);
  }
  await escribir(producto, { estado: 'publicado' }, 'owner');
  await escribir(tienda, { estado: 'suspendido' }, 'owner');
  assert.equal((await escribir(favorito, datos, comprador.idToken)).status, 403);
});

test('reportes privados, duplicados, descarte y resolución atómica de fichas', async () => {
  const [titular, comprador, otra, admin] = await Promise.all([cuenta(), cuenta(), cuenta(), cuenta()]);
  const tiendaId = titular.localId;
  const tienda = 'emprendimientos/' + tiendaId;
  const base = 'projects/' + proyecto + '/databases/(default)/documents/';
  const producto = tienda + '/productos/muestra';
  await escribir(tienda, { nombre: 'Feria', descripcion: 'Tejidos', localidad: 'Santa Cruz', whatsapp: '5490000000000', estado: 'aprobado' }, 'owner');
  await escribir(producto, { nombre: 'Bufanda', estado: 'publicado' }, 'owner');
  await escribir('administradores/' + admin.localId, {}, 'owner');
  const headers = persona => persona ? { 'Content-Type': 'application/json', Authorization: 'Bearer ' + persona.idToken } : { 'Content-Type': 'application/json' };
  const commit = (persona, writes) => fetch(documentos + ':commit', { method: 'POST', headers: headers(persona), body: JSON.stringify({ writes }) });
  const leer = (ruta, persona) => fetch(documentos + '/' + ruta, { headers: headers(persona) });
  function escritura(ruta, campos, fecha, parcial = false) {
    const fields = Object.fromEntries(Object.entries(campos).map(([k, stringValue]) => [k, { stringValue }]));
    const write = { update: { name: base + ruta, fields } };
    if (fecha) write.updateTransforms = [{ fieldPath: fecha, setToServerValue: 'REQUEST_TIME' }];
    if (parcial) write.updateMask = { fieldPaths: Object.keys(campos) };
    return write;
  }
  function alta(id, autor, productoId = '', cambios = {}) {
    const ruta = productoId ? producto : tienda;
    const datos = { autor: autor.localId, tiendaId, productoId, nombre: productoId ? 'Bufanda' : 'Feria',
      motivo: 'Información incorrecta', detalle: 'Revisar los datos', estado: 'pendiente', ...cambios };
    return [escritura('reportes/' + id, datos, 'creadoEn'), escritura(ruta + '/reporteActivo/' + autor.localId, { reporteId: id })];
  }
  function cierre(id, estado, decisionId) {
    const campos = { estado, resultado: 'Datos revisados', resueltoPor: admin.localId };
    if (decisionId) campos.decisionId = decisionId;
    return escritura('reportes/' + id, campos, 'cerradoEn', true);
  }
  const id = randomUUID();
  assert.equal((await commit(null, alta(id, comprador))).status, 403);
  assert.equal((await commit(otra, alta(id, comprador))).status, 403);
  assert.equal((await commit(comprador, alta(id, comprador, '', { detalle: '   ' }))).status, 403);
  assert.equal((await commit(comprador, alta(id, comprador).slice(0, 1))).status, 403);
  const segundoId = randomUUID();
  const simultaneos = await Promise.all([id, segundoId].map(i => commit(comprador, alta(i, comprador))));
  assert.deepEqual(simultaneos.map(r => r.status).sort(), [200, 403]);
  const abierto = simultaneos[0].ok ? id : segundoId;
  const ruta = 'reportes/' + abierto;
  assert.equal((await leer(ruta, comprador)).status, 200);
  assert.equal((await leer(ruta, admin)).status, 200);
  for (const persona of [null, titular, otra]) assert.equal((await leer(ruta, persona)).status, 403);
  function bandeja(campo, valor, persona) {
    const filter = { field: { fieldPath: campo }, op: 'EQUAL', value: { stringValue: valor } };
    return fetch(documentos + ':runQuery', { method: 'POST', headers: headers(persona),
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'reportes' }], where: { fieldFilter: filter } } }) });
  }
  const propios = await bandeja('autor', comprador.localId, comprador);
  assert.equal(propios.status, 200);
  assert.ok((await propios.json()).some(fila => fila.document?.name === base + ruta));
  assert.equal((await bandeja('autor', comprador.localId, otra)).status, 403);
  assert.equal((await bandeja('estado', 'pendiente', comprador)).status, 403);
  assert.equal((await bandeja('estado', 'pendiente', admin)).status, 200);
  assert.equal((await leer(tienda)).status, 200);
  assert.equal((await commit(otra, alta(randomUUID(), otra))).status, 200);
  assert.equal((await commit(comprador, [cierre(abierto, 'descartado')])).status, 403);
  assert.equal((await commit(admin, [cierre(abierto, 'resuelto', randomUUID())])).status, 403);
  assert.equal((await commit(admin, [cierre(abierto, 'descartado')])).status, 200);
  const nuevo = randomUUID();
  assert.equal((await commit(comprador, alta(nuevo, comprador))).status, 200);
  const prodId = randomUUID();
  assert.equal((await commit(comprador, alta(prodId, comprador, 'muestra'))).status, 200);
  const medida = randomUUID();
  assert.equal((await decidir(producto, admin, 'oculto', 'Corregir ficha', medida, [cierre(prodId, 'resuelto', randomUUID())])).status, 403);
  assert.equal((await leer(producto)).status, 200);
  assert.equal((await (await leer('reportes/' + prodId, comprador)).json()).fields.estado.stringValue, 'pendiente');
  assert.equal((await decidir(producto, admin, 'oculto', 'Corregir ficha', medida, [cierre(prodId, 'resuelto', medida)])).status, 200);
  assert.equal((await leer(producto)).status, 403);
  assert.equal((await commit(otra, alta(randomUUID(), otra, 'muestra'))).status, 403);
  const suspension = randomUUID();
  assert.equal((await decidir(tienda, admin, 'suspendido', 'Corregir contacto', suspension, [cierre(nuevo, 'resuelto', suspension)])).status, 200);
  assert.equal((await leer(tienda)).status, 403);
  assert.equal((await commit(comprador, alta(randomUUID(), comprador))).status, 403);
  assert.equal((await commit(admin, [cierre(nuevo, 'descartado')])).status, 403);
});

function decidir(tienda, admin, estado, motivo = 'Datos revisados', id = randomUUID(), adicionales = []) {
  const base = 'projects/' + proyecto + '/databases/(default)/documents/';
  const texto = stringValue => ({ stringValue });
  const fecha = [{ fieldPath: 'fecha', setToServerValue: 'REQUEST_TIME' }];
  const comunes = { estado: texto(estado), motivo: texto(motivo) };
  const writes = [
    { update: { name: base + tienda, fields: { estado: texto(estado) } }, updateMask: { fieldPaths: ['estado'] } },
    { update: { name: base + 'decisiones/' + id, fields: { ...comunes, actor: texto(admin.localId), ruta: texto(tienda) } }, updateTransforms: fecha },
    { update: { name: base + tienda + '/revision/actual', fields: { ...comunes, decisionId: texto(id) } }, updateTransforms: fecha },
  ];
  return fetch(documentos + ':commit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + admin.idToken },
    body: JSON.stringify({ writes: [...writes, ...adicionales] }),
  });
}

test('el directorio público encuentra negocios aprobados sin productos', async () => {
  const ids = {};
  for (const estado of ['aprobado', 'pendiente', 'suspendido', 'rechazado']) {
    ids[estado] = randomUUID();
    assert.equal((await escribir('emprendimientos/' + ids[estado], { nombre: 'Tejidos del Sur', estado }, 'owner')).status, 200);
  }
  const consulta = { from: [{ collectionId: 'emprendimientos' }], where: {
    fieldFilter: { field: { fieldPath: 'estado' }, op: 'EQUAL', value: { stringValue: 'aprobado' } }
  } };
  const respuesta = await fetch(documentos + ':runQuery', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: consulta }),
  });
  assert.equal(respuesta.status, 200);
  const resultados = (await respuesta.json()).map(fila => fila.document?.name.split('/').at(-1));
  for (const [estado, id] of Object.entries(ids)) {
    assert.equal(resultados.includes(id), estado === 'aprobado');
  }
});

test('solo la cuenta titular puede editar su emprendimiento', async () => {
  const titular = await cuenta();
  const otra = await cuenta();
  const ruta = 'emprendimientos/' + titular.localId;
  const negocio = { nombre: 'Demo', descripcion: 'Prueba local', localidad: 'Río Gallegos', whatsapp: '5490000000000', estado: 'pendiente' };
  assert.equal((await escribir(ruta, negocio, titular.idToken)).status, 200);
  assert.equal((await escribir(ruta, { ...negocio, nombre: 'Edición propia' }, titular.idToken)).status, 200);
  assert.equal((await escribir(ruta, { ...negocio, nombre: 'Edición ajena' }, otra.idToken)).status, 403);
});

test('un visitante puede leer un producto publicado y tiene restringido el oculto', async () => {
  const ruta = 'emprendimientos/' + randomUUID();
  // La identidad de administración del emulador permite preparar los documentos de prueba.
  assert.equal((await escribir(ruta, { estado: 'aprobado' }, 'owner')).status, 200);
  for (const estado of ['publicado', 'oculto']) {
    const producto = ruta + '/productos/' + estado;
    assert.equal((await escribir(producto, { estado }, 'owner')).status, 200);
    const respuesta = await fetch(documentos + '/' + producto);
    assert.equal(respuesta.status, estado === 'publicado' ? 200 : 403);
  }
});

test('la aprobación habilita la publicación y administración puede ocultarla', async () => {
  const titular = await cuenta();
  const admin = await cuenta();
  const tienda = 'emprendimientos/' + titular.localId;
  const negocio = { nombre: 'Taller', descripcion: 'Demo local', localidad: 'Río Gallegos', whatsapp: '5490000000000', estado: 'pendiente' };
  assert.equal((await escribir(tienda, negocio, titular.idToken)).status, 200);
  assert.equal((await escribir('administradores/' + admin.localId, { etiqueta: 'demo' }, 'owner')).status, 200);

  const rutaProducto = tienda + '/productos/muestra';
  const campos = {
    nombre: { stringValue: 'Budín' }, descripcion: { stringValue: 'Producto de prueba' },
    categoria: { stringValue: 'Alimentos' }, imagen: { stringValue: 'budin' },
    stock: { integerValue: '2' }, precioCentavos: { integerValue: '170000' },
    estado: { stringValue: 'publicado' },
  };
  function publicar() {
    return fetch(documentos + ':commit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + titular.idToken },
      body: JSON.stringify({ writes: [{
        update: { name: 'projects/' + proyecto + '/databases/(default)/documents/' + rutaProducto, fields: campos },
        updateTransforms: [{ fieldPath: 'creadoEn', setToServerValue: 'REQUEST_TIME' }],
      }] }),
    });
  }
  assert.equal((await publicar()).status, 403);
  assert.equal((await decidir(tienda, admin, 'aprobado')).status, 200);
  assert.equal((await publicar()).status, 200);
  assert.equal((await fetch(documentos + '/' + rutaProducto)).status, 200);
  assert.equal((await escribir(rutaProducto + '?updateMask.fieldPaths=estado', { estado: 'oculto' }, admin.idToken)).status, 403);
  assert.equal((await decidir(rutaProducto, admin, 'oculto')).status, 200);
  assert.equal((await fetch(documentos + '/' + rutaProducto)).status, 403);
});

test('solo administración resuelve la revisión de un producto oculto', async () => {
  const [titular, admin, otra] = await Promise.all([cuenta(), cuenta(), cuenta()]);
  const tienda = 'emprendimientos/' + titular.localId;
  const producto = tienda + '/productos/tejido';
  const privado = producto + '/revision/actual';
  await escribir(tienda, { estado: 'aprobado' }, 'owner');
  await escribir('administradores/' + admin.localId, {}, 'owner');
  const fields = {
    nombre: { stringValue: 'Tejido' }, descripcion: { stringValue: 'Lana' }, imagen: { stringValue: 'general' },
    categoria: { stringValue: 'Textil' }, stock: { integerValue: '2' }, precioCentavos: { integerValue: '10000' },
    creadoEn: { timestampValue: '2026-01-01T00:00:00Z' }, estado: { stringValue: 'publicado' }
  };
  const inicial = await fetch(documentos + '/' + producto, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, body: JSON.stringify({ fields }) });
  assert.equal(inicial.status, 200);
  function cambiar(datos, cuenta) {
    const mascara = new URLSearchParams(Object.keys(datos).map(campo => ['updateMask.fieldPaths', campo]));
    return escribir(producto + '?' + mascara, datos, cuenta.idToken);
  }
  const leer = (ruta, cuenta) => fetch(documentos + '/' + ruta, cuenta ? { headers: { Authorization: 'Bearer ' + cuenta.idToken } } : {});
  assert.equal((await decidir(producto, admin, 'oculto', 'Aclarar el material')).status, 200);
  assert.equal((await leer(producto)).status, 403);
  assert.equal((await leer(privado)).status, 403);
  assert.equal((await leer(privado, otra)).status, 403);
  assert.equal((await (await leer(privado, titular)).json()).fields.motivo.stringValue, 'Aclarar el material');
  for (const estado of ['publicado', 'archivado']) assert.equal((await cambiar({ estado }, titular)).status, 403);
  assert.equal((await cambiar({ descripcion: 'Lana de oveja' }, titular)).status, 200);
  assert.equal((await (await leer(producto, titular)).json()).fields.estado.stringValue, 'oculto');
  assert.equal((await cambiar({ estado: 'pendiente_revision' }, otra)).status, 403);
  assert.equal((await cambiar({ estado: 'pendiente_revision' }, titular)).status, 200);
  assert.equal((await leer(producto)).status, 403);
  assert.equal((await cambiar({ nombre: 'Otro' }, titular)).status, 403);
  assert.equal((await cambiar({ estado: 'publicado' }, titular)).status, 403);
  assert.equal((await decidir(producto, admin, 'oculto', 'Precisar la composición')).status, 200);
  assert.equal((await (await leer(privado, titular)).json()).fields.motivo.stringValue, 'Precisar la composición');
  assert.equal((await cambiar({ estado: 'pendiente_revision' }, titular)).status, 200);
  await escribir(tienda, { estado: 'suspendido' }, 'owner');
  assert.equal((await decidir(producto, admin, 'publicado')).status, 403);
  await escribir(tienda, { estado: 'aprobado' }, 'owner');
  assert.equal((await decidir(producto, admin, 'publicado')).status, 200);
  const visible = (await (await leer(producto)).json()).fields;
  assert.equal(visible.descripcion.stringValue, 'Lana de oveja');
  assert.equal(visible.motivo, undefined);
  assert.equal((await leer(privado)).status, 403);
  assert.equal((await cambiar({ estado: 'archivado' }, titular)).status, 200);
  for (const estado of ['publicado', 'pendiente_revision']) assert.equal((await cambiar({ estado }, titular)).status, 403);
});

test('rechazar, corregir, reenviar y aprobar conserva la privacidad y el historial', async () => {
  const [titular, otra, admin] = await Promise.all([cuenta(), cuenta(), cuenta()]);
  const tienda = 'emprendimientos/' + titular.localId;
  const revision = tienda + '/revision/actual';
  const negocio = { nombre: 'Feria', descripcion: 'Tejidos', localidad: 'Santa Cruz', whatsapp: '5490000000000', estado: 'pendiente' };
  const editar = (datos, persona) => escribir(tienda, { ...negocio, ...datos }, persona.idToken);
  const leer = (ruta, persona) => fetch(documentos + '/' + ruta, persona ? { headers: { Authorization: 'Bearer ' + persona.idToken } } : {});
  assert.equal((await editar({}, titular)).status, 200);
  assert.equal((await escribir('administradores/' + admin.localId, {}, 'owner')).status, 200);
  assert.equal((await editar({ estado: 'rechazado' }, admin)).status, 403);
  const id = randomUUID();
  assert.equal((await decidir(tienda, admin, 'rechazado', 'Indicá tu localidad.', id)).status, 200);
  const aviso = await (await leer(revision, titular)).json();
  assert.equal(aviso.fields.motivo.stringValue, 'Indicá tu localidad.');
  assert.ok(aviso.fields.fecha.timestampValue);
  assert.equal((await leer(revision, otra)).status, 403);
  assert.equal((await leer('decisiones/' + id, titular)).status, 403);
  assert.equal((await escribir(revision, { motivo: 'Otro' }, titular.idToken)).status, 403);
  assert.equal((await editar({ estado: 'aprobado' }, titular)).status, 403);
  assert.equal((await editar({}, otra)).status, 403);
  assert.equal((await editar({ localidad: 'El Calafate' }, titular)).status, 403);
  assert.equal((await editar({ localidad: 'El Calafate', estado: 'rechazado' }, titular)).status, 200);
  assert.equal((await editar({ localidad: 'El Calafate' }, titular)).status, 200);
  assert.equal((await leer(tienda)).status, 403);
  assert.equal((await decidir(tienda, admin, 'aprobado')).status, 200);
  assert.equal((await leer(tienda)).status, 200);
  assert.equal((await leer(revision)).status, 403);
  assert.equal((await leer('decisiones/' + id, admin)).status, 200);
  assert.equal((await decidir(tienda, admin, 'suspendido')).status, 200);
  assert.equal((await editar({ localidad: 'El Calafate' }, titular)).status, 403);
});

test('un rechazo anterior permite recuperar el motivo histórico y reenviar aun sin aviso', async () => {
  const [titular, admin] = await Promise.all([cuenta(), cuenta()]);
  const tienda = 'emprendimientos/' + titular.localId;
  const revision = tienda + '/revision/actual';
  const negocio = { nombre: 'Feria', descripcion: 'Tejidos', localidad: 'Santa Cruz', whatsapp: '5490000000000', estado: 'rechazado' };
  await escribir(tienda, negocio, 'owner');
  await escribir('administradores/' + admin.localId, {}, 'owner');
  const id = randomUUID();
  const fields = { estado: { stringValue: 'rechazado' }, motivo: { stringValue: 'Precisá la localidad' }, fecha: { timestampValue: '2026-01-01T00:00:00Z' } };
  function guardar(ruta, campos, token) {
    return fetch(documentos + '/' + ruta, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ fields: campos }) });
  }
  await guardar('decisiones/' + id, { ...fields, ruta: { stringValue: tienda }, actor: { stringValue: admin.localId } }, 'owner');
  const aviso = { ...fields, decisionId: { stringValue: id } };
  assert.equal((await guardar(revision, { ...aviso, motivo: { stringValue: 'Distinto' } }, admin.idToken)).status, 403);
  assert.equal((await guardar(revision, aviso, admin.idToken)).status, 200);
  const otro = await cuenta();
  const antigua = 'emprendimientos/' + otro.localId;
  await escribir(antigua, negocio, 'owner');
  assert.equal((await escribir(antigua, { ...negocio, estado: 'pendiente' }, otro.idToken)).status, 200);
});
