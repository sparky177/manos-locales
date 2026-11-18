# Decisiones confirmadas y diagnóstico local

10 de noviembre de 2026. Este documento actualiza los puntos abiertos de los documentos 01, 02 y 03 y de los requisitos 0.1. Prevalece sobre las alternativas anteriores cuando registra una respuesta explícita del equipo.

## Decisiones confirmadas

| Tema | Decisión |
|---|---|
| Código original | Carpeta Panel de Inicio dentro de este proyecto |
| Firebase | No existe proyecto todavía; se utilizará el plan gratuito Spark |
| Fotografías de la primera versión | Galería de imágenes incluida en el proyecto; el emprendedor selecciona una imagen. Subida de fotografías propias aplazada y documentada como mejora |
| Demostración | Local, con conexión real a Firebase. Una URL publicada no es requisito docente |
| Recorrido prioritario | Catálogo y filtros, WhatsApp, registro y acceso, un emprendimiento por cuenta, gestión de productos y aprobación/moderación básica |
| Funciones posteriores al recorrido estable | Favoritos, historial, reportes de usuarios y notificaciones |
| Disponibilidad de Juli | Dos o tres horas reales por día; posible ampliación el 14 y el 15, aún sin cantidad confirmada |
| Aporte de compañeros | Posible dedicación similar, con incertidumbre de cumplimiento. No tratar esa capacidad como garantizada |
| Fechas | Primera versión el 15; versión funcional defendible el 17 de noviembre de 2026 |

Cloud Storage no se configura para esta versión. Firestore almacena un identificador de imagen de la galería, no el archivo ni base64. Un catálogo común relaciona el identificador con la ruta local y el texto alternativo; las reglas deben restringir identificadores admitidos. Las imágenes se entregan con el proyecto y no requieren un servicio de subida. Revisar autorización de uso de los recursos antes de redistribuirlos fuera de la demostración.

## Diagnóstico del exportado

Se leyeron AGENTS.md, package.json, la configuración inicial de Vite, estilos y los puntos relevantes de App.tsx. La compilación existente con Vite terminó correctamente el 10 de noviembre; generó dist. No se modificó el código fuente ni se instaló ninguna dependencia para esa comprobación. La compilación verifica que el exportado puede construirse, no demuestra conexión a Firebase ni corrección de todas las pantallas.

El proyecto usa React, TypeScript y Tailwind. La dependencia instalada de Vite utilizada en la prueba fue 8.3.6. App.tsx concentra más de 2.100 líneas. Existen diez PNG y nueve SVG en public/assets. Algunos productos también referencian imágenes remotas, y las fuentes actuales incluyen recursos externos; una galería local no elimina por sí sola toda dependencia externa de presentación.

El acceso de usuarios y administradores es simulado: el formulario comprueba algunos campos y después cambia de vista. No se encontró integración del SDK de Firebase en App.tsx ni dependencia Firebase en package.json. Hay datos de ejemplo y uso de localStorage. No se debe presentar esa navegación como autenticación real ni usarla como autorización del panel administrativo.

La configuración muestra advertencias sobre compatibilidad futura del cargador de Vite, pero no impidieron compilar. No se requiere resolver cambios futuros de versión para evaluar el prototipo actual.

## Qué reutilizar y qué desarrollar

Reutilizar como referencia paleta, tipografía, iconos, imágenes disponibles y recorridos. Evitar un rediseño completo. Conservar Panel de Inicio como referencia independiente mientras se implementa el código modular.

La propuesta tecnológica sigue siendo HTML, CSS y JavaScript con módulos ES. El traslado desde TSX requiere reconstruir plantillas y eventos; no es una conversión directa. Empezar por el catálogo y una ficha para comprobar el costo real antes de trasladar todas las pantallas. React no se incorpora silenciosamente al alcance acordado.

Desarrollar acceso real, repositorios Firestore, validaciones, reglas de permisos y pantallas conectadas. Sustituir stock simulado por actualización persistida y accesos administrativos simulados por permisos verificados. Quitar del recorrido inicial los controles de funciones aplazadas o identificarlos claramente como no disponibles; evitar botones que aparenten guardar sin hacerlo.

El alcance de imágenes cambia RF09 y los campos propuestos: una imagen elegida de galería por producto en esta entrega. La carga de hasta cinco fotografías del PDF es una mejora posterior. archivos.repository.js y storage.rules del árbol de destino no son necesarios para la primera versión.

## Ajustes al plan de etapas

El esfuerzo asegurado es el tiempo de Juli, no cuatro dedicaciones completas. Entre el 11 y el 15 hay aproximadamente diez a quince horas base de Juli antes de contar horas adicionales aún no confirmadas; esta cifra no es una estimación de trabajo suficiente para implementar toda la app.

1. Cerrar primero el modelo, los contratos y la configuración mínima. Crear el repositorio una vez aceptada la estructura.
2. Hacer una sección completa conectada cuanto antes: sesión, emprendimiento y producto con imagen de galería. Revisar el avance al final de cada jornada.
3. Desarrollar catálogo y administración sobre esos mismos contratos. Integrar cambios pequeños; asignar a compañeros entregables que no bloqueen la conexión principal.
4. El 14 revisar el recorrido completo. Si hay atraso, simplificar diseño secundario, estadísticas y pantallas accesorias. No aplazar permisos ni persistencia.
5. El 15 cerrar la primera versión identificada en GitHub y ejecutar las pruebas principales. La publicación en Hosting pasa a opcional.
6. El 16 corregir fallos y ensayar; el 17 presentar la versión identificada y sus límites reales.

Se debe comprobar el avance del 12 antes de asegurar que el alcance entero llegará en fecha. Si no hay un primer recorrido persistido entonces, renegociar funciones y distribución con el equipo. La moderación básica y la protección entre propietarios siguen siendo parte del núcleo, aunque no se implementen reportes de usuarios.

## Próximos entregables antes de conectar la base

- Modelo detallado con JSON válidos y diccionario de campos para usuarios, emprendimientos, productos y registro de administradores.
- Matriz de permisos por operación, estados y transiciones. Definir aprobación inicial y suspensión antes de escribir consultas públicas.
- Consultas e índices necesarios para catálogo, productos propios y solicitudes.
- Instrucciones de creación del proyecto Spark y de la aplicación web; configuración inicial de Authentication y Firestore. Nunca abrir reglas globales para acelerar la demo.
- Pruebas con dos cuentas comunes y una administrativa. El administrador inicial se asigna mediante una operación confiable fuera del formulario público.

No se crearon proyectos Firebase, repositorios GitHub, cuentas ni reglas remotas. La galería y el código conectado aún están por implementar.
