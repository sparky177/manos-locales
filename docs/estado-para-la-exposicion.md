# Manos Locales · Inventario para la exposición

Revisión del 22 de noviembre de 2026 sobre la versión `cf88df5` de `main`. La web conecta a quienes buscan productos en Santa Cruz con quienes los ofrecen. El contacto comercial ocurre en WhatsApp. El equipo puede demostrar el recorrido completo con tres vistas y dos cuentas.

## 1. Qué podemos mostrar hoy

| Vista | Funciones implementadas | Demostración |
|---|---|---|
| Visitante | Catálogo público, búsqueda por nombre de producto o emprendimiento, filtros combinables por categoría y localidad, ficha de producto, perfil público del negocio y contacto por WhatsApp. | Buscar un producto, abrir la ficha, comprobar el precio y el stock, visitar el negocio y abrir el enlace con el mensaje preparado. |
| Cuenta personal | Registro, ingreso y cierre de sesión con correo y contraseña. La misma cuenta puede recorrer el catálogo y solicitar un emprendimiento. | Entrar y salir desde Mi cuenta. Explicar que Authentication verifica la identidad y entrega el UID. |
| Emprendimiento | Una solicitud por cuenta, estado de aprobación y edición de los datos comerciales. Una vez aprobado, el titular puede publicar, editar y retirar productos, elegir una imagen de galería y actualizar el stock. | Mostrar el estado pendiente, aprobar desde otra cuenta, recargar el panel y publicar un producto. Un contacto por WhatsApp conserva el stock. |
| Administración | Acceso asignado desde Firebase, revisión de solicitudes, aprobación, rechazo, suspensión, reactivación y ocultamiento de productos. El panel guarda el motivo, el autor y la fecha junto al cambio de estado. | Ocultar una segunda publicación y volver a cargar el catálogo. Mostrar la decisión en Firestore y el resultado desde la vista pública. |

## 2. Dónde vive cada parte

| Ubicación | Qué conviene explicar |
|---|---|
| `index.html` y `html/` | Ocho pantallas en total. Catálogo, producto, emprendimiento público, acceso, registro, cuenta, panel emprendedor y panel administrativo. |
| `css/` y `public/assets/` | Variables de diseño, componentes comunes, estilos por pantalla, marca y galería. El exportado de Figma sirve de referencia visual. |
| `js/paginas/` y `js/ui/` | Los controladores responden a las acciones del usuario. Los módulos de interfaz muestran formularios, tarjetas, navegación y mensajes. |
| `js/servicios/` y `js/validaciones/` | Coordinan sesión, publicación y moderación, y comprueban campos como precio, stock e imagen. |
| `js/config/`, `js/datos/` y `js/utilidades/` | Inicializan Firebase, acceden a los documentos, resuelven la imagen local y dan formato al precio y al enlace de WhatsApp. |
| `firebase/` | Reglas de autorización y configuración de índices. Firestore comprueba permisos incluso si un usuario evita los controles del formulario. |
| `tests/`, `docs/` y raíz del repositorio | Pruebas de validación y permisos, requisitos, modelo de datos, instrucciones de instalación y configuración de Vite. Git conserva el historial en GitHub. |

**Ejemplo para explicar la modularización.** Al publicar, `js/paginas/panel-emprendedor.js` recoge el formulario. `js/servicios/productos.service.js` pide a `js/validaciones/producto.validator.js` que compruebe los datos y convierta pesos a centavos. `js/datos/productos.repository.js` solicita la escritura. Firestore verifica en `firebase/firestore.rules` que la cuenta sea titular del emprendimiento aprobado.

**Modelo de datos.** Authentication administra las credenciales. Firestore contiene cuatro colecciones principales, `usuarios`, `administradores`, `emprendimientos` y `decisiones`. Los productos forman una subcolección dentro de cada emprendimiento. El UID como identificador del negocio limita cada cuenta a un emprendimiento. El precio se guarda en centavos y la imagen como identificador de galería. [Modelo, ejemplos y diccionario](modelo.md)

## 3. Qué queda por hacer

| Prioridad propuesta | Trabajo | Cómo sabemos que está terminado |
|---|---|---|
| 1. Cerrar el informe | Actualizar el alcance y la matriz de requisitos. El diagnóstico inicial todavía habla de crear Firebase y el repositorio. Identificar lo implementado, lo parcial, lo aplazado y las fechas vigentes. | Cada función prometida tiene una pantalla o una prueba identificable. El informe coincide con el código de la entrega. |
| 2. Pulir el frontend | Comparar las ocho pantallas con Figma. Priorizar el alta, la publicación y la moderación. Revisar móvil, teclado, formularios, errores y confirmaciones de guardado. | Una persona puede completar los tres recorridos de demostración y entender el resultado de cada acción. |
| 3. Resolver diferencias funcionales | Hoy se buscan productos por nombre de negocio. Una búsqueda de negocios como resultado independiente es una ampliación. La localidad admite texto libre. El propietario ve el estado y la administración conserva el motivo, pero falta un recorrido para consultar un rechazo, corregirlo y reenviarlo si el equipo lo incluye. También queda por decidir si el perfil público muestra redes sociales. | El equipo escribe el comportamiento elegido y un ejemplo verificable antes de cambiar datos, reglas o pantallas. |
| 4. Preparar la demostración | Acordar ejemplos representativos de Santa Cruz, preparar dos cuentas, registrar capturas, probar en la computadora de la exposición y ensayar los pases entre integrantes. | En una misma sesión se demuestra aprobación, publicación, contacto y moderación. Cada integrante puede explicar el módulo que usa. |

**Ampliaciones por elegir.** Recuperación de contraseña, favoritos sincronizados, historial de contactos consultados, reportes con resolución administrativa, notificaciones, destacados seleccionados y fotos propias. Un clic en WhatsApp solo permite registrar la intención de contacto. Las fotos propias requieren definir almacenamiento, permisos y costos compatibles con el presupuesto. Pagos, pedidos internos, logística, chat, reseñas y estadísticas de ventas quedan fuera del alcance acordado.

## 4. Cómo repartir los 80 minutos

| Tiempo orientativo | Responsable | Contenido |
|---|---|---|
| 15 min | Integrante 1 | Problema, usuarios, alcance y decisiones de diseño. Mostrar Figma y el catálogo funcional. |
| 20 min | Integrante 2 | Recorrido en vivo desde la solicitud hasta el contacto por WhatsApp. Mostrar el cambio de vista entre cuenta emprendedora, administración y visitante. |
| 20 min | Integrante 3 | Árbol de archivos, módulos, Vite y GitHub. Seguir una publicación desde el formulario hasta el repositorio de datos y mostrar el cambio correspondiente en Git. |
| 15 min | Integrante 4 | Authentication, modelo de Firestore, permisos, moderación y pruebas. Demostrar el ocultamiento de un producto. |
| 10 min | Equipo | Preguntas y margen para repetir una parte de la demostración. |

**Evidencia.** El 22 de noviembre se repitieron las siete pruebas de validación, catálogo y galería y la compilación de Vite. Las tres pruebas de permisos pasaron en la verificación anterior con emuladores. El equipo también confirmó en Firebase real el alta, la aprobación, la publicación, el contacto y la moderación.
