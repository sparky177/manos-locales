export function credenciales(correo, clave, registro) {
  const email = correo.trim();
  if (!email || !clave) throw Error('Completá el correo y la contraseña.');
  if (registro && clave.length < 6) throw Error('Usá una contraseña de al menos 6 caracteres.');
  return { correo: email, clave };
}
