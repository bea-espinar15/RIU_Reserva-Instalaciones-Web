
"use strict"

// --- Importar módulos ---
// Core
const path = require("path");

// Paquete
const express = require("express");
const mySQL = require("mysql");
const session = require("express-session");
const mySQLsession = require("express-mysql-session");
const morgan = require("morgan");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

// Fichero
const mySQLconfig = require("./config");
const DAOFacilities = require("./dao/DAOFacilities");
const DAOMessages = require("./dao/DAOMessages");
const DAOReservations = require("./dao/DAOReservations");
const DAOUniversities = require("./dao/DAOUniversities");
const DAOUsers = require("./dao/DAOUsers");
const FacilityController = require("./controller/FacilityController");
const MessageController = require("./controller/MessageController");
const ReservationController = require("./controller/ReservationController");
const UniversityController = require("./controller/UniversityController");
const UserController = require("./controller/UserController");
const routerAdmin = require("./routes/RouterAdmin");
const routerPersonal = require("./routes/RouterPersonal");
const routerUser = require("./routes/RouterUser");

// --- Crear aplicación Express ---
const app = express();

// --- EJS ---
app.set("view engine", "ejs"); // Configurar EJS como motor de plantillas
app.set("views", path.join(__dirname, "views")); // Definir el directorio de plantillas

// --- Multer ---
const multerFactory = multer({ storage: multer.memoryStorage() });

// --- BodyParser (Express) ---
app.use(express.urlencoded({extended: true}));

// --- Static ---
app.use(express.static(path.join(__dirname, "public"))); // Gestionar ficheros estáticos con static

// --- Morgan ---
app.use(morgan("dev")); // Imprimir peticiones recibidas

// --- Sesiones y MySQL ---
// Sesión MySQL
const mySQLStore = mySQLsession(session);
const sessionStore = new mySQLStore(mySQLconfig.config);

// Crear middleware de la sesión
const middlewareSession = session({
    saveUninitialized: false,
    secret: "riuUCM18",
    resave: true,
    store: sessionStore
});
app.use(middlewareSession);

// Crear pool de conexiones
const pool = mySQL.createPool(mySQLconfig.config);

// --- DAOs y Controllers ---
// Crear instancias de los DAOs
// app.locals.daoFac = new DAOFacilities(pool);
// app.locals.daoMes = new DAOMessages(pool);
// app.locals.daoRes = new DAOReservations(pool);
// app.locals.daoUni = new DAOUniversities(pool);
// app.locals.daoUse = new DAOUsers(pool);
// Crear instancias de los Controllers
// app.locals.facController = new FacilityController(daoFac);
// app.locals.mesController = new MessageController(daoMes);
// app.locals.resController = new ReservationController(daoRes);
// app.locals.uniController = new UniversityController(daoUni);
// app.locals.useController = new UserController(daoUse);

// [!] BORRAR
const testData = require("./delete"); 

// --- VARIABLES GLOBALES de plantilla ---


// --- Middlewares ---
// [!] Comprobar que el usuario ha iniciado sesión
function userLogged(request, response, next) {
    next();
};

// [!] Comprobar que el usuario no está baneado
function userBanned(request, response, next) {
    next();
};

// [!] Comprobar que el usuario es admin
function isAdmin(request, response, next) {
    next();
}

// [!] Comprobar que el ID es el del usuario
function accessPicAllowed(request, response, next) {
    next();
}


// --- Peticiones GET ---

// - Rutas -
// SignUp
app.get("/registro", (request, response, next) => {
    response.render("sign_up", { error: undefined });
});

// Login
app.get("/login", (request, response, next) => {
    response.render("login", { error: undefined });
});

// Inicio
app.get(["/", "/inicio"], userLogged, userBanned, (request, response, next) => {
    if (request.session.currentUser.rol) { // Admin
        response.redirect("/admin/inicio");
    }
    else { // User
        response.redirect("/usuario/inicio");
    }
});

// Reservas
app.get("/reservas", userLogged, userBanned, (request, response, next) => {
    if (request.session.currentUser.rol) { // Admin
        response.redirect("/admin/reservas");
    }
    else { // User
        response.redirect("/usuario/reservas");
    }
});

// - Routers -
app.use("/admin", userLogged, userBanned, isAdmin, routerAdmin);
app.use("/personal", userLogged, userBanned, routerPersonal);
app.use("/usuario", userLogged, userBanned, routerUser);

// - Otras peticiones GET -
// Imagen del usuario
app.get("/profilePic/:id", userLogged, userBanned, accessPicAllowed, (request, response, next) => {
    response.end(undefined);
});

// Logo de la universidad
app.get("/universityPic/:id", userLogged, userBanned, (request, response, next) => {
    response.end(undefined);
});

// Foto del tipo de instalación
app.get("/facilityTypePic/:id", userLogged, userBanned, (request, response, next) => {
    response.end(undefined);
});

// Foto de la instalación
app.get("/facilityPic/:id", userLogged, userBanned, (request, response, next) => {
    response.end(undefined);
});

// --- Peticiones POST ---
// [TODO]

// --- Middlewares de respuestas y errores ---
// Error 404
app.use((request, response, next) => {
    next({
        ajax: false,
        status: 404,
        redirect: "error",
        data: {
            code: 404,
            title: "Oops! Página no encontrada :(",
            message: "La página a la que intentas acceder no existe."
        }
    }); 
});

// Manejador de respuestas 
app.use((responseData, request, response, next) => {
    // Respuestas AJAX
    if (responseData.ajax) {
        if (responseData.error) {
            response.status(responseData.status).send(responseData.error);
            response.end();
        }
        else if (responseData.img) {
            response.end(responseData.img);
        }
        else {
            response.json(responseData.data);
        }
    }
    // Respuestas no AJAX
    else {
        response.status(responseData.status);
        response.render(responseData.redirect, responseData.data);
    }
});

// --- Iniciar el servidor ---
app.listen(mySQLconfig.port, (error) => {
    if (error) {
        console.error(`Se ha producido un error al iniciar el servidor: ${error.message}`);
    }
    else {
        console.log(`Se ha arrancado el servidor en el puerto ${mySQLconfig.port}`);
    }
});