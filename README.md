# Manos Locales

Catálogo de emprendimientos de Santa Cruz. La web se ejecuta en la computadora del equipo. El navegador usa Firebase Authentication y Cloud Firestore del proyecto Spark. El exportado de Figma queda como referencia en la carpeta hermana «Panel de Inicio».

## Iniciar la web

Desde esta carpeta con Node instalado, ejecutar `npm start` y abrir [el catálogo](http://localhost:5173). El servidor utiliza los módulos incluidos en Node. Las páginas requieren internet para cargar el SDK web de Firebase y acceder al proyecto. Ejecutar `npm test` para comprobar las reglas de negocio de JavaScript.

## Conectar el proyecto del grupo

1. Crear un proyecto Spark en la [consola Firebase](https://console.firebase.google.com/) y registrar una aplicación web. Copiar su objeto de configuración pública en `sitio/js/config.js` como valor de `firebaseConfig`.
2. En Authentication habilitar el proveedor **Correo electrónico/contraseña**. En la configuración de dominios autorizados comprobar y, si corresponde, agregar `localhost`.
3. Crear Cloud Firestore en modo producción. En la pestaña Reglas copiar el contenido completo de `firestore.rules` y publicar. También se pueden desplegar las reglas con la CLI mediante `firebase deploy --only firestore:rules --project ID_DEL_PROYECTO`.
4. Registrar dos cuentas de prueba desde Mi cuenta. Reservar una para administración. En Authentication copiar su UID. Desde Firestore en la consola crear la colección `administradores` y un documento con ese UID exacto como ID y el campo `etiqueta` de tipo string con valor `demo`. La existencia del documento concede administración. Mantener esta operación en la consola del responsable.
5. Ingresar con la otra cuenta, solicitar el alta del emprendimiento con un número comercial acordado para la demo y abrir un segundo perfil de navegador para la cuenta admin. En Mi cuenta → Ir a administración, aprobar. Recargar el panel del propietario y publicar un producto.
6. Desde una ventana sin sesión, abrir el catálogo, buscar por localidad y categoría, consultar el producto y verificar el enlace a WhatsApp. Los listados se actualizan al cargar la página. Suspender el negocio u ocultar el producto, recargar el catálogo y comprobar que la publicación desaparece.
7. Verificar con otra cuenta común que la administración queda restringida. En una prueba de reglas comprobar por separado que esa cuenta no puede escribir en la ruta del propietario original y que un visitante no puede leer su producto oculto ni siquiera por ID. Registrar la fecha, versión y resultado real.

## Archivos y recorrido para la defensa

| Ruta | Responsabilidad |
|---|---|
| sitio/index.html y sitio/html/ | Catálogo, acceso, perfil del emprendimiento y administración |
| sitio/css/base.css y sitio/assets/ | Presentación adaptable y galería incluida |
| sitio/js/paginas/ | Cada página enlaza eventos, consultas y presentación |
| sitio/js/dominio.js | Validación de datos, conversión de pesos a centavos, búsqueda y WhatsApp |
| sitio/js/interfaz.js | Controles de formulario, mensajes y prevención de doble envío |
| sitio/js/sesion.js | Registro, inicio y cierre de sesión |
| sitio/js/datos.js | Único acceso a documentos y colecciones |
| sitio/js/firebase.js y config.js | Inicialización y parámetros públicos del proyecto |
| firestore.rules | Autorización y validación que aplica Firestore |
| docs/modelo.md | Justificación, relaciones, ejemplos JSON, diccionario y permisos |

Para explicar la modularización, seguir **Publicar** desde el formulario del panel hasta `producto()`, `publicar()` y la regla de creación. Mostrar el documento persistido tras recargar con otra sesión. Para demostrar control de acceso, ocultar la publicación y repetir la consulta pública.

## Entrega en GitHub

Usar esta carpeta como raíz del repositorio. Versionar el sitio, las reglas, las pruebas y este informe. Para registrar los cambios siguientes, revisar `git status`, preparar los archivos con `git add .` y registrar con `git commit -m "Implementar catálogo y gestión de emprendimientos"`. Cuando el grupo cree el repositorio vacío, vincular su URL con `git remote add origin URL` y subir con `git push -u origin main`. Compartir el enlace tras verificar que se puede clonar y ejecutar. El cliente solo utiliza configuración pública de la app web.

Documentación técnica: [SDK modular web](https://firebase.google.com/docs/web/alt-setup), [acceso con correo y contraseña](https://firebase.google.com/docs/auth/web/password-auth), [reglas y consultas](https://firebase.google.com/docs/firestore/security/rules-query).
