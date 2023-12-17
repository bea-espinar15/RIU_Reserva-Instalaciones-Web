# Proyecto Obligatorio de Aplicaciones Web (2023-24)
## RIU - Reserva de Instalaciones Universitarias

### Autores
- Lucas Bravo Fairen
- Beatriz Espinar Aragón

### Estructura de carpetas
Para generar la estructura del proyecto se ha hecho uso del módulo express-generator.

#### VIEWS
En esta carpeta se encuentran los ficheros EJS para las vistas dinámicas. En este caso, todas las vistas lo son, pues como mínimo importan el head y el modal de respuesta/error de manera dinámica (y la gran mayoría el nav)

#### PUBLIC
En esta carpeta se encuentran las vistas y los recursos estáticos. Incluye los siguientes elementos:
- head.html: Cabecera compartida por todas las vistas que se incluye de manera dinámica en los ficheros EJS
- modal.html: Modal de respuesta/error compartida por todas las vistas para el caso de tener que avisar de un error o una acción exitosa
- css/ : En esta carpeta se encuentran los ficheros de estilos. Hay uno por cada vista, aunque algunos pares de vistas agrupan el mismo CSS por su similitud. Además, hay un styles.css general para todas las vistas, donde además se definen las variables globales para la paleta de colores de la app
- img/ : En esta carpeta se encuentran las imágenes utilizadas por la app. Dividida en subcarpetas según la naturaleza de las imágenes
- js/ : En esta carpeta se encuentran los ficheros JS de cliente. Está el main.js, aplicable a todas, que gestiona el modal de error al cargar una nueva vista (y el  logout). Por otro lado, hay un fichero específico por cada vista que lo necesita por, al menos, uno de estos motivos:
    - Validación en cliente de un formulario antes de hacer el POST
    - Hay que gestionar peticiones AJAX (GET o POST) desde esa vista
    - La estructura se cambia de manera dinámica utilizando jQuery, por ejemplo, escondiendo y mostrando divs cuando el usuario hace click en determinados lugares de la vista

#### SERVIDOR
En el lado del servidor tenemos otra serie de ficheros y subcarpetas:

__CONTROLLER__

En la carpeta controller/ se encuentran los controladores de la aplicación, encargados de gestionar las peticiones. Actúan de intermedios entre los manejadores de ruta y la capa de integración (DAO). Se ocupan de comprobar ciertas reglas de negocio, gestionar los errores y respuestas, e invocar a los DAOS. Se implementa un controlador por cada módulo ((instalaciones + tipos de instalaciones), mensajes, reservas, (universidades + facultades), usuarios).

__DAO__

En la carpeta dao/ se encuentran los DAO (Data Access Object), encargados de la capa de integración. Su trabajo es realizar las consultas a la Base de Datos, e implementan las funciones CRUD (Create Read Update Delete) necesarias en la aplicación, junto con alguna otra adicional. De nuevo, existe un DAO por cada módulo mencionado anteriormente.

__ROUTES__

En la carpeta routes/ se encuentran los Routers de la app, encargados de manejar "subrutas" a partir de las gestionadas en el app.js. Existen tres rutas que dirigen a estos routers, y cada una de ellas tiene su Router.js correspondiente:
- /admin/...
- /personal/...
- /usuario/...

Las rutas dentro de estos puntos generales se especifican en la SRS.

__Otros ficheros JS__

Contamos también con una serie de ficheros en la carpeta raíz:
- app.js : es el punto inicial de la aplicación, el MAIN. Este hace de manejador de rutas, crea el pool de conexiones, e invoca a los Application Service cada vez que se hace una petición, además de tener otras responsabilidades.
- config.js : contiene la configuración de la BBDD.
- errorHandler.js : es el manejador de mensajes de error que transforma los códigos en un objeto con el código correspondiente (400, 404, 500...), el título principal del evento y el mensaje más elaborado de qué ha ocurrido. Exporta dos funciones para renderizar o devolver a cliente la información pedida, dependiendo de si la petición es AJAX o no, como parte de la refactorización del código.
- utils.js : exporta una función auxiliar utilizadas desde los DAO para formatear las fechas al formato clásico español DD/MM/AAAA

#### OTROS
Existen otros ficheros en la carpeta raíz del proyecto:
- import.sql : es el fichero script que debe introducirse en phpMyAdmin para crear la Base de Datos de la aplicación. Contiene los correspondientes CREATE TABLE, además de múltiples INSERT para añadir datos de prueba a la BBDD para poder testear la aplicación
- Otros: se incluyen también la licencia software, los package.json del proyecto y este fichero README.md

#### DOCUMENTACIÓN
Por último, tenemos la carpeta doc/, donde se encuentra toda la documentación utilizada en el proyecto. Consiste en:
- Modelo_Datos : Modelo que seguirá la BBDD, con las tablas y sus correspondientes atributos
- Modelo_Dominio : Modelo del dominio inicial con las entidades y sus atributos
- Diseño_SRS : Es la Especificación de Requisitos Software (SRS). Incluye los diferentes casos de uso (con entrada/salida, requisitos...) y un diseño borrador inicial que se realizó de cada vista antes de implementarla. Además, lista las diferentes vistas de la aplicación, y una serie de convenios para el código establecidos por el equipo al comienzo del proyecto
- TO-DO : Lista de tareas realizada en Excel para facilitar la organización y reparto de tareas en el equipo

### Accesibilidad
Se han implementado algunas medidas para mejorar la accesibilidad de la aplicación web, entre las que destacan:
1. Todas las imágenes tienen un alt descriptivo.
2. Se ha pasado cada una de las vistas por el LightHouse corrigiéndolas hasta que todas alcanzasen el 100% en todos los aspectos.
3. Se ha utilizado el Wave para arreglar cada vista y los únicos errores que no se ven resueltos son los inputs que no tienen label, pero al tener un placeholder es suficiente (de hecho, el LightHouse lo considera solucionado, porque los lectores de pantalla pueden leerlo).
4. Se ha añadido el atributo title en lugares que pueden ser poco descriptivos, como en admin_users en los iconos que identifican si un usuario está validado, pendiente de validar o expulsado.
5. A raíz de los errores de contraste de Wave y LightHouse, se han oscurecido algunos colores hasta que pasen esos filtros.
6. En el footer aparece la página web de la universidad: se ha cambiado "p" por "address" para ser más descriptivo.
7. En admin_facilities, cuando se crea una nueva instalación, se ha añadido el aria-required para indicar que esos campos son obligatorios. Lo mismo en el formulario de registro y el de enviar correo.
8. En los modales está el labelledby para identificar al modal, algo que el Wave valora positivamente, y también hay aria-hidden en todos los elementos ocultos.
9. En los formularios de búsqueda antes sólo estaba la lupa. Como los lectores no ven imágenes, hemos añadido al botón el texto "Buscar".
10. Se ha añadido un placeholder en los input tipo "file" porque el lector sólo lee "entrada de archivo" pero sin el placeholder no se sabría el objetivo de ese input.
11. En redactar un mensaje se ha añadido el title "Campo obligatorio" en el mensaje.
12. Se ha añadido un title al seleccionar la hora de una reserva, porque antes sólo se indicaba el estado del span con el color (rojo = lleno, amarillo = casi lleno, gris = disponible, azul = seleccionado).
13. Se utiliza como medida rem en lugar de pt o px, pues estas son medidas absolutas que no permiten redefinir los tamaños.

### Refactorización
El código se ha ido refactorizando conforme avanzaba el proyecto, pero algunas de las refactorizaciones más importantes han sido:
- ErrorHandler.js -> El manejo de errores siempre tenía el mismo código cuando se trataba de una petición "normal", y el mismo cuando se trataba de una petición AJAX. Por eso se ha generalizado en dos funciones manageError y manageAJAXError, además de incluir un generador de errores en base a códigos para no repetir el mismo {code, title, message} en varios sitios.
- Lo mismo ocurre para manejar respuestas, de forma que en el app.js se ha creado un último middleware que gestiona las respuestas en función de si son AJAX o no, e independientemente del contenido que deban devolver, de si hay error, o de qué vista debe renderizarse.
- Modal.html -> Cuando se hace una petición al servidor, esta muchas veces desencadena mostrar un modal mostrando la respuesta (de éxito o de fallo) que ha tenido la petición. Ese modal es igual en toda la aplicación, por lo que se ha creado un fragmento HTML que se rellena dinámicamente con jQuery y que se importa (include) en todos los EJS.
- showModal() -> Para rellenar el modal.html anterior, el código es igual independientemente de la respuesta, lo único que cambia son los colores en función de si la operación ha sido exitosa o no. Por eso, se ha creado en main.js (que se importa en todos los EJS) una función showModal() que rellena el modal a partir de una respuesta.
- confirm_modal.ejs -> En admin_users y en user_reservations se hace uso de un modal de confirmación cuya estructura es igual, cambiando los parámetros básicos. Por ello, se ha añadido una subplantilla confirm_modal que se rellena desde cada EJS con la información correspondiente, unificando los estilos en styles.css.
- styles.css -> En general, para evitar la repetición de código, se han incluido en styles.css estilos que se aplican en toda la aplicación por igual (por ejemplo, para el diseño de los botones o los enlaces).
- messagesUnread() -> En muchas peticiones (no AJAX), se debía pedir al DAO de mensajes que trajera el nº de mensajes no leídos por el usuario, pues hay que incluirlo en el nav (y en todas las vistas está el nav). Para evitar repetir todo ese código y la anidación de peticiones asíncronas, se ha creado como middleware una función del MessageController que obtiene ese número y lo incorpora a request. Así, en cada ruta sólo hay que incluir mesController.messagesUnread y desde las funciones posteriores de controladores pueden tomar el valor del request que les ha llegado.
- CSS compartidos -> Había algunos pares de vistas (sign_up&login, admin_index&user_index, admin_facilities&user_facilities, admin_reservations&user_reservations) que tenían elementos visuales que compartían estilos, por lo que cada par se ha unificado en un mismo fichero CSS para evitar repetir código.
- utils.js -> Cada vez que se obtiene una fecha o una hora de la BBDD se quería formatear para mostrarla por pantalla de una manera más accesible al usuario (en formato "DD/MM/YYYY"). Para no tener que escribir todo el código cada vez que se cogen, se han creado dos funciones formatDate() y formatHour() en el fichero utils.js que se pueden llamar desde cualquier DAO.