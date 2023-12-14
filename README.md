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