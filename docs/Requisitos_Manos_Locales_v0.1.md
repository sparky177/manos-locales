# Requisitos del sistema Manos Locales

Actualización del 10 de noviembre: [Decisiones confirmadas y diagnóstico](04_Decisiones_confirmadas_y_diagnostico.md) resuelve Spark gratuito, demostración local, prioridad del recorrido esencial y una imagen de galería por producto. Esta última decisión reemplaza la propuesta de subir hasta cinco imágenes para la primera entrega. Las opciones anteriores que contradigan esta actualización quedan aplazadas.

## Propósito y alcance

Manos Locales conecta a personas que buscan productos cercanos con emprendimientos de su comunidad. Esta primera versión de requisitos define qué debe hacer la aplicación antes de diseñar las colecciones de Firebase y comenzar la implementación. Servirá como referencia común para el equipo y como apoyo para explicar las decisiones en la exposición del 17 de noviembre de 2026.

Versión 0.1 | 10 de noviembre de 2026 | Equipo de cuatro integrantes

### Base acordada

El sistema será una aplicación web con Firebase obligatorio y responsabilidades distribuidas en módulos. La experiencia incluirá catálogo público, perfiles de emprendimientos, publicación de productos y administración. La cuenta personal permitirá explorar como comprador y gestionar un único emprendimiento, sin cerrar sesión para cambiar de vista.

El contacto comercial se realizará por WhatsApp sin exigir registro. Los pagos y la entrega se coordinarán fuera de la plataforma. El stock será actualizado manualmente por el emprendedor. Los datos de ventas y calificaciones del prototipo se retirarán del alcance inicial.

### Usuarios del sistema

Visitante: puede explorar el catálogo, buscar, filtrar, consultar productos y emprendimientos y abrir el enlace de WhatsApp.

Usuario registrado: dispone de las acciones públicas y de funciones personales propuestas, como favoritos e historial de contactos consultados. La política de reportes queda por confirmar.

Emprendedor: es un usuario registrado con un emprendimiento asociado. Gestiona su perfil y sus productos según el estado de aprobación de su emprendimiento; también puede usar la vista de comprador.

Administrador: revisa solicitudes y modera contenido. Sus permisos no se obtienen eligiendo una opción en el formulario de registro.

### Interpretación de esta versión

Los requisitos identificados con RF, RN y RNF expresan comportamientos verificables. Cuando una función o regla aún necesita una decisión, se indica como propuesta o pendiente. El documento no confirma que el prototipo ya implemente estos requisitos ni que toda su funcionalidad visual deba incluirse en la entrega.

## Requisitos de acceso y catálogo

### RF01 Registro y acceso

La aplicación permitirá crear una cuenta e iniciar y cerrar sesión. Firebase Authentication gestionará las credenciales. La información del perfil personal se separará de las credenciales; no se guardarán contraseñas en documentos de la aplicación.

Criterio de aceptación: una persona registrada puede volver a ingresar; un error de acceso se informa sin abrir un panel privado. El método de acceso y la recuperación de contraseña quedan por confirmar.

### RF02 Catálogo público

La aplicación mostrará productos visibles de emprendimientos aprobados, con nombre, imagen, precio, disponibilidad y referencia al emprendimiento. Las novedades se basarán en la fecha de publicación.

Criterio de aceptación: un visitante puede recorrer el catálogo sin cuenta. Un producto oculto por moderación no aparece en las consultas públicas.

### RF03 Búsqueda y filtros

La aplicación permitirá buscar por nombre y filtrar por categoría y localidad. Los filtros se podrán combinar y restablecer. La búsqueda de emprendimientos también deberá contemplarse, según la experiencia prevista en el prototipo.

Criterio de aceptación: los resultados cumplen los filtros seleccionados; si no hay coincidencias, se muestra un estado vacío y una forma de modificar la búsqueda. El tipo de coincidencia de texto queda pendiente.

### RF04 Ficha de producto y emprendimiento

Cada producto mostrará descripción, precio, imágenes, stock o disponibilidad y acceso al perfil del emprendimiento. El perfil mostrará nombre, descripción, localidad, contacto público, redes disponibles y productos visibles.

Criterio de aceptación: desde un producto puede identificarse quién lo ofrece y acceder a su catálogo. No se muestran datos personales privados del propietario.

### RF05 Contacto por WhatsApp

El botón de contacto abrirá WhatsApp con el número del emprendimiento y un mensaje propuesto que identifique el producto. Estará disponible sin registro.

Criterio de aceptación: el enlace apunta al contacto del emprendimiento correcto y el usuario decide si envía el mensaje. Abrir el enlace no crea un pedido, no confirma una conversación y no descuenta stock.

### RF06 Funciones personales propuestas

Favoritos e historial sincronizado requieren una cuenta. El historial se denominará contactos consultados y registrará la intención de contacto desde la aplicación. Su inclusión para el 17 queda pendiente. Los favoritos locales de visitantes serán opcionales y no deben prometer sincronización.

## Requisitos de gestión y moderación

### RF07 Alta del emprendimiento

Un usuario podrá solicitar el alta de un único emprendimiento e informar sus datos públicos. La solicitud tendrá un estado consultable. Se propone que la administración la apruebe o rechace con un motivo.

Criterio de aceptación: la misma cuenta no puede crear un segundo emprendimiento; el solicitante puede consultar el estado del primero. Los detalles de corrección y reenvío quedan pendientes.

### RF08 Gestión del perfil propio

El propietario podrá editar los campos habilitados de su emprendimiento. La relación de propiedad no se cambia desde el formulario público.

Criterio de aceptación: un usuario no puede modificar el emprendimiento de otra persona, incluso si intenta hacerlo fuera de la interfaz. Falta definir qué cambios requieren una nueva revisión.

### RF09 Gestión de productos

El propietario podrá crear, consultar, editar y retirar sus productos. Se contemplan nombre, descripción, precio, categoría, stock e imágenes. El máximo de cinco imágenes se conserva como propuesta del PDF y debe confirmarse junto con límites de formato y tamaño.

Criterio de aceptación: los cambios válidos persisten y se reflejan en el catálogo cuando corresponde; un producto de otro propietario no se puede modificar. La política de retiro se define antes de implementar borrados.

### RF10 Panel de administración

El administrador podrá revisar solicitudes y moderar emprendimientos y productos. La decisión y su motivo deberán quedar registrados. Se propone ocultar contenido y suspender su publicación antes que eliminarlo definitivamente.

Criterio de aceptación: las acciones administrativas requieren permisos verificados en Firebase y producen el estado público esperado. Se documentará cómo se asigna inicialmente al administrador.

### RF11 Reportes propuestos

Se propone permitir a usuarios registrados reportar un producto o emprendimiento mediante un motivo. Administración podrá revisar el caso y registrar una resolución. Un reporte no ocultará automáticamente el contenido por sí solo.

Criterio de aceptación propuesto: quien reporta puede enviar un caso válido sin ver reportes privados ajenos. Administración puede distinguir casos abiertos y resueltos. La inclusión y las reglas contra duplicados están pendientes.

### RF12 Destacados propuestos

La sección más vendidos se reemplazará por destacados seleccionados por administración, si se conserva esta sección para la entrega. No se mostrarán cifras ficticias como resultados reales.

Las notificaciones, la gestión dinámica de categorías y la administración avanzada de usuarios presentes o sugeridas en el diseño necesitan una decisión de alcance independiente.

## Reglas de negocio y datos necesarios

### Reglas acordadas

RN01 Una identidad personal puede explorar como comprador y gestionar como máximo un emprendimiento. Cambiar entre vistas no modifica su identidad ni otorga permisos nuevos.

RN02 Las consultas públicas mostrarán únicamente contenido habilitado. La aprobación de emprendimientos forma parte del alcance; el circuito exacto de aprobación de cada producto está pendiente.

RN03 El stock será un número entero mayor o igual que cero. El propietario lo actualizará manualmente. Una consulta de WhatsApp no reserva unidades ni acredita una venta.

RN04 El número de WhatsApp del emprendimiento será un dato público destinado al contacto comercial. El correo de acceso y los datos privados del usuario no se publicarán en el catálogo.

RN05 Abrir WhatsApp solo acredita una acción de contacto desde la aplicación. Los textos y métricas no deben presentarla como mensaje enviado, conversación efectiva, pedido o venta.

RN06 Los permisos de administración y propiedad se verificarán en Firebase. Ocultar botones o usar una dirección de panel distinta no sustituye esa verificación.

### Reglas propuestas para confirmar

RN07 Precio numérico positivo, categoría válida y campos de texto con límites documentados. Debe acordarse si se aceptan productos gratuitos o precios a consultar.

RN08 Producto sin stock visible con la etiqueta sin stock y posibilidad de consulta, sin prometer disponibilidad. La decisión de mantenerlo visible está pendiente.

RN09 Suspender un emprendimiento oculta sus productos sin borrar su información. El retiro de productos y cuentas debe tener reglas de conservación y recuperación definidas.

### Información que las funciones requieren

Usuario: identidad de acceso, perfil personal y permisos. Emprendimiento: propietario, información pública, ubicación y estado de aprobación. Producto: emprendimiento de origen, contenido comercial, categoría, stock y estado de publicación.

Según el alcance aprobado, se agregarán favoritos, contactos consultados, reportes y decisiones de moderación. Cada registro deberá tener un identificador estable y las fechas necesarias para su funcionamiento.

Este listado es un modelo conceptual, no el esquema definitivo. Antes de diseñar colecciones, campos e índices, se describirán las consultas de cada pantalla y quién puede leer o modificar cada dato. Se propone Cloud Firestore para los datos; Firebase Authentication para el acceso y Cloud Storage para imágenes, sujeto a revisar su configuración y costos.

## Calidad arquitectura y organización

### Requisitos no funcionales

RNF01 Adaptación a celular y computadora. Formularios, navegación y acciones principales deben poder utilizarse sin depender de un ancho único de pantalla.

RNF02 Accesibilidad básica. Formularios con etiquetas, navegación por teclado, foco visible, imágenes con texto alternativo y estados que no se comuniquen solo mediante color.

RNF03 Persistencia y errores. Las operaciones deben informar carga, éxito, estado vacío y error. Un fallo al guardar no se presentará como una operación completada. Los datos persistidos se conservarán al volver a abrir una sesión autorizada.

RNF04 Validación y permisos. Se validarán los datos en la interfaz para orientar al usuario y en Firebase para hacer cumplir las restricciones. Las pruebas deben contemplar intentos de acceso a datos de otro propietario.

RNF05 Conectividad. La entrega dependerá de la conexión para las operaciones que requieran Firebase. El funcionamiento completo sin internet no se promete en esta versión; cualquier caché o persistencia offline necesita pruebas y alcance propio.

### Modularización obligatoria

Se organizará el código por funcionalidades, separando la presentación, las validaciones y reglas de negocio, el acceso a datos y la coordinación de eventos. Los módulos de datos no manipularán el HTML y las validaciones independientes no dependerán de la pantalla.

Las áreas iniciales son cuenta y sesión, catálogo y contacto, gestión del emprendimiento y administración. La configuración de Firebase y los componentes visuales compartidos tendrán una ubicación común. El árbol definitivo se elaborará después de aprobar estos requisitos.

HTML, CSS y JavaScript son la base conocida por el equipo. React y TypeScript están presentes en el exportado, pero su continuidad todavía no está decidida. La elección deberá considerar reutilización del diseño, tiempo disponible y capacidad de cada integrante para explicar y modificar su código.

### Organización del grupo propuesta

Se propone asignar una de las cuatro áreas a cada integrante, con revisión compartida de permisos, configuración e integración. Cada tarea tendrá un resultado verificable, dependencias explícitas y una persona responsable. El reparto por área no elimina la separación interna de responsabilidades.

Git registrará código y documentación. El repositorio se creará después de definir la estructura, según lo acordado. Se propone integrar avances diariamente y mantener un recorrido demostrable que no dependa de juntar todo el último día. Las asignaciones nominales y las fechas intermedias aún deben acordarse.

## Verificación y decisiones pendientes

### Recorrido de aceptación propuesto

Una visita sin cuenta busca un producto por categoría y localidad, abre su ficha y accede al enlace de WhatsApp. Después, un usuario autorizado gestiona su emprendimiento, publica o actualiza un producto y comprueba su persistencia. Administración revisa una solicitud o modera contenido y el catálogo refleja el estado correspondiente.

La prueba de permisos debe demostrar que otro usuario no puede editar ese producto ni ejecutar acciones administrativas. El equipo también verificará errores de formulario, cero resultados, fallo de conexión y stock igual a cero.

La exposición debe distinguir funciones operativas, propuestas y pendientes. Los datos de demostración se identificarán como tales. Cada integrante deberá poder explicar la responsabilidad de su módulo, sus entradas y salidas, su relación con Firebase y cómo comprobó su funcionamiento.

### Decisiones necesarias antes del esquema definitivo

P01 Qué funcionalidades estarán operativas el 17 y cuáles pasarán a una segunda etapa, en particular favoritos, historial, reportes, notificaciones y destacados.

P02 Método de inicio de sesión, recuperación de acceso y forma de asignar al administrador inicial.

P03 Aprobación inicial del emprendimiento, cambios que exigen revisión, publicación directa o revisión de productos y comportamiento de cuentas suspendidas.

P04 Campos obligatorios y límites de nombre, descripción, precio, stock, ubicación y fotografías; origen de categorías y localidades.

P05 Quién puede reportar, qué motivos se admiten y cómo se resuelve y conserva cada caso. También debe definirse si habrá reportes de personas además de contenido.

P06 Alcance de búsqueda por texto y métricas de contactos. Si se registran eventos de visitantes, se debe definir qué se almacena y cómo evitar interpretaciones incorrectas de esas cifras.

P07 Tecnología final del frontend, árbol de archivos, responsables de las cuatro áreas y criterios de integración.

### Exclusiones de esta versión

Pagos integrados, pedidos y compras gestionados dentro del sitio, envíos automatizados, chat interno, mapas en tiempo real, reseñas y calificaciones, conteo de ventas verificadas, suscripciones automáticas y múltiples emprendimientos por cuenta. Toda ampliación requiere actualizar requisitos, permisos y datos antes de implementarla.

### Referencias de trabajo

Documentos Manos Locales Etapa UX y Manos Locales Etapa UX Grupo Nimañ, carpeta Determinación de alcances y usuarios de Drive. Borrador base de datos Manos Locales y guía TechPampa como antecedentes. Exportado App.tsx y recorrido de las pantallas públicas del prototipo. Decisiones acordadas en la conversación del 10 de noviembre de 2026. Esta versión corrige las discrepancias detectadas sin modificar los documentos originales.
