# Manos Locales

Catálogo de emprendimientos de Santa Cruz. La web se ejecuta en la computadora del equipo. El navegador usa Firebase Authentication y Cloud Firestore del proyecto Spark. El exportado de Figma queda como referencia en la carpeta hermana «Panel de Inicio».

## Iniciar la web

Desde esta carpeta con Node instalado, ejecutar `npm start` y abrir [el catálogo](http://localhost:5173). El servidor utiliza los módulos incluidos en Node. Las páginas requieren internet para cargar el SDK web de Firebase y acceder al proyecto. Ejecutar `npm test` para comprobar las reglas de negocio de JavaScript.

## Conectar el proyecto del grupo

La versión de la exposición ya usa el proyecto `spark-ca470`. Para ejecutarla en otra computadora alcanza con iniciar la web como se indica arriba. Los pasos siguientes documentan la configuración de Firebase y las pruebas por rol.

1. Crear un proyecto Spark en la [consola Firebase](https://console.firebase.google.com/) y registrar una aplicación web. Copiar su objeto de configuración pública en `sitio/js/config/proyecto.js` como valor de `firebaseConfig`.
2. En Authentication habilitar el proveedor **Correo electrónico/contraseña**. En la configuración de dominios autorizados comprobar y, si corresponde, agregar `localhost`.
3. Crear Cloud Firestore en modo producción. En la pestaña Reglas copiar el contenido completo de `firestore.rules` y publicar. También se pueden desplegar las reglas con la CLI mediante `firebase deploy --only firestore:rules --project ID_DEL_PROYECTO`.
4. Registrar dos cuentas de prueba desde Mi cuenta. Reservar una para administración. En Authentication copiar su UID. Desde Firestore en la consola crear la colección `administradores` y un documento con ese UID exacto como ID y el campo `etiqueta` de tipo string con valor `demo`. La existencia del documento concede administración. Mantener esta operación en la consola del responsable.
5. Ingresar con la otra cuenta, solicitar el alta del emprendimiento con un número comercial acordado para la demo y abrir un segundo perfil de navegador para la cuenta admin. En Mi cuenta → Ir a administración, aprobar. Recargar el panel del propietario y publicar un producto.
6. Desde una ventana sin sesión, abrir el catálogo, buscar por localidad y categoría, consultar el producto y verificar el enlace a WhatsApp. Los listados se actualizan al cargar la página. Suspender el negocio u ocultar el producto, recargar el catálogo y comprobar que la publicación desaparece.
7. Verificar con otra cuenta común que la administración queda restringida. En una prueba de reglas comprobar por separado que esa cuenta no puede escribir en la ruta del propietario original y que un visitante no puede leer su producto oculto ni siquiera por ID. Registrar la fecha, versión y resultado real.

## Prueba funcional

El 18 de noviembre de 2026 el equipo comprobó el recorrido con Firebase desde la web local. La administradora aprobó GatoNegro y la persona titular vio el cambio al recargar su panel. Publicó un producto, verificó que apareciera en el catálogo y abrió el contacto por WhatsApp. También probó ocultar un producto desde administración y confirmó que desaparecía del catálogo al recargarlo.


## Árbol de la aplicación

```text
manos-locales/
├── sitio/                       Archivos que entrega el servidor al navegador
│   ├── index.html               Catálogo y filtros
│   ├── html/
│   │   ├── producto.html        Ficha y contacto por WhatsApp
│   │   ├── emprendimiento.html  Perfil público y productos publicados
│   │   ├── acceso.html, registro.html, cuenta.html
│   │   ├── panel-emprendedor.html, panel-admin.html
│   │   └── panel.html, admin.html     Redirecciones de enlaces anteriores
│   ├── css/
│   │   ├── variables.css, base.css, componentes.css
│   │   └── catalogo.css, acceso.css, paneles.css
│   ├── assets/                  Marca y galería de imágenes
│   └── js/
│       ├── inicio.js            Sesión, acceso a la pantalla y carga del controlador
│       ├── config/              Proyecto Firebase, SDK y opciones de la galería
│       ├── datos/               Repositorios de usuarios, emprendimientos y productos
│       ├── servicios/           Sesión, filtros, catálogo, fichas y moderación
│       ├── validaciones/        Campos del negocio y del producto
│       ├── ui/                  Controles, mensajes y tarjetas reutilizables
│       ├── paginas/             Eventos y presentación de cada pantalla
│       └── utilidades/          Formato en pesos y enlace a WhatsApp
├── firestore.rules, firebase.json
├── tests/                       Validaciones y reglas de negocio de JavaScript
├── docs/                        Requisitos, decisiones y modelo de datos
└── servidor.mjs, package.json, README.md
```

El servidor publica únicamente `sitio/`. Node sirve archivos y ejecuta las pruebas. Los módulos de JavaScript se cargan directamente en el navegador. Acceso y registro comparten el controlador del formulario de credenciales. Ambos paneles comparten los estilos de formularios y estados. Cada producto guarda el identificador de una imagen incluida en la galería.

## Recorrido sugerido para cuatro integrantes

| Parte | Qué mostrar | Dónde seguir la operación |
|---|---|---|
| Catálogo y diseño | Filtrar, abrir una ficha y visitar el emprendimiento | `paginas/inicio.js` aplica el filtro y `ui/productos.ui.js` construye la tarjeta. `css/catalogo.css` adapta la portada y las fichas a la pantalla. |
| Cuentas y permisos | Ingresar y explicar por qué cada cuenta ve un panel distinto | `servicios/sesion.service.js` obtiene la identidad de Authentication. `datos/usuarios.repository.js` consulta el rol. Firestore vuelve a comprobar los permisos en cada operación. |
| Publicación | Guardar un precio y encontrar el documento en Firestore | `paginas/panel-emprendedor.js` recibe el formulario. `validaciones/producto.validator.js` convierte pesos a centavos. `datos/productos.repository.js` guarda el producto en el emprendimiento de la cuenta. |
| Moderación y Git | Ocultar un producto, recargar el catálogo y comparar las versiones en GitHub | `servicios/moderacion.service.js` guarda el estado y la decisión en una escritura atómica. El catálogo consulta emprendimientos aprobados y productos publicados. |

El [modelo de datos](docs/modelo.md) contiene las colecciones, los permisos y ejemplos de documentos. La versión probada antes de la reorganización está en el commit `f3a9b65`. La reorganización conserva las colecciones, los identificadores de documentos y las reglas de Firebase.

## GitHub

El [repositorio del equipo](https://github.com/sparky177/manos-locales) contiene el proyecto. La rama `frontend-modular` reúne el cambio de estructura y de presentación para poder compararlo con `main`. Al compartir una versión, indiquen la rama o el commit utilizado para la demostración.
