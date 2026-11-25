# Lista de revisión de la interfaz de Manos Locales

## Primera pasada · portada del catálogo

- [ ] Conservar la foto de los alfajores como primera escena, el arco rosa, el fondo salvia, el título «Encontrá algo hecho cerca tuyo» y el botón «Explorar el catálogo».
- [ ] Extender la franja de la portada hasta los dos bordes de la ventana. En el HTML actual la portada está dentro de `main.contenedor`. Dar el ancho completo a esa sección y mantener el texto alineado con la marca y el listado. El margen interior debe seguir siendo cómodo en celular.
- [ ] Preparar tres escenas con encuadre y luz compatibles: alfajores sobre el plato, una prenda tejida con la textura visible y una pieza impresa en 3D junto a la impresora. Mantener el título y el botón fijos mientras rota la fotografía. Presentar impresión 3D como temática visual; las categorías del catálogo se administran por separado.
- [ ] Mantener constante la altura entre escenas. En escritorio, llevar la foto hasta el borde derecho y preservar el arco hacia el centro. En celular, probar el texto encima de la imagen en dos bloques y ajustar el recorte de cada foto para que el producto se reconozca.
- [ ] Para la rotación automática, ofrecer anterior, siguiente y pausa con nombres accesibles. Detener el avance al recibir foco o al posar el puntero y ofrecer reanudación manual. Con movimiento reducido, comenzar en modo manual. Comprobar que el botón al listado funciona en las tres escenas.

## Segunda pasada · pantallas y componentes

| Revisado | Sección | Conservar | Ajustar y verificar |
|---|---|---|---|
| [ ] | Cabecera y pie | Marca, navegación corta, indicación de página actual y referencia a Santa Cruz. | Alinear el logo con el título de portada. A 360 px, verificar que «Mi emprendimiento» y «Salir» tengan espacio y que el encabezado no tape la foto. |
| [ ] | Filtros y vistas del catálogo | Productos y Emprendimientos, localidad compartida, categoría, precio máximo y orden. | Alinear los campos por su borde inferior en escritorio. En celular, dar todo el ancho a Buscar y agrupar los controles restantes según el espacio disponible. Probar un precio inválido y una búsqueda vacía; la explicación y «Limpiar filtros» deben quedar juntas. |
| [ ] | Tarjetas de productos y negocios | Foto, precio, nombre comercial, localidad y acción de favoritos. | Probar una foto de ropa, una de alimento y un título de dos líneas en la misma fila. Revisar el recorte, la alineación de precios y que pulsar el favorito sea independiente de abrir la ficha. |
| [ ] | Ficha de producto | Foto protagonista, precio, stock, enlace al negocio y contacto por WhatsApp. | Dar mayor presencia al contacto y menor a Favoritos y Reportar. En celular, probar un nombre largo y stock cero. |
| [ ] | Perfil público del emprendimiento | Nombre, localidad, descripción y contacto directo. | Separar la presentación del negocio de su catálogo. Abrir un negocio aprobado sin productos y comprobar que WhatsApp sigue a la vista y se entiende el mensaje de catálogo vacío. |
| [ ] | Ingreso y registro | Formulario breve, etiquetas visibles y enlace entre ambas pantallas. | Igualar anchos y espaciados. Probar un error de ingreso en celular y comprobar que se pueda corregir y reenviar con teclado. |
| [ ] | Mi cuenta | Accesos por rol, favoritos y reportes propios. | Ordenar los tres bloques y alinear sus encabezados. Probar una cuenta vacía, otra con varios favoritos y un reporte cerrado con una explicación larga. |
| [ ] | Panel del emprendedor | Estado de la tienda, motivo privado, formulario e inventario. | Distinguir «Guardar cambios» de «Solicitar revisión». Agrupar precio, stock, categoría e imagen. Revisar cuánto se desplaza la pantalla entre editar un producto y guardar. |
| [ ] | Administración | Reportes pendientes, revisión del contenido y motivo de la decisión. | Diferenciar visualmente revisar, descartar, ocultar y suspender. Leer el nombre del objeto y la acción juntos. Probar dos casos abiertos y motivos extensos. |

## Cómo agregar imágenes

Las fotos de la web funcional están en `public/assets/imagenes/`. La portada usa `alfajores.png`; la URL que se escribe en HTML es `/assets/imagenes/alfajores.png`. El logo está en `public/assets/iconos/marca.svg`.

- [ ] **Solo portada.** Para las nuevas escenas, crear `public/assets/imagenes/portada/`, copiar allí las fotos y referenciarlas desde la portada, por ejemplo `/assets/imagenes/portada/tejidos.webp`. Conservar el alfajor en su ubicación actual porque también lo usan los productos. Elegir fotos con margen alrededor del objeto para poder recortarlas en celular y agregar un texto alternativo para cada imagen.
- [ ] **Galería que elige el emprendedor.** Con la implementación actual, copiar un PNG, por ejemplo `bufanda.png`, directamente en `public/assets/imagenes/`. Agregar `bufanda: 'Bufanda tejida'` al objeto `imagenes` de `js/config/catalogos.js` y `'bufanda'` a la lista permitida para `d.imagen` en `firebase/firestore.rules`. Ejecutar `npm test`, publicar las reglas y probar la selección, la vista previa y el guardado del producto. El archivo de imagen debe acompañar al código en Git.

## Comprobación antes de dar una pantalla por terminada

- [ ] Comparar con la captura inicial en escritorio, en una pantalla de 1366 × 768 para la exposición y en un celular de 360 px de ancho. Revisar bordes, texto cortado y desplazamiento horizontal.
- [ ] Recorrer enlaces, formularios y controles con Tab, Enter y Espacio según corresponda. Verificar foco visible y que los estados se entiendan por su texto además del color.
- [ ] Recorrer catálogo → producto → emprendimiento → WhatsApp. Guardar un favorito, aplicar un filtro y comprobar que las acciones siguen siendo distinguibles.
