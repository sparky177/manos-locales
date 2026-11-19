import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { credenciales } from '../../js/validaciones/cuenta.validator.js';
import { imagenes } from '../../js/config/catalogos.js';
import { rutaImagen } from '../../js/datos/archivos.repository.js';

test('cada identificador guardado en Firestore encuentra su imagen después de la mudanza', () => {
  for (const id of Object.keys(imagenes)) {
    const archivo = new URL('../../public' + rutaImagen(id), import.meta.url);
    assert.ok(existsSync(archivo), id);
  }
  assert.equal(rutaImagen('desconocida'), rutaImagen('general'));
});

test('el registro valida la contraseña y preserva los caracteres que ingresó el usuario', () => {
  assert.throws(() => credenciales('demo@example.test', '123', true));
  assert.deepEqual(credenciales(' demo@example.test ', ' abcde', true), {
    correo: 'demo@example.test', clave: ' abcde',
  });
});
