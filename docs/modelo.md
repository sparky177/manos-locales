# Cómo se guardan los datos de Manos Locales

## Justificación de la elección

En Manos Locales, una persona de Santa Cruz puede encontrar un producto por localidad y consultar por WhatsApp al emprendimiento que lo ofrece. Para que ese recorrido funcione, el producto que carga una persona desde su panel tiene que aparecer en el catálogo que otra consulta desde su celular. Elegimos Cloud Firestore dentro del plan Spark de Firebase.

La primera razón es la persistencia compartida. Si cambia el stock de una caja de alfajores, la siguiente consulta obtiene la cantidad guardada por su propietario. La segunda es la identificación con Firebase Authentication. El identificador de la cuenta vincula cada emprendimiento a su responsable y permite conservar una única tienda por persona. La tercera es la moderación. Las reglas comprueban el estado del negocio antes de entregar sus publicaciones al público, incluso cuando alguien conoce la dirección de un producto.

El proyecto depende de internet para confirmar las escrituras. La interfaz informa los errores y la demostración requiere probar la conexión desde la computadora que se usará en clase. Consideramos SQLite, pero compartir su archivo entre navegadores mediante una API exigiría desarrollar y mantener un servidor adicional.

## Estructura y relaciones

```text
Authentication (una identidad por cuenta)
usuarios/{uid}
  favoritos/{favoritoId}
administradores/{uid}
emprendimientos/{uid}
  revision/actual
  productos/{productoId}
    revision/actual
decisiones/{decisionId}
reportes/{reporteId}
```

Una cuenta tiene un perfil privado y hasta un emprendimiento. Un emprendimiento tiene entre cero y muchos productos. Cada decisión refiere a un administrador y a un objeto moderado. El teléfono y la localidad se leen del emprendimiento, sin copiarlos en cada producto. El catálogo primero consulta los emprendimientos aprobados y después sus productos publicados. Así suspender un negocio impide nuevas lecturas públicas de todos sus productos con una sola escritura de estado. La vista abierta refleja el cambio al volver a cargar.

En los ejemplos, los identificadores y el teléfono son ficticios. Las fechas se representan como cadenas ISO para que los ejemplos sean JSON válidos. En Firestore son Timestamp. La galería vive en el sitio y el documento guarda la clave que permite elegir el archivo local.

## usuarios/uidAna

El documento identifica que la persona completó el alta. Correo y contraseña se gestionan mediante Authentication.

```json
{
  "creadoEn": "2026-11-18T15:00:00Z"
}
```

| Campo | Tipo | Obligatorio | Clave o referencia | Formato y uso | Ejemplo |
|---|---|---|---|---|---|
| ID del documento | Texto | Sí | Identificador | UID de Auth; ID del documento | uidAna |
| creadoEn | Timestamp | Sí | — | Fecha de alta asignada por el servidor | 2026-11-18T15:00:00Z |

## usuarios/uidAna/favoritos/uidTaller:p01

Si Ana guarda una bufanda del Taller del Sur, Firestore conserva la relación en su cuenta. Cada documento contiene dos campos de texto, por ejemplo `{"tiendaId":"uidTaller","productoId":"p01"}`. El UID de Ana está en la ruta. El identificador del favorito se construye con los dos IDs para que pulsar guardar otra vez conserve un solo vínculo.

Authentication ya proporciona la identidad. El precio, la imagen, el stock y el nombre vigentes se consultan en los documentos del negocio y del producto. Las reglas permiten a cada titular leer y quitar sus favoritos. Para guardar uno, el negocio debe estar aprobado y el producto publicado. Al volver a abrir Mis favoritos, una referencia a contenido retirado, oculto o suspendido se muestra como «Producto no disponible» y se puede quitar. Esto elimina únicamente el vínculo privado.

## emprendimientos/uidAna

Perfil comercial y solicitud de aprobación.

```json
{
  "nombre": "Dulces del Sur",
  "descripcion": "Repostería artesanal",
  "localidad": "Río Gallegos",
  "whatsapp": "5490000000000",
  "estado": "aprobado"
}
```

| Campo | Tipo | Obligatorio | Clave o referencia | Formato y uso | Ejemplo |
|---|---|---|---|---|---|
| ID del documento | Texto | Sí | Identificador | UID de la cuenta propietaria; ID y referencia a Authentication | uidAna |
| nombre | Texto | Sí | — | Nombre comercial de 1 a 80 caracteres | Dulces del Sur |
| descripcion | Texto | Sí | — | Descripción de 1 a 500 caracteres | Repostería artesanal |
| localidad | Texto | Sí | — | Localidad de Santa Cruz declarada por el propietario, de 1 a 80 caracteres | Río Gallegos |
| whatsapp | Texto | Sí | — | Número comercial con país, de 8 a 15 dígitos sin cero inicial | 5490000000000 |
| estado | Texto | Sí | — | pendiente, aprobado, rechazado o suspendido | aprobado |

## emprendimientos/uidAna/revision/actual

Este documento privado contiene la última decisión sobre el negocio. Guarda `estado`, `motivo`, `fecha` del servidor y `decisionId`, que identifica la entrada del historial. El titular y administración pueden leerlo. Administración guarda el nuevo estado del perfil, la revisión y la entrada de historial en una sola transacción. Si otro usuario modificó los datos comerciales que el administrador tenía a la vista, debe volver a revisarlos.

Por ejemplo, administración rechaza una solicitud porque falta precisar la localidad. El titular lee el motivo, escribe «El Calafate» y guarda. El perfil sigue rechazado. Al pulsar **Volver a enviar a revisión**, cambia únicamente el estado del perfil a `pendiente`. Administración vuelve a ver la solicitud con los datos corregidos. La aprobación posterior habilita la ficha pública y la carga de productos. El historial conserva ambas decisiones.

Un rechazo anterior a esta función también admite reenvío. Si falta el aviso privado, administración puede usar **Recuperar motivo anterior** para consultar la decisión histórica más reciente del negocio y confirmar que se comparta con el titular. Se conserva la fecha original.

## emprendimientos/uidAna/productos/p01

Mercadería del emprendimiento indicado en la ruta.

```json
{
  "nombre": "Alfajores",
  "descripcion": "Caja de cuatro unidades",
  "categoria": "Alimentos",
  "imagen": "alfajores",
  "stock": 10,
  "precioCentavos": 680000,
  "estado": "publicado",
  "creadoEn": "2026-11-18T15:30:00Z"
}
```

| Campo | Tipo | Obligatorio | Clave o referencia | Formato y uso | Ejemplo |
|---|---|---|---|---|---|
| ID del documento | Texto | Sí | Identificador | ID automático estable; el documento padre identifica al propietario | p01 |
| nombre | Texto | Sí | — | Nombre de 1 a 80 caracteres | Alfajores |
| descripcion | Texto | Sí | — | Descripción de 1 a 500 caracteres | Caja de cuatro unidades |
| categoria | Texto | Sí | — | Alimentos, Artesanías, Textil o Bienestar | Alimentos |
| imagen | Texto | Sí | Galería | Clave de la galería: alfajores, brownie, cookies, lemon, trufas, budin o general | alfajores |
| stock | Entero | Sí | — | Unidades disponibles entre 0 y 99999 | 10 |
| precioCentavos | Entero | Sí | — | Importe en centavos de ARS entre 1 y 999999999 | 680000 |
| estado | Texto | Sí | — | publicado, archivado, oculto o pendiente_revision | publicado |
| creadoEn | Timestamp | Sí | — | Fecha del servidor que conserva el orden de novedades | 2026-11-18T15:30:00Z |

### Revisión privada de un producto

El campo `estado` del producto determina su visibilidad. El motivo de administración se guarda en `productos/{productoId}/revision/actual`, dentro del emprendimiento. La revisión privada tiene los mismos campos y permisos de lectura que la revisión del negocio. Administración guarda el estado, el motivo privado y la entrada del historial en una transacción.

| Acción | Estado anterior | Estado siguiente | Responsable |
|---|---|---|---|
| Ocultar con motivo | publicado | oculto | Administración |
| Corregir y guardar | oculto | oculto | Titular |
| Solicitar revisión | oculto | pendiente_revision | Titular |
| Volver a publicar con motivo | pendiente_revision | publicado | Administración |
| Mantener oculto con un nuevo motivo | pendiente_revision | oculto | Administración |
| Retirar del catálogo | publicado | archivado | Titular |

Al reenviar se conserva el ID, el stock y la fecha de creación del producto. Si quedó oculto antes de incorporar el aviso privado, el titular también puede corregirlo y reenviarlo. Administración puede recuperar y compartir el motivo que conste en el historial mientras siga oculto.

## administradores/uidAdmin

La existencia del documento habilita las acciones administrativas. Se crea y se elimina desde la consola del proyecto.

```json
{
  "etiqueta": "demo"
}
```

| Campo | Tipo | Obligatorio | Clave o referencia | Formato y uso | Ejemplo |
|---|---|---|---|---|---|
| ID del documento | Texto | Sí | Identificador | UID del administrador; referencia a Authentication | uidAdmin |
| etiqueta | Texto | No | — | Etiqueta descriptiva opcional para identificar la cuenta de demostración | demo |

## decisiones/d01

El panel guarda cada decisión y el nuevo estado en un mismo lote de escritura.

```json
{
  "ruta": "emprendimientos/uidAna",
  "estado": "aprobado",
  "motivo": "Datos comerciales revisados",
  "actor": "uidAdmin",
  "fecha": "2026-11-18T15:15:00Z"
}
```

| Campo | Tipo | Obligatorio | Clave o referencia | Formato y uso | Ejemplo |
|---|---|---|---|---|---|
| ID del documento | Texto | Sí | Identificador | ID automático del evento | d01 |
| ruta | Texto | Sí | Ruta de Firestore | Ruta del documento moderado, hasta 500 caracteres | emprendimientos/uidAna |
| estado | Texto | Sí | — | Resultado aprobado, rechazado, suspendido, oculto o publicado | aprobado |
| motivo | Texto | Sí | — | Motivo de 1 a 250 caracteres | Datos comerciales revisados |
| actor | Texto | Sí | UID | UID autenticado del administrador que decidió | uidAdmin |
| fecha | Timestamp | Sí | — | Fecha y hora del servidor | 2026-11-18T15:15:00Z |

## Reportes

Cada caso registra `autor` (UID), `tiendaId`, `productoId` (vacío para un emprendimiento), `nombre` de la ficha al reportar, `motivo`, `detalle`, `estado` y `creadoEn`. Firestore verifica que la ficha sea pública y que el usuario autenticado sea el autor. Mi cuenta consulta por autor y la bandeja administrativa por estado pendiente.

La subcolección `reporteActivo/{uid}` dentro de la ficha apunta al último caso enviado por esa cuenta. La app escribe el caso y el vínculo en una transacción. Cuando existe uno pendiente, un reintento devuelve el mismo caso. Una vez cerrado, un nuevo envío puede actualizar el vínculo sin perder el historial.

Al cerrar se agregan `resueltoPor`, `cerradoEn` y `resultado`. **Descartado** guarda la explicación. **Resuelto** incluye también `decisionId` y confirma juntos el cierre, la medida aplicada al contenido, la entrada del historial administrativo y la revisión privada del titular. El resultado se comparte con el autor. La explicación de una medida también se muestra al titular, por lo que debe describir el problema sin identificar a quien reportó.

## Permisos y operaciones

| Operación | Quién puede realizarla | Condición |
|---|---|---|
| Ver el catálogo y abrir WhatsApp | Cualquier visitante | Negocio aprobado y producto publicado. El clic conserva el stock. |
| Crear o ver el perfil personal | Su titular | UID de la ruta igual al de la sesión. |
| Solicitar alta y editar datos comerciales | Su titular | Estado inicial pendiente. La edición conserva el estado. |
| Reenviar una solicitud | Su titular | Solo desde rechazado. El reenvío cambia únicamente el estado a pendiente. |
| Aprobar, rechazar o suspender | Administrador | Rechazo desde pendiente y suspensión desde aprobado. Puede aprobar solicitudes, reactivar suspendidos o reconsiderar rechazados. |
| Publicar o editar productos | Titular de un negocio aprobado | Puede editar las fichas publicadas y ocultas. Guardar conserva el estado. |
| Retirar un producto propio | Propietario aprobado | Pasa de publicado a archivado. |
| Solicitar revisión del producto | Titular de un negocio aprobado | Pasa de oculto a pendiente_revision. |
| Moderar una publicación | Administrador | Puede ocultar un producto publicado y decidir si un producto en revisión vuelve al catálogo o sigue oculto. |
| Consultar inventario privado | Propietario o administrador | El público solo lee la selección visible. |
| Consultar y registrar decisiones | Administrador | Motivo y autor obligatorios. Cada decisión del panel se confirma junto al cambio. |
| Asignar administradores | Responsable del proyecto en consola | Los clientes solo comprueban su propia autorización. |

## Consultas y límites de la primera versión

La consulta pública usa igualdad sobre estado en cada colección. Las consultas del panel son por ruta de propietario o por ID. Estas consultas se diseñaron para los índices automáticos de un campo. La búsqueda por texto, categoría y localidad trabaja sobre el conjunto público cargado en memoria. Es una solución para el tamaño del catálogo de la exposición. Al crecer la cantidad de emprendimientos, aumentarán las lecturas iniciales y habrá que paginar o rediseñar la consulta.

El motivo de moderación queda en decisiones, fuera de los documentos públicos. La app guarda un solo emprendimiento por cuenta porque el UID determina su ruta. Si falla la creación del perfil después del registro en Authentication, el siguiente ingreso recupera el perfil faltante. Las comprobaciones por rol y la persistencia real se verifican con el proyecto configurado siguiendo el README.
