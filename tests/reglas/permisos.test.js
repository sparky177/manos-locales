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
  assert.equal((await escribir(tienda, { ...negocio, estado: 'aprobado' }, admin.idToken)).status, 200);
  assert.equal((await publicar()).status, 200);
  assert.equal((await fetch(documentos + '/' + rutaProducto)).status, 200);
  assert.equal((await escribir(rutaProducto + '?updateMask.fieldPaths=estado', { estado: 'oculto' }, admin.idToken)).status, 200);
  assert.equal((await fetch(documentos + '/' + rutaProducto)).status, 403);
});
