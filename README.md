# Manos Locales

Catálogo de emprendimientos de Santa Cruz. La web se ejecuta en la computadora del equipo. El navegador usa Firebase Authentication y Cloud Firestore del proyecto Spark. El exportado de Figma queda como referencia en la carpeta hermana «Panel de Inicio».

## Iniciar la web

Con Node compatible con Vite 8 (20.19+, 22.12+ o una versión posterior compatible), ejecutar desde la raíz del repositorio:

```sh
npm ci
npm start
```

Abrir [el catálogo](http://localhost:5173/). Vite sirve las ocho pantallas HTML en desarrollo. El navegador necesita internet para acceder al SDK de Firebase, Authentication y Firestore. Para generar la versión distribuible en `dist/`, ejecutar `npm run build`. Para abrir esa compilación en el puerto 4173, ejecutar `npm run preview`.

## Conectar el proyecto del grupo

La versión de la exposición ya usa el proyecto `spark-ca470`. Para ejecutarla en otra computadora alcanza con iniciar la web como se indica arriba. Los pasos siguientes documentan la configuración de Firebase y las pruebas por rol.

1. Crear un proyecto Spark en la [consola Firebase](https://console.firebase.google.com/) y registrar una aplicación web. Para otro proyecto, copiar `.env.example` a `.env.local`, reemplazar allí el objeto público `VITE_FIREBASE_CONFIG` y reiniciar Vite. La configuración predeterminada del grupo está en `js/config/firebase.js`.
2. En Authentication habilitar el proveedor **Correo electrónico/contraseña**. En la configuración de dominios autorizados comprobar y, si corresponde, agregar `localhost`.
3. Crear Cloud Firestore en modo producción. En la pestaña Reglas copiar el contenido completo de `firebase/firestore.rules` y publicar. También se pueden desplegar las reglas con la CLI mediante `firebase deploy --only firestore:rules --project ID_DEL_PROYECTO`.
4. Registrar dos cuentas de prueba desde Mi cuenta. Reservar una para administración. En Authentication copiar su UID. Desde Firestore en la consola crear la colección `administradores` y un documento con ese UID exacto como ID y el campo `etiqueta` de tipo string con valor `demo`. La existencia del documento concede administración. Mantener esta operación en la consola del responsable.
5. Ingresar con la otra cuenta, solicitar el alta del emprendimiento con un número comercial acordado para la demo y abrir un segundo perfil de navegador para la cuenta admin. En Mi cuenta → Ir a administración, aprobar. Recargar el panel del propietario y publicar un producto.
6. Desde una ventana sin sesión, abrir el catálogo, buscar por localidad y categoría, consultar el producto y verificar el enlace a WhatsApp. Los listados se actualizan al cargar la página. Suspender el negocio u ocultar el producto, recargar el catálogo y comprobar que la publicación desaparece.
7. Verificar con otra cuenta común que la administración queda restringida. En una prueba de reglas comprobar por separado que esa cuenta no puede escribir en la ruta del propietario original y que un visitante no puede leer su producto oculto ni siquiera por ID. Registrar la fecha, versión y resultado real.

## Prueba funcional

El 18 de noviembre de 2026 el equipo comprobó el recorrido con Firebase desde la web local. La administradora aprobó GatoNegro y la persona titular vio el cambio al recargar su panel. Publicó un producto, verificó que apareciera en el catálogo y abrió el contacto por WhatsApp. También probó ocultar un producto desde administración y confirmó que desaparecía del catálogo al recargarlo.


## Árbol de la aplicación

```text
manos-locales/
├── index.html
├── html/
│   ├── producto.html
│   ├── emprendimiento.html
│   ├── acceso.html
│   ├── registro.html
│   ├── cuenta.html
│   ├── panel-emprendedor.html
│   └── panel-admin.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── componentes.css
│   ├── catalogo.css
│   ├── acceso.css
│   ├── emprendedor.css
│   └── admin.css
├── js/
│   ├── config/
│   │   ├── firebase.js
│   │   └── catalogos.js
│   ├── datos/
│   │   ├── usuarios.repository.js
│   │   ├── emprendimientos.repository.js
│   │   ├── productos.repository.js
│   │   └── archivos.repository.js
│   ├── servicios/
│   │   ├── sesion.service.js
│   │   ├── emprendimientos.service.js
│   │   ├── productos.service.js
│   │   └── moderacion.service.js
│   ├── validaciones/
│   │   ├── cuenta.validator.js
│   │   ├── emprendimiento.validator.js
│   │   └── producto.validator.js
│   ├── ui/
│   │   ├── navegacion.ui.js
│   │   ├── mensajes.ui.js
│   │   ├── productos.ui.js
│   │   ├── emprendimiento.ui.js
│   │   └── admin.ui.js
│   ├── paginas/
│   │   ├── inicio.js
│   │   ├── producto.js
│   │   ├── emprendimiento.js
│   │   ├── acceso.js
│   │   ├── registro.js
│   │   ├── cuenta.js
│   │   ├── panel-emprendedor.js
│   │   └── panel-admin.js
│   └── utilidades/
│       ├── moneda.js
│       └── whatsapp.js
├── public/assets/
│   ├── imagenes/
│   ├── iconos/
│   └── fuentes/
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
├── tests/
│   ├── validaciones/
│   └── reglas/
├── docs/
├── .env.example
├── .gitignore
├── firebase.json
├── vite.config.js
├── package.json
├── package-lock.json
└── README.md
```

Cada HTML carga la navegación común, que resuelve la sesión y abre el controlador correspondiente en `js/paginas/`. Los servicios coordinan las operaciones, los repositorios acceden a los datos y los módulos de `ui/` actualizan el DOM. `archivos.repository.js` traduce el identificador guardado en Firestore a una imagen de la galería local. `fuentes/` queda disponible para las tipografías del diseño. Las reglas de Storage cierran el acceso y las consultas actuales usan los índices automáticos de Firestore.

## Pruebas

`npm test` ejecuta las validaciones y las pruebas de la galería. Para probar los permisos en un proyecto local aislado, iniciar los emuladores de Authentication y Firestore con Firebase CLI y Java compatible. Desde la raíz, ejecutar `firebase emulators:exec --only auth,firestore --project demo-manos-locales "npm run test:reglas"`. Las pruebas se conectan a los puertos locales 9099 y 8080. [Guía de emuladores de Firebase](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## Recorrido sugerido para cuatro integrantes

Con el árbol nuevo pasaron siete pruebas de validación, catálogo y galería, y tres pruebas de permisos con los emuladores. En el navegador se comprobó la carga del catálogo real, el enlace a WhatsApp de la ficha y la apertura del panel con la sesión existente. La compilación de Vite también cargó los productos como visitante.

| Parte | Qué mostrar | Dónde seguir la operación |
|---|---|---|
| Catálogo y diseño | Filtrar, abrir una ficha y visitar el emprendimiento | `paginas/inicio.js` aplica el filtro y `ui/productos.ui.js` construye la tarjeta. `css/catalogo.css` adapta la portada y las fichas a la pantalla. |
| Cuentas y permisos | Ingresar y explicar por qué cada cuenta ve un panel distinto | `servicios/sesion.service.js` obtiene la identidad de Authentication. `datos/usuarios.repository.js` consulta el rol. Firestore vuelve a comprobar los permisos en cada operación. |
| Publicación | Guardar un precio y encontrar el documento en Firestore | `js/paginas/panel-emprendedor.js` recibe el formulario y llama a `js/servicios/productos.service.js`. `validaciones/producto.validator.js` convierte pesos a centavos. `datos/productos.repository.js` guarda el producto en el emprendimiento de la cuenta. |
| Moderación y Git | Ocultar un producto, recargar el catálogo y comparar las versiones en GitHub | `servicios/moderacion.service.js` guarda el estado y la decisión en una escritura atómica. El catálogo consulta emprendimientos aprobados y productos publicados. |

El [modelo de datos](docs/modelo.md) contiene las colecciones, los permisos y ejemplos de documentos. La versión probada antes de la reorganización está en el commit `f3a9b65`. La reorganización conserva las colecciones, los identificadores de documentos y las reglas de Firebase.

## GitHub

El [repositorio del equipo](https://github.com/sparky177/manos-locales) contiene el proyecto en `main`. La reorganización se desarrolló en `frontend-modular`. Para la defensa pueden comparar el árbol actual con el commit `f3a9b65` y seguir los cambios de cada módulo.
